import { cookies } from "next/headers"
import { db } from "./db"

const SESSION_COOKIE_NAME = "kixinde_session"

export async function getSessionUser() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (!userId) return null

    const user = await db.getUser(userId)
    return user
  } catch (error) {
    console.error("[v0] Erro ao obter sessao:", error)
    return null
  }
}

export async function loginUser(email: string, password: string) {
  const user = await db.getUserByEmail(email)
  if (!user) {
    console.log("[v0] Utilizador nao encontrado:", email)
    return null
  }

  const isPasswordValid = db.comparePassword(password, user.password)
  if (!isPasswordValid) {
    console.log("[v0] Senha invalida para:", email)
    return null
  }

  console.log("[v0] Login bem-sucedido para:", email)
  return user
}
