import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { senderEmail, message } = await request.json()

    // Validate input
    if (!senderEmail || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and message are required",
        },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(senderEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // Get Resend API key from environment
    const RESEND_API_KEY = process.env.RESEND_API_KEY

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not found in environment variables")
      return NextResponse.json(
        {
          success: false,
          error: "Email service not configured",
        },
        { status: 500 },
      )
    }

    try {
      // Import Resend dynamically
      const { Resend } = await import("resend")
      const resend = new Resend(RESEND_API_KEY)

      // Send email using Resend with most reliable configuration
      const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev", // Simple, no custom name
        to: ["abhishek23main@gmail.com"],
        replyTo: senderEmail,
        subject: `Contact Form: Message from ${senderEmail}`,
        text: `
New contact form message:

From: ${senderEmail}
Sent: ${new Date().toLocaleString()}

Message:
${message}

---
This message was sent from your contact form.
Reply to this email to respond directly to the sender.
  `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">New Contact Form Message</h2>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>From:</strong> ${senderEmail}</p>
              <p><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3>Message:</h3>
              <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <p style="color: #666; font-size: 12px;">
              This message was sent from your contact form. Reply to this email to respond directly.
            </p>
          </div>
        `,
      })

      // Add more detailed logging
      if (error) {
        console.error("❌ Resend API error:", JSON.stringify(error, null, 2))
        return NextResponse.json(
          {
            success: false,
            error: `Email failed: ${error.message || "Unknown error"}`,
          },
          { status: 500 },
        )
      }

      console.log("✅ Email sent successfully!")
      console.log("📧 Email ID:", data?.id)
      console.log("📬 Sent to:", "abhishek23main@gmail.com")
      console.log("📤 From:", senderEmail)

      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
      })
    } catch (resendError) {
      console.error("Resend integration error:", resendError)
      return NextResponse.json(
        {
          success: false,
          error: "Email service error. Please try again.",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message. Please try again.",
      },
      { status: 500 },
    )
  }
}
