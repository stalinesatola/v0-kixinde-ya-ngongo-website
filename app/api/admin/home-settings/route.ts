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
        createErrorResponse('Não autorizado', 'UNAUTHORIZED'),
        { status: 403 }
      )
    }

    const settings = await db.getHomePageSettings()
    return NextResponse.json(createSuccessResponse({ settings }))
  } catch (error) {
    console.error('[v0] Erro ao obter configurações da página inicial:', error)
    const errorId = errorLogger.error(
      'Erro ao obter configurações da página inicial',
      { endpoint: '/api/admin/home-settings', method: 'GET' },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Erro ao obter configurações', 'INTERNAL_ERROR', errorId),
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        createErrorResponse('Não autorizado', 'UNAUTHORIZED'),
        { status: 403 }
      )
    }

    const data = await request.json()
    const settingsData = {
      showFooter: Boolean(data.showFooter),
      showMenu: Boolean(data.showMenu),
      showHomeBody: Boolean(data.showHomeBody),
      customColorsEnabled: Boolean(data.customColorsEnabled),
      accentColor: typeof data.accentColor === 'string' && data.accentColor.trim() ? data.accentColor.trim() : '#F7A71C',
      bodyBackground: typeof data.bodyBackground === 'string' && data.bodyBackground.trim() ? data.bodyBackground.trim() : '#ffffff',
    }

    const existing = await db.getHomePageSettings()
    let settings
    if (existing) {
      settings = await db.updateHomePageSettings(existing.id, settingsData)
    } else {
      settings = await db.createHomePageSettings(settingsData)
    }

    if (!settings) {
      return NextResponse.json(
        createErrorResponse('Erro ao guardar configurações', 'SAVE_FAILED'),
        { status: 500 }
      )
    }

    return NextResponse.json(createSuccessResponse({ settings }))
  } catch (error) {
    console.error('[v0] Erro ao salvar configurações da página inicial:', error)
    const errorId = errorLogger.error(
      'Erro ao salvar configurações da página inicial',
      { endpoint: '/api/admin/home-settings', method: 'POST' },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse('Erro ao salvar configurações', 'INTERNAL_ERROR', errorId),
      { status: 500 }
    )
  }
}
