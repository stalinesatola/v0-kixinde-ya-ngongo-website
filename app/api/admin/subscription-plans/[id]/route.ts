import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })
    }

    const data = await request.json()
    const plan = await db.updateSubscriptionPlan(id, data)
    
    if (!plan) {
      return NextResponse.json({ error: 'Plano nao encontrado' }, { status: 404 })
    }

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('[v0] Erro ao atualizar plano:', error)
    return NextResponse.json({ error: 'Erro ao atualizar plano' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Nao autorizado' }, { status: 403 })
    }

    // In a real app, you might soft-delete or check for active subscriptions
    // For now, we'll just mark it as inactive
    const plan = await db.updateSubscriptionPlan(id, { isActive: false })
    
    if (!plan) {
      return NextResponse.json({ error: 'Plano nao encontrado' }, { status: 404 })
    }

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('[v0] Erro ao deletar plano:', error)
    return NextResponse.json({ error: 'Erro ao deletar plano' }, { status: 500 })
  }
}
