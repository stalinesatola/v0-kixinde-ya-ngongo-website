import { destroySession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await destroySession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json(
      { error: "Erro ao fazer logout" },
      { status: 500 }
    )
  }
}
