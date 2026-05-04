import { getSessionUser } from "@/lib/auth"
import { checkUserSubscription } from "@/lib/subscription-utils"
import { db } from "@/lib/db"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response"
import { errorLogger } from "@/lib/error-logger"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json(
        createErrorResponse("Não autenticado", 'UNAUTHENTICATED'),
        { status: 401 }
      )
    }

    const hasActiveSubscription = await checkUserSubscription(user.id)
    const subscription = await db.getUserSubscription(user.id)
    const plan = subscription ? await db.getSubscriptionPlan(subscription.planId) : null

    return NextResponse.json(
      createSuccessResponse({
        hasActiveSubscription,
        subscription,
        plan,
      })
    )
  } catch (error) {
    const errorId = errorLogger.error(
      "Erro ao verificar subscrição",
      { endpoint: "/api/subscription/check" },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse("Erro ao verificar subscrição", 'INTERNAL_ERROR', errorId),
      { status: 500 }
    )
  }
}
