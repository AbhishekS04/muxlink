import { type NextRequest, NextResponse } from "next/server"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "0405"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Admin authentication attempt")

    const body = await request.json()
    const { password } = body

    console.log("📝 Password received:", password ? "Yes" : "No")
    console.log("🔑 Expected password:", ADMIN_PASSWORD)
    console.log("✅ Password match:", password === ADMIN_PASSWORD)

    if (password === ADMIN_PASSWORD) {
      console.log("✅ Authentication successful")

      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
      })

      // Set secure cookie that expires in 24 hours
      response.cookies.set("admin-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      console.log("🍪 Authentication cookie set")
      return response
    } else {
      console.log("❌ Authentication failed - invalid password")
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("❌ Auth error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
      },
      { status: 500 },
    )
  }
}
