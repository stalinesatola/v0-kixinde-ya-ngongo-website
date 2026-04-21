import { loginUser } from "@/lib/auth"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response"
import { errorLogger } from "@/lib/error-logger"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log("[v0] POST /api/auth/login - email:", email)

    if (!email || !password) {
      console.log("[v0] Email ou senha vazios")
      return NextResponse.json(
        createErrorResponse("Email e senha são obrigatórios", 400),
        { status: 400 }
      )
    }

    console.log("[v0] Chamando loginUser...")
    const user = await loginUser(email, password)
    console.log("[v0] loginUser resultado:", user ? "user encontrado" : "null")

    if (!user) {
      console.log("[v0] User não encontrado, retornando 401")
      return NextResponse.json(
        createErrorResponse("Email ou senha inválidos", 401),
        { status: 401 }
      )
    }

    console.log("[v0] Login bem-sucedido, criando resposta...")
    const response = NextResponse.json(
      createSuccessResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    )

    response.cookies.set("kixinde_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    console.log("[v0] Retornando resposta de sucesso")
    return response
  } catch (error) {
    console.error("[v0] Erro no POST /api/auth/login:", error)
    const errorId = errorLogger.error(
      "Login API Error",
      { endpoint: "/api/auth/login" },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse("Erro ao fazer login", 500, errorId),
      { status: 500 }
    )
  }
}
