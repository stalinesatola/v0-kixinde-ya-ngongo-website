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
        createErrorResponse('Não autorizado', 'UNAUTHORIZED'),
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
      createErrorResponse('Erro ao obter configuração', 'INTERNAL_ERROR', errorId),
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
        createErrorResponse('Utilizador não autenticado', 'UNAUTHENTICATED'),
        { status: 401 }
      )
    }
    
    if (user.role !== 'admin') {
      console.log('[v0] Erro: utilizador não é admin. Role atual:', user.role)
      return NextResponse.json(
        createErrorResponse('Apenas administradores podem fazer isto', 'FORBIDDEN'),
        { status: 403 }
      )
    }

    const data = await request.json()
    console.log('[v0] Dados recebidos:', { botToken: data.botToken ? '***' : null, chatId: data.chatId, isActive: data.isActive })
    
    // Validação básica
    if (!data.botToken || !data.chatId) {
      console.log('[v0] Erro: botToken ou chatId faltando')
      return NextResponse.json(
        createErrorResponse('Bot Token e Chat ID são obrigatórios', 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }
    
    // Garantir que isActive é sempre true por padrão
    const configData = {
      botToken: data.botToken,
      chatId: data.chatId,
      isActive: true, // SEMPRE true quando se salva
    }
    console.log('[v0] Config final a guardar:', { botToken: '***', chatId: configData.chatId, isActive: configData.isActive })
    
    // Check if config exists
    console.log('[v0] Buscando configuração existente...')
    const existing = await db.getTelegramConfig()
    console.log('[v0] Config ativa encontrada:', existing ? 'sim' : 'não')
    
    let config
    if (existing) {
      console.log('[v0] Atualizando config existente com ID:', existing.id)
      config = await db.updateTelegramConfig(existing.id, configData)
      console.log('[v0] Configuração Telegram atualizada')
    } else {
      console.log('[v0] Criando nova config...')
      config = await db.createTelegramConfig(configData)
      console.log('[v0] Configuração Telegram criada com ID:', config.id)
    }
    
    // Verificação final
    if (!config) {
      console.error('[v0] Erro crítico: config é null após save')
      return NextResponse.json(
        createErrorResponse('Erro ao guardar configuração', 'SAVE_FAILED'),
        { status: 500 }
      )
    }
    
    console.log('[v0] Config guardada com sucesso. Verificando recuperação...')
    const retrievedConfig = await db.getTelegramConfig()
    console.log('[v0] Config recuperada:', retrievedConfig ? 'sim (ativa)' : 'não encontrada')
    
    return NextResponse.json(createSuccessResponse({ config }))
  } catch (error) {
    console.error('[v0] Exceção no POST:', error)
    const errorId = errorLogger.error(
      'Erro ao salvar configuração Telegram',
      { endpoint: '/api/admin/telegram-config', method: 'POST' },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Erro ao salvar configuração', 'INTERNAL_ERROR', errorId),
      { status: 500 }
    )
  }
}
