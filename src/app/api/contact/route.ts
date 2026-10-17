import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, message } = body

    // 1. Validation
    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "First name, email, and message are required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    const fullName = `${firstName} ${lastName || ""}`.trim()
    const apiKey = process.env.RESEND_API_KEY

    // 2. Transmit via Resend if API key is configured
    if (apiKey && apiKey !== "re_dummy_key") {
      const resend = new Resend(apiKey)
      const recipient = process.env.SUPPORT_EMAIL || "support@sloturself.com"

      await resend.emails.send({
        from: "SlotUrSelf Contact <notifications@sloturself.com>",
        to: recipient,
        replyTo: email,
        subject: `[Contact Form] New Clinical Inquiry from ${fullName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
            <h2 style="color: #0f766e; margin-bottom: 16px;">New Contact Form Message</h2>
            <p><strong>From:</strong> ${fullName} (&lt;${email}&gt;)</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <h3 style="color: #0f172a; margin-bottom: 8px;">Message:</h3>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; color: #334155; white-space: pre-wrap;">${message}</div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">This notification was sent automatically by SlotUrSelf Medical Operations.</p>
          </div>
        `,
      })
    } else {
      console.log(`[Contact Form Received]: From ${fullName} (${email}): ${message.slice(0, 80)}...`)
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting us. Our clinical operations team will respond promptly.",
    })
  } catch (error: any) {
    console.error("Error processing contact form notification:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email support directly." },
      { status: 500 }
    )
  }
}
