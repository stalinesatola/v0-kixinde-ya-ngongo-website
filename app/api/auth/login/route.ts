import { loginUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] API Login - iniciando")
    const { email, password } = await request.json()
    console.log("[v0] API Login - email:", email)

    if (!email || !password) {
      console.log("[v0] API Login - email ou password vazio")
      return NextResponse.json(
        { error: "Email e senha sao obrigatorios" },
        { status: 400 }
      )
    }

    console.log("[v0] API Login - chamando loginUser")
    const user = await loginUser(email, password)
    console.log("[v0] API Login - user encontrado:", user?.id, user?.email)

    if (!user) {
      console.log("[v0] API Login - falha de autenticação")
      return NextResponse.json(
        { error: "Email ou senha invalidos" },
        { status: 401 }
      )
    }

    console.log("[v0] API Login - criando resposta com cookie")
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    response.cookies.set("kixinde_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    console.log("[v0] API Login - resposta enviada com sucesso")
    return response
  } catch (error) {
    console.error("[v0] Login API Error:", error)
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    )
  }
}
