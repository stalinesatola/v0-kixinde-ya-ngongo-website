import { getSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendTelegramNotification } from '@/lib/telegram-utils'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'
import { errorLogger } from '@/lib/error-logger'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('[v0] Iniciando teste de Telegram...')
    const user = await getSessionUser()
    console.log('[v0] Usuário:', user?.id, 'Role:', user?.role)
    
    if (!user || user.role !== 'admin') {
      console.log('[v0] Acesso negado - não é admin')
      return NextResponse.json(
        createErrorResponse('Não autorizado', 'UNAUTHORIZED'),
        { status: 403 }
      )
    }

    // Get config to verify it exists
    const config = await db.getTelegramConfig()
    if (!config) {
      console.log('[v0] Nenhuma configuração Telegram encontrada')
      return NextResponse.json(
        createErrorResponse('Telegram não está configurado. Por favor, configure o Bot Token e Chat ID primeiro.', 'NOT_CONFIGURED'),
        { status: 400 }
      )
    }

    if (!config.isActive) {
      console.log('[v0] Telegram está desativado')
      return NextResponse.json(
        createErrorResponse('Telegram está desativado. Ative a opção "Ativar Telegram" para enviar notificações.', 'DISABLED'),
        { status: 400 }
      )
    }

    console.log('[v0] Enviando mensagem de teste...')
    const testMessage = `
✅ <b>Teste de Configuração</b>

Este é um teste da configuração Telegram de KIXINDE YA NGONGO.

Se você vê esta mensagem, tudo está funcionando corretamente!

🎉 Parabéns! As notificações de projetos serão enviadas para este canal.
    `.trim()

    console.log('[v0] Chamando sendTelegramNotification...')
    const success = await sendTelegramNotification(testMessage)
    console.log('[v0] Resultado do envio:', success)

    if (success) {
      console.log('[v0] Teste enviado com sucesso')
      return NextResponse.json(createSuccessResponse({ message: 'Mensagem de teste enviada com sucesso' }))
    } else {
      console.log('[v0] Falha ao enviar - sendTelegramNotification retornou false. Verifique os logs acima.')
      return NextResponse.json(
        createErrorResponse('Erro ao enviar mensagem de teste. Verifique Bot Token e Chat ID. Consulte os logs para mais detalhes.', 'SEND_FAILED'),
        { status: 500 }
      )
    }
  } catch (error) {
    const errorId = errorLogger.error(
      'Erro ao testar Telegram',
      { endpoint: '/api/admin/telegram-test', method: 'POST' },
      error instanceof Error ? error : new Error(String(error))
    )
    console.error('[v0] Exceção no teste:', error)
    return NextResponse.json(
      createErrorResponse('Erro ao enviar teste', 'INTERNAL_ERROR', errorId),
      { status: 500 }
    )
  }
}
