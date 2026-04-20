import { getSessionUser } from "@/lib/auth"
import { checkUserSubscription } from "@/lib/subscription-utils"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    }

    const hasActiveSubscription = await checkUserSubscription(user.id)
    const subscription = await db.getUserSubscription(user.id)
    const plan = subscription ? await db.getSubscriptionPlan(subscription.planId) : null

    return NextResponse.json({
      hasActiveSubscription,
      subscription,
      plan,
    })
  } catch (error) {
    console.error("[v0] Error checking subscription:", error)
    return NextResponse.json(
      { error: "Erro ao verificar subscrição" },
      { status: 500 }
    )
  }
}
