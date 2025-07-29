import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("🔍 Middleware triggered for:", request.nextUrl.pathname)

  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("🔐 Admin route detected:", request.nextUrl.pathname)

    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      console.log("✅ Login page access allowed")
      return NextResponse.next()
    }

    // Check for admin authentication cookie
    const adminAuth = request.cookies.get("admin-auth")
    console.log("🍪 Admin auth cookie:", adminAuth ? "Present" : "Missing")
    console.log("🍪 Cookie value:", adminAuth?.value)

    if (!adminAuth || adminAuth.value !== "authenticated") {
      console.log("❌ Authentication failed, redirecting to login")
      // Redirect to login page if not authenticated
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }

    console.log("✅ Authentication successful, allowing access")
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
