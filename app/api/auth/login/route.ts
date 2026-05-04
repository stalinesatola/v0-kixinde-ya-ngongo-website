import { loginUser } from "@/lib/auth"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response"
import { errorLogger } from "@/lib/error-logger"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        createErrorResponse("Email e senha são obrigatórios", 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }

    const user = await loginUser(email, password)

    if (!user) {
      return NextResponse.json(
        createErrorResponse("Email ou senha inválidos", 'AUTHENTICATION_FAILED'),
        { status: 401 }
      )
    }

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

    return response
  } catch (error) {
    const errorId = errorLogger.error(
      "Login API Error",
      { endpoint: "/api/auth/login" },
      error instanceof Error ? error : new Error(String(error))
    )
    return NextResponse.json(
      createErrorResponse("Erro ao fazer login", 'INTERNAL_ERROR', errorId),
      { status: 500 }
    )
  }
}
