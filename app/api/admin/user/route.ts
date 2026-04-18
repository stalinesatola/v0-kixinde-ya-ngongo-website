import { getSessionUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] API /admin/user - iniciando")
    
    const user = await getSessionUser()
    console.log("[v0] API /admin/user - user obtido:", user?.id, user?.email)

    if (!user) {
      console.log("[v0] API /admin/user - utilizador nao autenticado")
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    }

    const projects = await db.getUserProjects(user.id)
    console.log("[v0] API /admin/user - projectos obtidos:", projects.length)

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
