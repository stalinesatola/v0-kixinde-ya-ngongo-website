import { streamText } from 'ai'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { createErrorResponse } from '@/lib/api-response'
import { errorLogger } from '@/lib/error-logger'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('[v0] POST /api/ai/chat - iniciando')
    
    const user = await getSessionUser()
    if (!user) {
      console.log('[v0] Usuário não autenticado')
      return NextResponse.json(
        createErrorResponse('Não autenticado', 401),
        { status: 401 }
      )
    }

    const { messages, conversationId } = await request.json()
    console.log('[v0] Conversação:', conversationId, 'Mensagens:', messages.length)

    // Get AI config
    const config = await db.getAIConfig()
    if (!config?.is_active) {
      console.log('[v0] IA não está ativada')
      return NextResponse.json(
        createErrorResponse('IA não está disponível', 503),
        { status: 503 }
      )
    }

    console.log('[v0] Usando modelo:', config.model)

    // Convert messages to AI SDK format if needed
    const aiMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Create or get conversation if needed
    let convId = conversationId
    if (!convId) {
      console.log('[v0] Criando nova conversa...')
      const newConv = await db.createConversation(user.id || '', {
        title: aiMessages[aiMessages.length - 1]?.content?.substring(0, 50) || 'Chat',
      })
      convId = newConv.id
      console.log('[v0] Conversa criada:', convId)
    }

    // Stream the response
    const result = streamText({
      model: `${config.provider}/${config.model}`,
      system: config.system_prompt || 'You are a helpful assistant.',
      messages: aiMessages,
      temperature: config.temperature || 0.7,
      maxTokens: config.max_tokens || 1000,
      onFinish: async ({ text }) => {
        try {
          console.log('[v0] Salvando mensagens na conversa...')
          // Save user message
          if (aiMessages.length > 0) {
            const lastMsg = aiMessages[aiMessages.length - 1]
            if (lastMsg.role === 'user') {
              await db.createMessage({
                conversation_id: convId,
                role: 'user',
                content: lastMsg.content,
                model_used: config.model,
              })
            }
          }
          // Save assistant response
          await db.createMessage({
            conversation_id: convId,
            role: 'assistant',
            content: text,
            model_used: config.model,
          })
          console.log('[v0] Mensagens salvas com sucesso')
        } catch (error) {
          console.error('[v0] Erro ao salvar mensagens:', error)
        }
      },
    })

    return result.toUIMessageStreamResponse({
      headers: {
        'X-Conversation-ID': convId,
      },
    })
  } catch (error) {
    console.error('[v0] Erro no chat:', error)
    const errorId = errorLogger.error(
      'Erro ao processar chat',
      { endpoint: '/api/ai/chat', method: 'POST' },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Erro ao processar chat', 500, errorId),
      { status: 500 }
    )
  }
}
