import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/admin/dashboard", "/admin/projects"]
const authRoutes = ["/admin/login"]

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const sessionCookie = request.cookies.get("kixinde_session")

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  if (isAuthRoute) {
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

