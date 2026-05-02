import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth"
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response"

export async function GET() {
  try {
    const user = await getSessionUser()

    if (!user) {
      return NextResponse.json(
        createErrorResponse("Not authenticated", 401),
        { status: 401 }
      )
    }

    return NextResponse.json(
      createSuccessResponse({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    )
  } catch (error) {
    console.error("[v0] Error getting user:", error)
    return NextResponse.json(
      createErrorResponse("Error getting user", 500),
      { status: 500 }
    )
  }
}
