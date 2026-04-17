import { cookies } from "next/headers"
import { db } from "./db"

const SESSION_COOKIE_NAME = "kixinde_session"

export async function createSession(userId: string): Promise<string> {
  const session = await db.createSession(userId)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
  return session.token
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  const session = await db.getSession(token)
  if (!session) return null

  const user = await db.getUser(session.userId)
  return user
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    await db.deleteSession(token)
    cookieStore.delete(SESSION_COOKIE_NAME)
  }
}

export async function loginUser(email: string, password: string) {
  const user = await db.getUserByEmail(email)
  if (!user) return null

  if (!db.comparePassword(password, user.password)) {
    return null
  }

  await createSession(user.id)
  return user
}
