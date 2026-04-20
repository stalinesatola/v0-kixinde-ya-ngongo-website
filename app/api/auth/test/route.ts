import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] TEST API - iniciando")
    
    // Test 1: Check if admin user exists
    const adminUser = await db.getUserByEmail("admin@kixindeyangongo.ao")
    console.log("[v0] TEST API - admin user:", adminUser?.id, adminUser?.email)
    
    // Test 2: Get all users
    const allUsers = await db.getAllUsers()
    console.log("[v0] TEST API - total users:", allUsers.length)
    
    // Test 3: Hash and compare password
    const testPassword = "demo123"
    const adminPassword = adminUser?.password || ""
    console.log("[v0] TEST API - admin password hash:", adminPassword.substring(0, 10) + "...")
    
    const isValid = db.comparePassword(testPassword, adminPassword)
    console.log("[v0] TEST API - password validation:", isValid)

    return NextResponse.json({
      success: true,
      test: {
        adminUserExists: !!adminUser,
        adminEmail: adminUser?.email,
        adminId: adminUser?.id,
        totalUsers: allUsers.length,
        passwordMatch: isValid,
      },
    })
  } catch (error) {
    console.error("[v0] TEST API Error:", error)
    return NextResponse.json(
      { error: "Test API error", details: String(error) },
      { status: 500 }
    )
  }
}
