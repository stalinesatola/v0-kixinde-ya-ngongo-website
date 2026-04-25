import { streamText } from 'ai'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { createErrorResponse } from '@/lib/api-response'
import { errorLogger } from '@/lib/error-logger'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('[v0] POST /api/ai/chat - iniciando')

    const { messages, conversationId } = await request.json()
    console.log('[v0] Conversação:', conversationId, 'Mensagens:', messages.length)

    // Get AI config
    const config = await db.getAIConfig()
    if (!config?.is_active) {
      console.log('[v0] IA não está ativada ou não configurada')
      return NextResponse.json(
        createErrorResponse('IA não está disponível. Configure em /admin/ai-config', 'AI_UNAVAILABLE'),
        { status: 503 }
      )
    }

    console.log('[v0] Usando modelo:', config.model)

    // Convert messages to AI SDK format if needed
    const aiMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    }))

    // Stream the response
    const result = streamText({
      model: `${config.provider}/${config.model}`,
      system: config.system_prompt || 'You are a helpful assistant for architectural projects.',
      messages: aiMessages,
      temperature: config.temperature || 0.7,
      maxTokens: config.max_tokens || 1000,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[v0] Erro no chat:', error)
    const errorId = errorLogger.error(
      'Erro ao processar chat',
      { endpoint: '/api/ai/chat', method: 'POST' },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Erro ao processar chat', 'INTERNAL_ERROR', errorId),
      { status: 500 }
    )
  }
}
