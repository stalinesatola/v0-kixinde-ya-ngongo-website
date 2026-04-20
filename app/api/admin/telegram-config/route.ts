import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })
    }

    const config = await db.getTelegramConfig()
    return NextResponse.json({ config })
  } catch (error) {
    console.error('[v0] Erro ao obter config:', error)
    return NextResponse.json({ error: 'Erro ao obter configuração' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })
    }

    const data = await request.json()
    
    // Check if config exists
    const existing = await db.getTelegramConfig()
    
    if (existing) {
      const config = await db.updateTelegramConfig(existing.id, data)
      return NextResponse.json({ config })
    } else {
      const config = await db.createTelegramConfig(data)
      return NextResponse.json({ config })
    }
  } catch (error) {
    console.error('[v0] Erro ao salvar config:', error)
    return NextResponse.json({ error: 'Erro ao salvar configuração' }, { status: 500 })
  }
}
