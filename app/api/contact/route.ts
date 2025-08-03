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



const { data, error } = await resend.emails.send({
  from: "Contact Form <onboarding@resend.dev>",
  to: ["snehasishmondal01@gmail.com"],
  replyTo: senderEmail,
  subject: `New Contact Form Message from ${senderEmail}`,
  html: `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1b1f; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.6); color: #f1f1f1;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #222222, #333333); padding: 28px 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px; color: #ffffff;">📬 New Contact Form Message</h2>
        <p style="margin: 6px 0 0; font-size: 14px; color: #aaaaaa;">Sent via muxlink</p>
      </div>

      <!-- Body -->
      <div style="background: #1a1b1f; padding: 32px;">
        <!-- Contact Info -->
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 10px; font-size: 18px; color: #eaeaea;">📇 Contact Details</h3>
          <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${senderEmail}" style="color: #7f5af0; text-decoration: none;">${senderEmail}</a></p>
          <p style="margin: 6px 0;"><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <!-- Message Box -->
        <div style="margin-bottom: 28px;">
          <h3 style="margin: 0 0 10px; font-size: 18px; color: #eaeaea;">📝 Message</h3>
          <div style="background: #23242a; padding: 20px; border-left: 4px solid #7f5af0; border-radius: 12px; color: #d1d1d1; line-height: 1.6; white-space: pre-wrap;">
            ${message}
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #333; padding-top: 18px; text-align: center; font-size: 13px; color: #777;">
          <p style="margin: 4px 0;">This message was sent from your muxlink contact form.</p>
          <p style="margin: 4px 0;">Reply directly to this email to respond to the sender.</p>
        </div>
      </div>
    </div>
  `,
});


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
