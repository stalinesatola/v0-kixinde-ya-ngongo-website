import { db } from "./db"
import { getSessionUser } from "./auth"

export async function checkUserSubscription(userId: string): Promise<boolean> {
  const subscription = await db.getUserSubscription(userId)
  if (!subscription) return false
  
  // Check if subscription is still valid
  if (subscription.status !== "active") return false
  if (new Date() > subscription.expiresAt) return false
  
  return true
}

export async function getCurrentUserSubscription(userId: string) {
  const subscription = await db.getUserSubscription(userId)
  if (!subscription) return null
  
  const plan = await db.getSubscriptionPlan(subscription.planId)
  return {
    subscription,
    plan,
  }
}

export async function canUserGenerateProject(userId: string): Promise<boolean> {
  return await checkUserSubscription(userId)
}
