import { getSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'
import { errorLogger } from '@/lib/error-logger'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('[v0] Iniciando teste de IA...')
    const user = await getSessionUser()
    console.log('[v0] Usuário:', user?.id, 'Role:', user?.role)
    
    if (!user || user.role !== 'admin') {
      console.log('[v0] Acesso negado - não é admin')
      return NextResponse.json(
        createErrorResponse('Não autorizado', 'UNAUTHORIZED'),
        { status: 403 }
      )
    }

    // Get AI config
    const config = await db.getAIConfig()
    if (!config?.is_active) {
      console.log('[v0] IA não está ativada')
      return NextResponse.json(
        createErrorResponse('IA não está configurada ou ativada', 'NOT_CONFIGURED'),
        { status: 400 }
      )
    }

    console.log('[v0] Enviando mensagem de teste para IA...')
    
    // Test message
    const testMessage = `Test message from KIXINDE YA NGONGO. Please respond with a brief greeting in Portuguese.`

    try {
      // Dynamic import of AI SDK based on provider
      const { generateText } = await import('ai')
      
      const modelString = `${config.provider}/${config.model}`
      console.log('[v0] Usando modelo:', modelString)
      
      const result = await generateText({
        model: modelString,
        system: config.system_prompt || 'You are a helpful assistant.',
        prompt: testMessage,
        maxTokens: 100,
      })
      
      console.log('[v0] Resposta recebida:', result.text.substring(0, 50) + '...')
      
      return NextResponse.json(
        createSuccessResponse({ 
          message: 'Teste de IA bem-sucedido!',
          response: result.text,
        })
      )
    } catch (aiError) {
      console.error('[v0] Erro ao chamar IA:', aiError)
      const errorMessage = aiError instanceof Error ? aiError.message : 'Erro desconhecido ao chamar IA'
      return NextResponse.json(
        createErrorResponse(`Erro ao testar IA: ${errorMessage}`, 'AI_ERROR'),
        { status: 500 }
      )
    }
  } catch (error) {
    const errorId = errorLogger.error(
      'Erro ao testar IA',
      { endpoint: '/api/admin/ai-test', method: 'POST' },
      error instanceof Error ? error : new Error(String(error))
    )
    console.error('[v0] Exceção no teste:', error)
    return NextResponse.json(
      createErrorResponse('Erro ao testar IA', 'INTERNAL_ERROR', errorId),
      { status: 500 }
    )
  }
}
