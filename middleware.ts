import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionUser } from "@/lib/auth"

const protectedRoutes = ["/admin/dashboard", "/admin/projects"]
const authRoutes = ["/admin/login"]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // Get session from cookies
    const sessionCookie = request.cookies.get("kixinde_session")

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  if (isAuthRoute) {
    // Check if already logged in
    const sessionCookie = request.cookies.get("kixinde_session")

    if (sessionCookie) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
