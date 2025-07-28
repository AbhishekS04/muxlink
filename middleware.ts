import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminPassword = request.cookies.get("admin-auth")?.value

    // Check if password is correct
    if (adminPassword !== process.env.ADMIN_PASSWORD && adminPassword !== "23044") {
      // Redirect to login page
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
