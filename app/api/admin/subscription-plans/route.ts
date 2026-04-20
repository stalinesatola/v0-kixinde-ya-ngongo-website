import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })
    }

    const plans = await db.getSubscriptionPlans()
    return NextResponse.json({ plans })
  } catch (error) {
    console.error('[v0] Erro ao listar planos:', error)
    return NextResponse.json({ error: 'Erro ao listar planos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })
    }

    const data = await request.json()
    const plan = await db.createSubscriptionPlan(data)
    return NextResponse.json({ plan })
  } catch (error) {
    console.error('[v0] Erro ao criar plano:', error)
    return NextResponse.json({ error: 'Erro ao criar plano' }, { status: 500 })
  }
}
