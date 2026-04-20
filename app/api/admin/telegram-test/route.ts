import { getSessionUser } from '@/lib/auth'
import { sendTelegramNotification } from '@/lib/telegram-utils'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })
    }

    const testMessage = `
✅ <b>Teste de Configuração</b>

Este é um teste da configuração Telegram de KIXINDE YA NGONGO.

Se você vê esta mensagem, tudo está funcionando corretamente!

🎉 Parabéns! As notificações de projetos serão enviadas para este canal.
    `.trim()

    const success = await sendTelegramNotification(testMessage)

    if (success) {
      return NextResponse.json({ success: true, message: 'Teste enviado com sucesso' })
    } else {
      return NextResponse.json({ error: 'Erro ao enviar teste' }, { status: 500 })
    }
  } catch (error) {
    console.error('[v0] Erro ao testar Telegram:', error)
    return NextResponse.json({ error: 'Erro ao testar' }, { status: 500 })
  }
}
