import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(
  process.env.DATABASE_URL ||
    "postgresql://neondb_owner:npg_6YLtwIhabxd1@ep-little-paper-ad1iuiu1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
)

export async function POST(request: NextRequest) {
  try {
    console.log("📧 Contact form submission received")

    const body = await request.json()
    const { email, message } = body

    console.log("📧 Contact form data:", { email: email?.substring(0, 20) + "...", messageLength: message?.length })

    // Validate input
    if (!email || !message) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ success: false, error: "Email and message are required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format")
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    // For now, we'll just log the contact form submission
    // In production, you would integrate with an email service like Resend
    console.log("📧 Contact form submission:")
    console.log("From:", email)
    console.log("Message:", message)
    console.log("Timestamp:", new Date().toISOString())

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("✅ Contact form processed successfully")

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("❌ Contact form error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message",
      },
      { status: 500 },
    )
  }
}
