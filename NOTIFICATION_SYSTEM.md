# Sistema de Notificações e Erros Completo

## Overview

Sistema completo de notificações, logging de erros e tratamento de exceções sem erros silenciosos. Inclui:

- Notificações visuais (Toast) com Sonner
- Logging estruturado de erros com IDs únicos
- Fetch wrapper com retry automático e timeout
- Error Boundary para erros de React
- Padrão unificado de respostas API
- Global error handlers para uncaught errors

## 1. Hook de Notificações

### Import
```typescript
import { useNotification } from '@/hooks/useNotification'
```

### Tipos de Notificações

#### Success
```typescript
const notify = useNotification()
notify.success("Operação realizada com sucesso!")
notify.success("Guardado!", { duration: 2000 })
```

#### Error (com Error ID)
```typescript
notify.error("Email inválido", "ERR-001")
notify.error("Falha no servidor", undefined, { duration: 5000 })
```

#### Warning
```typescript
notify.warning("Este campo é obrigatório")
```

#### Info
```typescript
notify.info("Operação em progresso...")
```

#### Loading
```typescript
const toastId = notify.loading("A processar...")
// Depois mostrar sucesso/erro
```

#### Promise
```typescript
notify.promise(
  fetch('/api/data'),
  {
    loading: 'A carregar dados...',
    success: 'Dados carregados!',
    error: 'Erro ao carregar dados'
  }
)
```

## 2. Fetch Wrapper com Retry

### Import
```typescript
import { fetchJson, fetchWithRetry } from '@/lib/fetch-wrapper'
```

### Uso Básico
```typescript
// Com tratamento automático de retry e timeout
const data = await fetchJson('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' })
})
```

### Opções Avançadas
```typescript
const data = await fetchJson('/api/endpoint', {
  method: 'GET',
  timeout: 10000,      // 10 segundos
  retries: 3,          // Tentar 3 vezes
  retryDelay: 500      // Delay entre tentativas
})
```

### Tratamento de Erros
```typescript
try {
  const data = await fetchJson('/api/data')
} catch (error) {
  // Erro com contexto completo
  const errorId = errorLogger.error('Fetch failed', {}, error)
  notify.error('Erro ao carregar dados', errorId)
}
```

## 3. Error Logger Global

### Import
```typescript
import { errorLogger } from '@/lib/error-logger'
```

### Usar Error Logger
```typescript
// Log de erro com contexto
const errorId = errorLogger.error(
  'User registration failed',
  { email: 'user@example.com', reason: 'Email exists' },
  error
)

// Log de warning
errorLogger.warning('High memory usage detected')

// Log de info
errorLogger.info('User logged in successfully')

// Obter todos os logs
const logs = errorLogger.getLogs()

// Exportar logs para debug
console.log(errorLogger.exportLogs())
```

### ID Único de Erro
Cada erro tem um ID único: `ERR-{timestamp}-{random}`
Use este ID para:
- Mostrar ao utilizador
- Enviar para backend para logging
- Correlacionar eventos
- Debugging

## 4. Padrão de Resposta API

### Backend (API Route)
```typescript
import { createSuccessResponse, createErrorResponse, handleApiError, ApiError } from '@/lib/api-response'
import { handleApiError } from '@/lib/error-handler'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    if (!data.email) {
      throw new ApiError('Email é obrigatório', 'VALIDATION_ERROR', 400)
    }
    
    // Processar...
    return NextResponse.json(createSuccessResponse({ userId: '123' }))
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Frontend (Usar resposta)
```typescript
const response = await fetchJson('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
})

if (!response.success) {
  const { message, id, code } = response.error
  notify.error(`[${code}] ${message}`, id)
  return
}

notify.success('Operação realizada com sucesso!')
```

## 5. Error Boundary

### Envolver componentes críticos
```typescript
import { ErrorBoundary } from '@/components/error-boundary'

export default function Page() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  )
}
```

### Custom fallback
```typescript
<ErrorBoundary fallback={(error, reset) => (
  <div>
    <h2>Algo correu mal: {error.message}</h2>
    <button onClick={reset}>Tentar novamente</button>
  </div>
)}>
  <YourComponent />
</ErrorBoundary>
```

## 6. Exemplo Completo: Formulário com Validação

```typescript
'use client'

import { useState } from 'react'
import { useNotification } from '@/hooks/useNotification'
import { fetchJson } from '@/lib/fetch-wrapper'
import { errorLogger } from '@/lib/error-logger'

export function RegisterForm() {
  const notify = useNotification()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        email: formData.get('email'),
        password: formData.get('password')
      }

      // Validação local
      if (!data.email || !data.password) {
        notify.warning('Preecha todos os campos')
        setLoading(false)
        return
      }

      // Enviar para API
      const response = await fetchJson('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (!response.success) {
        notify.error(response.error.message, response.error.id)
        return
      }

      notify.success('Registro realizado com sucesso!')
      // Redirecionar ou atualizar estado
    } catch (error) {
      const errorId = errorLogger.error(
        'Registration failed',
        { email: data.email },
        error instanceof Error ? error : new Error(String(error))
      )
      notify.error('Erro ao registar utilizador', errorId)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loading}>
        {loading ? 'A registar...' : 'Registar'}
      </button>
    </form>
  )
}
```

## 7. Boas Práticas

### ✓ DO's
- Sempre usar `useNotification()` para feedback do utilizador
- Logar contexto relevante com `errorLogger.error()`
- Usar IDs de erro em notificações
- Sempre fazer try/catch em async operations
- Usar `fetchJson` para chamadas API
- Envolver componentes críticos em `<ErrorBoundary />`

### ✗ DON'Ts
- Não usar `console.error` diretamente (use `errorLogger`)
- Não deixar promessas sem tratamento
- Não usar `fetch` direto (use `fetchJson`)
- Não mostrar erros genéricos ao utilizador
- Não esconder erros sem logging

## 8. Debugging

### Ver logs no console
```
[v0-notify] Success: ...
[v0-notify] Error [ERR-xxx]: ...
[v0-api-error] timestamp [ERROR-ID] CODE: message
[v0-ERROR] [LOG-ID] timestamp: message
```

### Acessar logs globais (no console browser)
```javascript
// Import manualmente no console
import { errorLogger } from '/lib/error-logger.ts'
errorLogger.getLogs() // Array com todos os logs
errorLogger.exportLogs() // JSON para copiar
```

## 9. Troubleshooting

### Erros silenciosos
Se um erro não está aparecendo:
1. Verifique se está dentro de um try/catch
2. Verifique se `errorLogger.error()` está sendo chamado
3. Verifique o Error Boundary está envolvendo o componente
4. Abra DevTools (F12) e procure por `[v0-` nos logs

### Notificações não aparecem
1. Verifique se `<Toaster />` está no layout.tsx
2. Verifique se `useNotification()` está importado
3. Verifique se é um Client Component (`'use client'`)

### Fetch está falhando
1. Verifique se timeout é suficiente (padrão 30s)
2. Verifique retries (padrão 3)
3. Verifique CORS se estiver em outro domínio
4. Verifique logs do servidor

