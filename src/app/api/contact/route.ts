import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimit"
import { sanitizeText, escapeHtml } from "@/lib/security/sanitize"

export async function POST(req: NextRequest) {
  // 1. Rate Limiting: max 5 consultation submissions per 10 minutes per IP
  const ip = getClientIp(req)
  const rateLimit = checkRateLimit(`contact_${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 })
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before submitting another enquiry." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.reset) },
      }
    )
  }

  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, department, urgency, message, hp_field } = body

    // 2. Anti-bot honeypot check (hidden field filled only by automated spam bots)
    if (hp_field) {
      console.warn(`[Bot Detected]: Honeypot triggered from IP ${ip}`)
      return NextResponse.json({
        success: true,
        message: "Thank you for contacting CarePoint Clinic.",
      })
    }

    // 3. Validation & Sanitization
    const cleanFirstName = sanitizeText(firstName)
    const cleanLastName = sanitizeText(lastName)
    const cleanEmail = sanitizeText(email)
    const cleanPhone = sanitizeText(phone)
    const cleanDepartment = sanitizeText(department) || "General Consultation"
    const cleanUrgency = sanitizeText(urgency) || "Routine"
    const cleanMessage = sanitizeText(message)

    if (!cleanFirstName || !cleanEmail || !cleanMessage) {
      return NextResponse.json(
        { error: "First name, email, and message are required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    const fullName = `${cleanFirstName} ${cleanLastName}`.trim()
    const apiKey = process.env.RESEND_API_KEY

    // 4. Transmit via Resend if API key is configured with HTML escaping
    if (apiKey && apiKey !== "re_dummy_key") {
      const resend = new Resend(apiKey)
      const recipient = process.env.SUPPORT_EMAIL || "care@carepointclinic.com"

      await resend.emails.send({
        from: "CarePoint Clinic Contact <notifications@carepointclinic.com>",
        to: recipient,
        replyTo: cleanEmail,
        subject: `[CarePoint Enquiry] ${cleanDepartment} from ${fullName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e4df; border-radius: 16px; background-color: #fafaf7;">
            <h2 style="color: #173f30; margin-bottom: 16px;">New CarePoint Consultation Enquiry</h2>
            <p><strong>Patient Name:</strong> ${escapeHtml(fullName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(cleanPhone || "Not provided")}</p>
            <p><strong>Department:</strong> ${escapeHtml(cleanDepartment)}</p>
            <p><strong>Urgency:</strong> ${escapeHtml(cleanUrgency)}</p>
            <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
            <hr style="border: none; border-top: 1px solid #e0e4df; margin: 20px 0;" />
            <h3 style="color: #101512; margin-bottom: 8px;">Enquiry Details:</h3>
            <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; color: #101512; border: 1px solid #e0e4df; white-space: pre-wrap;">${escapeHtml(cleanMessage)}</div>
            <hr style="border: none; border-top: 1px solid #e0e4df; margin: 20px 0;" />
            <p style="font-size: 12px; color: #777d79;">CarePoint Clinic Patient Coordination Desk &bull; Boston, MA</p>
          </div>
        `,
      })
    } else {
      console.log(
        `[CarePoint Clinic Enquiry]: From ${fullName} (${cleanEmail}, ${cleanPhone}): Department: ${cleanDepartment}, Message: ${cleanMessage.slice(0, 80)}...`
      )
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting CarePoint Clinic. Our clinical team will respond promptly.",
    })
  } catch (error: any) {
    console.error("Error processing contact form notification:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again or email care@carepointclinic.com directly." },
      { status: 500 }
    )
  }
}
