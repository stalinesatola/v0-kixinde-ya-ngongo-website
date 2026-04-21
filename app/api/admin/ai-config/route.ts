import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'
import { errorLogger } from '@/lib/error-logger'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('[v0] GET /api/admin/ai-config - iniciando')
    const user = await getSessionUser()
    console.log('[v0] User obtido:', user?.id, 'Role:', user?.role)
    
    if (!user || user.role !== 'admin') {
      console.log('[v0] Acesso negado - não é admin')
      return NextResponse.json(
        createErrorResponse('Não autorizado', 403),
        { status: 403 }
      )
    }

    console.log('[v0] Buscando configuração IA...')
    const config = await db.getAIConfig()
    console.log('[v0] Config encontrada:', config ? 'sim' : 'não')
    return NextResponse.json(createSuccessResponse({ config }))
  } catch (error) {
    console.error('[v0] Exceção no GET:', error)
    const errorId = errorLogger.error(
      'Erro ao obter configuração IA',
      { endpoint: '/api/admin/ai-config', method: 'GET' },
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
    console.log('[v0] POST /api/admin/ai-config - iniciando')
    const user = await getSessionUser()
    console.log('[v0] User obtido:', user?.id, 'Role:', user?.role)
    
    if (!user || user.role !== 'admin') {
      console.log('[v0] Acesso negado - não é admin')
      return NextResponse.json(
        createErrorResponse('Não autorizado', 403),
        { status: 403 }
      )
    }

    const data = await request.json()
    console.log('[v0] Dados recebidos:', { provider: data.provider, model: data.model })
    
    // Validação básica
    if (!data.provider || !data.model) {
      console.log('[v0] Erro: provider ou model faltando')
      return NextResponse.json(
        createErrorResponse('Provider e Model são obrigatórios', 400),
        { status: 400 }
      )
    }

    const configData = {
      provider: data.provider,
      model: data.model,
      api_key_encrypted: data.apiKey || '', // Será encriptado
      system_prompt: data.systemPrompt,
      is_active: true,
      temperature: data.temperature || 0.7,
      max_tokens: data.maxTokens || 1000,
    }
    console.log('[v0] Config final a guardar:', { provider: configData.provider, model: configData.model })
    
    // Check if config exists
    console.log('[v0] Buscando configuração existente...')
    const existing = await db.getAIConfig()
    console.log('[v0] Config ativa encontrada:', existing ? 'sim' : 'não')
    
    let config
    if (existing) {
      console.log('[v0] Atualizando config existente com ID:', existing.id)
      config = await db.updateAIConfig(existing.id, configData)
      console.log('[v0] Configuração IA atualizada')
    } else {
      console.log('[v0] Criando nova config IA...')
      config = await db.createAIConfig(configData)
      console.log('[v0] Configuração IA criada com ID:', config.id)
    }
    
    // Verificação final
    if (!config) {
      console.error('[v0] Erro crítico: config é null após save')
      return NextResponse.json(
        createErrorResponse('Erro ao guardar configuração', 500),
        { status: 500 }
      )
    }
    
    console.log('[v0] Config guardada com sucesso')
    return NextResponse.json(createSuccessResponse({ config }))
  } catch (error) {
    console.error('[v0] Exceção no POST:', error)
    const errorId = errorLogger.error(
      'Erro ao salvar configuração IA',
      { endpoint: '/api/admin/ai-config', method: 'POST' },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Erro ao salvar configuração', 500, errorId),
      { status: 500 }
    )
  }
}
