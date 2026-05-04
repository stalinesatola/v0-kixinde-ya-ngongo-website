import { db } from '@/lib/db'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const settings = await db.getHomePageSettings()
    return NextResponse.json(createSuccessResponse({ settings }))
  } catch (error) {
    console.error('[v0] Erro ao obter configurações públicas da página inicial:', error)
    return NextResponse.json(
      createErrorResponse('Erro ao obter configurações', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}
