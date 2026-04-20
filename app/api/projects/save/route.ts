import { getSessionUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import type { Project } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()

    // Allow both authenticated and anonymous project creation
    const data = await request.json()

    const projectData: Omit<Project, "id" | "createdAt" | "updatedAt"> = {
      userId: user?.id || "anonymous",
      projectName: data.projectName || "Sem nome",
      projectType: data.projectType || "",
      projectSubType: data.projectSubType || "",
      location: data.location || "",
      area: parseFloat(data.area) || 0,
      perimeter: parseFloat(data.perimeter) || 0,
      terrainShape: data.terrainShape || "regular",
      clientName: data.name || "",
      clientEmail: data.email || "",
      clientPhone: data.phone || "",
      architecturalStyle: data.style || "",
      floors: parseInt(data.floors) || 1,
      bedrooms: parseInt(data.bedrooms) || 0,
      bathrooms: parseInt(data.bathrooms) || 0,
      parking: parseInt(data.parking) || 0,
      terrain: {
        dimensions: data.dimensions || "",
        coordinates: data.coordinates || "",
        irregularData: data.irregularSides ? { sides: data.irregularSides } : undefined,
      },
      generatedContent: data.generatedContent || "",
      status: "generated",
    }

    const project = await db.createProject(projectData)

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error) {
    console.error("[v0] Erro ao guardar projeto:", error)
    return NextResponse.json(
      { error: "Erro ao guardar projeto" },
      { status: 500 }
    )
  }
}
