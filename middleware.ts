import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const loginRoute = "/admin/login"
const dashboardRoute = "/admin/dashboard"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith("/admin")
  const isLoginRoute = pathname === loginRoute
  const sessionCookie = request.cookies.get("kixinde_session")

  // Se está na rota de login
  if (isLoginRoute) {
    // Se já tem sessão, redireciona para dashboard
    if (sessionCookie) {
      return NextResponse.redirect(new URL(dashboardRoute, request.url))
    }
    // Deixa aceder ao login
    return NextResponse.next()
  }

  // Se está em rota admin (mas não é login)
  if (isAdminRoute && !isLoginRoute) {
    // Se não tem sessão, redireciona para login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL(loginRoute, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

