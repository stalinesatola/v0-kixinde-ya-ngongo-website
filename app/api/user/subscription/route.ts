import { getSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 })
    }

    const subscription = await db.getUserSubscription(user.id)
    const plan = subscription ? await db.getSubscriptionPlan(subscription.planId) : null
    const transactions = await db.getPaymentTransactions(user.id)

    return NextResponse.json({
      subscription,
      plan,
      transactions,
    })
  } catch (error) {
    console.error('[v0] Erro ao carregar subscrição:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar dados de subscrição' },
      { status: 500 }
    )
  }
}
