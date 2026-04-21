import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'
import { errorLogger } from '@/lib/error-logger'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        createErrorResponse('Não autorizado', 403),
        { status: 403 }
      )
    }

    const config = await db.getTelegramConfig()
    return NextResponse.json(createSuccessResponse({ config }))
  } catch (error) {
    const errorId = errorLogger.error(
      'Erro ao obter configuração Telegram',
      { endpoint: '/api/admin/telegram-config', method: 'GET' },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Erro ao obter configuração', 500, errorId),
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        createErrorResponse('Não autorizado', 403),
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Validação básica
    if (!data.botToken || !data.chatId) {
      return NextResponse.json(
        createErrorResponse('Bot Token e Chat ID são obrigatórios', 400),
        { status: 400 }
      )
    }
    
    // Check if config exists
    const existing = await db.getTelegramConfig()
    
    let config
    if (existing) {
      config = await db.updateTelegramConfig(existing.id, data)
      console.log('[v0] Configuração Telegram atualizada:', config)
    } else {
      config = await db.createTelegramConfig(data)
      console.log('[v0] Configuração Telegram criada:', config)
    }
    
    return NextResponse.json(createSuccessResponse({ config }))
  } catch (error) {
    const errorId = errorLogger.error(
      'Erro ao salvar configuração Telegram',
      { endpoint: '/api/admin/telegram-config', method: 'POST' },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Erro ao salvar configuração', 500, errorId),
      { status: 500 }
    )
  }
}
