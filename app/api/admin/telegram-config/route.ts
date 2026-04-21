import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'
import { errorLogger } from '@/lib/error-logger'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('[v0] GET /api/admin/telegram-config - iniciando')
    const user = await getSessionUser()
    console.log('[v0] User obtido:', user?.id, 'Role:', user?.role)
    
    if (!user || user.role !== 'admin') {
      console.log('[v0] Acesso negado - não é admin')
      return NextResponse.json(
        createErrorResponse('Não autorizado', 403),
        { status: 403 }
      )
    }

    console.log('[v0] Buscando configuração...')
    const config = await db.getTelegramConfig()
    console.log('[v0] Config encontrada:', config ? 'sim' : 'não')
    return NextResponse.json(createSuccessResponse({ config }))
  } catch (error) {
    console.error('[v0] Exceção no GET:', error)
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
    console.log('[v0] POST /api/admin/telegram-config - iniciando')
    const user = await getSessionUser()
    console.log('[v0] User obtido:', user?.id, 'Role:', user?.role, 'Email:', user?.email)
    
    if (!user) {
      console.log('[v0] Erro: utilizador não autenticado (null)')
      return NextResponse.json(
        createErrorResponse('Utilizador não autenticado', 401),
        { status: 401 }
      )
    }
    
    if (user.role !== 'admin') {
      console.log('[v0] Erro: utilizador não é admin. Role atual:', user.role)
      return NextResponse.json(
        createErrorResponse('Apenas administradores podem fazer isto', 403),
        { status: 403 }
      )
    }

    const data = await request.json()
    console.log('[v0] Dados recebidos:', { botToken: data.botToken ? '***' : null, chatId: data.chatId })
    
    // Validação básica
    if (!data.botToken || !data.chatId) {
      console.log('[v0] Erro: botToken ou chatId faltando')
      return NextResponse.json(
        createErrorResponse('Bot Token e Chat ID são obrigatórios', 400),
        { status: 400 }
      )
    }
    
    // Check if config exists
    console.log('[v0] Buscando configuração existente...')
    const existing = await db.getTelegramConfig()
    console.log('[v0] Config existente:', existing ? 'sim' : 'não')
    
    let config
    if (existing) {
      console.log('[v0] Atualizando config existente...')
      config = await db.updateTelegramConfig(existing.id, data)
      console.log('[v0] Configuração Telegram atualizada:', config)
    } else {
      console.log('[v0] Criando nova config...')
      config = await db.createTelegramConfig(data)
      console.log('[v0] Configuração Telegram criada:', config)
    }
    
    console.log('[v0] Config salva com sucesso')
    return NextResponse.json(createSuccessResponse({ config }))
  } catch (error) {
    console.error('[v0] Exceção no POST:', error)
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
