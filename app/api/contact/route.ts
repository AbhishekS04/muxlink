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

      // Send email using Resend
      const { data, error } = await resend.emails.send({
        from: "Contact Form <onboarding@resend.dev>", // Use Resend's default sender
        to: ["abhishek23main@gmail.com"],
        replyTo: senderEmail,
        subject: `New Contact Form Message from ${senderEmail}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="color: white; margin: 0; text-align: center;">New Contact Form Message</h2>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <div style="margin-bottom: 20px;">
                <h3 style="color: #333; margin-bottom: 10px;">Contact Details:</h3>
                <p style="margin: 5px 0;"><strong>From:</strong> ${senderEmail}</p>
                <p style="margin: 5px 0;"><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <div style="margin: 20px 0;">
                <h3 style="color: #333; margin-bottom: 10px;">Message:</h3>
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; white-space: pre-wrap; line-height: 1.6;">
                  ${message}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef; text-align: center;">
                <p style="color: #6c757d; font-size: 14px; margin: 5px 0;">This message was sent from your Linktree contact form.</p>
                <p style="color: #6c757d; font-size: 14px; margin: 5px 0;">Reply directly to this email to respond to the sender.</p>
              </div>
            </div>
          </div>
        `,
      })

      if (error) {
        console.error("Resend API error:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to send email. Please try again.",
          },
          { status: 500 },
        )
      }

      console.log("✅ Email sent successfully via Resend:", data)

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
