import { getSessionUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    }

    const project = await db.getProject(id)

    if (!project) {
      return NextResponse.json({ error: "Projecto nao encontrado" }, { status: 404 })
    }

    // Only allow user to delete their own projects or admins
    if (project.userId !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 403 })
    }

    await db.deleteProject(id)

    // Log deletion
    await db.addLog({
      userId: user.id,
      projectId: id,
      action: "updated",
      details: `Projecto eliminado: ${project.projectName}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro ao eliminar projecto:", error)
    return NextResponse.json(
      { error: "Erro ao eliminar projecto" },
      { status: 500 }
    )
  }
}
