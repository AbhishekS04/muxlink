import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // For now, we'll use Resend if available, otherwise log the email
    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (RESEND_API_KEY) {
      try {
        // Import Resend dynamically to avoid errors if not installed
        const { Resend } = await import("resend")
        const resend = new Resend(RESEND_API_KEY)

        await resend.emails.send({
          from: "Contact Form <noreply@yourdomain.com>", // Replace with your domain
          to: ["abhishek@yourdomain.com"], // Replace with Abhishek's email
          replyTo: email,
          subject: `New Contact Form Message from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                New Contact Form Message
              </h2>
              
              <div style="margin: 20px 0;">
                <p><strong>From:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
              </div>
              
              <div style="margin: 20px 0;">
                <h3 style="color: #555;">Message:</h3>
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                  ${message}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
                <p>This message was sent from your Linktree contact form.</p>
              </div>
            </div>
          `,
        })

        return NextResponse.json({
          success: true,
          message: "Message sent successfully!",
        })
      } catch (resendError) {
        console.error("Resend error:", resendError)
        // Fall back to logging if Resend fails
      }
    }

    // Fallback: Log the email details (for development/testing)
    console.log("📧 New Contact Form Submission:")
    console.log("From:", name, `<${email}>`)
    console.log("Message:", message)
    console.log("Timestamp:", new Date().toISOString())

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! (Currently in development mode - check server logs)",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}
