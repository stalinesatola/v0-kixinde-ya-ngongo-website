import { getSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 })
    }

    const { planId, paymentMethod } = await request.json()

    // Get plan
    const plan = await db.getSubscriptionPlan(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Plano nao encontrado' }, { status: 404 })
    }

    // Create payment transaction
    const transaction = await db.createPaymentTransaction({
      userId: user.id,
      subscriptionId: ``, // Will be updated
      amount: plan.price,
      currency: plan.currency,
      status: 'completed', // In real app, check with Stripe
      paymentMethodId: '', // Would store Stripe payment method ID
    })

    // Create user subscription
    const expiresAt = new Date()
    if (plan.billingPeriod === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    }

    const subscription = await db.createUserSubscription({
      userId: user.id,
      planId: plan.id,
      status: 'active',
      startDate: new Date(),
      expiresAt,
      autoRenew: true,
      projectsUsed: 0,
    })

    // Update transaction with subscription ID
    await db.updatePaymentTransaction(transaction.id, {
      subscriptionId: subscription.id,
    })

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      transactionId: transaction.id,
    })
  } catch (error) {
    console.error('[v0] Erro ao processar checkout:', error)
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 })
  }
}
