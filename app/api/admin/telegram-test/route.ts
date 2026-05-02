import { getSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendTelegramNotification } from '@/lib/telegram-utils'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'
import { errorLogger } from '@/lib/error-logger'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const user = await getSessionUser()
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        createErrorResponse('Não autorizado', 403),
        { status: 403 }
      )
    }

    // Get config to verify it exists
    const config = await db.getTelegramConfig()
    if (!config) {
      return NextResponse.json(
        createErrorResponse('Telegram não está configurado. Por favor, configure o Bot Token e Chat ID primeiro.', 400),
        { status: 400 }
      )
    }

    if (!config.isActive) {
      return NextResponse.json(
        createErrorResponse('Telegram está desativado. Ative a opção "Ativar Telegram" para enviar notificações.', 400),
        { status: 400 }
      )
    }

    const testMessage = `
✅ <b>Teste de Configuração</b>

Este é um teste da configuração Telegram de KIXINDE YA NGONGO.

Se você vê esta mensagem, tudo está funcionando corretamente!

🎉 Parabéns! As notificações de projetos serão enviadas para este canal.
    `.trim()

    const success = await sendTelegramNotification(testMessage)

    if (success) {
      return NextResponse.json(createSuccessResponse({ message: 'Mensagem de teste enviada com sucesso' }))
    } else {
      return NextResponse.json(
        createErrorResponse('Erro ao enviar mensagem de teste. Verifique Bot Token e Chat ID. Consulte os logs para mais detalhes.', 500),
        { status: 500 }
      )
    }
  } catch (error) {
    const errorId = errorLogger.error(
      'Erro ao testar Telegram',
      { endpoint: '/api/admin/telegram-test', method: 'POST' },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Erro ao enviar teste', 500, errorId),
      { status: 500 }
    )
  }
}
