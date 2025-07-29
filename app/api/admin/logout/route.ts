import { NextResponse } from "next/server"

export async function POST() {
  try {
    console.log("🚪 Admin logout requested")

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })

    // Clear the authentication cookie
    response.cookies.set("admin-auth", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/",
    })

    console.log("✅ Admin logout successful")
    return response
  } catch (error) {
    console.error("❌ Logout error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Logout failed",
      },
      { status: 500 },
    )
  }
}
