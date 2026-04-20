# Backend Debug Guide

## Problemas Identificados e Soluções

### 1. Database Initialization
O `db.ts` cria automaticamente um utilizador demo ao inicializar:
- **Email**: `admin@kixindeyangongo.ao`
- **Senha**: `demo123` (hash SHA256)
- **ID**: `admin-001`

### 2. Password Hashing Issue
O sistema usa SHA256 para hash de senhas (NÃO é seguro para produção):
```typescript
hashPassword("demo123") = crypto.createHash("sha256").update(password).digest("hex")
```

### 3. Login Flow
1. Cliente envia POST para `/api/auth/login` com `{email, password}`
2. API chama `loginUser(email, password)`
3. `loginUser` busca user por email e compara senha
4. Se válido, define cookie `kixinde_session` com user ID

### 4. Session Management
- Cookie name: `kixinde_session`
- Cookie value: user ID (ex: `admin-001`)
- HttpOnly: true (não acessível via JavaScript)
- SameSite: lax
- MaxAge: 7 dias

## Como Testar

### Opção 1: Teste Automático
Visite: `http://localhost:3000/test-auth`
- Clique "Executar Testes"
- Verifica backend e tenta fazer login
- Mostra resultados em JSON

### Opção 2: Teste Manual
1. Abra DevTools (F12)
2. Vá para Console
3. Execute:
```javascript
fetch('/api/auth/test').then(r => r.json()).then(console.log)
```

### Opção 3: cURL
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kixindeyangongo.ao","password":"demo123"}'
```

## Possíveis Problemas

### A. "User não encontrado"
- Verifica se a database foi inicializada
- Verifica se o user demo existe
- Execute teste em `/test-auth` para confirmar

### B. "Senha inválida"
- Verifica se o hash está correto
- Verifica se a senha é `demo123` (case-sensitive)
- Execute teste em `/test-auth` para confirmar

### C. "Cookie não definido"
- Verifica DevTools → Application → Cookies
- Procura por `kixinde_session`
- Se vazio, o login retornou erro 401/400

### D. "Redirecionamento não acontece"
- Verifica console do navegador para erros
- Verifica se há erro 500 na API
- Confirma que cookie foi definido

## Logs Disponíveis

### Frontend Logs (Browser Console)
- `[v0] Login - enviando para /api/auth/login`
- `[v0] Login - resposta status: XXX`
- `[v0] Login - erro: ...` (se houver erro)

### Backend Logs (Server Console)
- `[v0] API Login - iniciando`
- `[v0] API Login - email: admin@kixindeyangongo.ao`
- `[v0] API Login - user encontrado: admin-001`
- `[v0] loginUser - senha válida: true/false`

## Próximos Passos

1. Execute `/test-auth` para confirmar backend funciona
2. Se backend OK, problema está no frontend/middleware
3. Se backend FALHA, problema está na database/auth

## Credenciais Demo
- **Email**: `admin@kixindeyangongo.ao`
- **Senha**: `demo123`
