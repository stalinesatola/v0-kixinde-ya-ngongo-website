import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })
    
    // Clear session cookie
    response.cookies.set("kixinde_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json(
      { error: "Erro ao fazer logout" },
      { status: 500 }
    )
  }
}
