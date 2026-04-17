import { getSessionUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    }

    const projects = await db.getUserProjects(user.id)

    return NextResponse.json({
      user,
      projects,
    })
  } catch (error) {
    console.error("[v0] Erro ao obter utilizador:", error)
    return NextResponse.json(
      { error: "Erro ao carregar dados" },
      { status: 500 }
    )
  }
}
