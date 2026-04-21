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
  console.log("[v0] loginUser - buscando user por email:", email)
  const user = await db.getUserByEmail(email)
  console.log("[v0] loginUser - user encontrado:", user?.id, user?.email)
  
  if (!user) {
    console.log("[v0] loginUser - user não encontrado")
    return null
  }

  console.log("[v0] loginUser - comparando senha")
  console.log("[v0] DEBUG - senha input:", password)
  console.log("[v0] DEBUG - senha stored:", user.password)
  console.log("[v0] DEBUG - stored length:", user.password?.length)
  console.log("[v0] DEBUG - input length:", password?.length)
  
  const isPasswordValid = db.comparePassword(password, user.password)
  console.log("[v0] loginUser - senha válida:", isPasswordValid)
  
  if (!isPasswordValid) {
    console.log("[v0] loginUser - senha inválida")
    return null
  }

  console.log("[v0] loginUser - retornando user")
  return user
}
