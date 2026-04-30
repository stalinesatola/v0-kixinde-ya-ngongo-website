import { getSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

type CheckoutRequest = {
  planId?: string
  paymentMethod?: string
  cardData?: {
    cardName?: string
    cardNumber?: string
    expiryDate?: string
    cvv?: string
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 })
    }

    const body = (await request.json()) as CheckoutRequest
    const planId = typeof body.planId === 'string' ? body.planId : ''
    const paymentMethod = typeof body.paymentMethod === 'string' ? body.paymentMethod : 'card'
    const cardData = body.cardData ?? {}

    if (!planId) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    // Get plan
    const plan = await db.getSubscriptionPlan(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Plano nao encontrado' }, { status: 404 })
    }

    if (paymentMethod === 'card') {
      if (
        !cardData.cardName ||
        !cardData.cardNumber ||
        !cardData.expiryDate ||
        !cardData.cvv
      ) {
        return NextResponse.json({ error: 'Dados do cartão incompletos' }, { status: 400 })
      }
    }

    const paymentMethodId = paymentMethod

    // Create payment transaction
    const transaction = await db.createPaymentTransaction({
      userId: user.id,
      subscriptionId: ``,
      amount: plan.price,
      currency: plan.currency,
      status: 'pending',
      paymentMethodId,
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
      paymentMethodId,
      autoRenew: true,
      projectsUsed: 0,
    })

    await db.updatePaymentTransaction(transaction.id, {
      subscriptionId: subscription.id,
      status: 'completed',
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
