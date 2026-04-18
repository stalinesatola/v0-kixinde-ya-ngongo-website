import { loginUser } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log("[v0] Login attempt:", email)

    if (!email || !password) {
      console.log("[v0] Email ou senha vazios")
      return NextResponse.json(
        { error: "Email e senha sao obrigatorios" },
        { status: 400 }
      )
    }

    const user = await loginUser(email, password)

    if (!user) {
      console.log("[v0] Falha no login para:", email)
      return NextResponse.json(
        { error: "Email ou senha invalidos" },
        { status: 401 }
      )
    }

    console.log("[v0] Login sucesso para:", email, "- ID:", user.id)

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    // Set session cookie
    console.log("[v0] Definindo cookie com userId:", user.id)
    response.cookies.set("kixinde_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    console.log("[v0] Cookie definido - headers:", response.headers.getSetCookie())

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    )
  }
}
