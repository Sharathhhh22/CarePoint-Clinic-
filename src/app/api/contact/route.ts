import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, department, urgency, message } = body

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
      const recipient = process.env.SUPPORT_EMAIL || "care@carepointclinic.com"

      await resend.emails.send({
        from: "CarePoint Clinic Contact <notifications@carepointclinic.com>",
        to: recipient,
        replyTo: email,
        subject: `[CarePoint Enquiry] ${department || "General"} from ${fullName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e0e4df; border-radius: 16px; background-color: #fafaf7;">
            <h2 style="color: #173f30; margin-bottom: 16px;">New CarePoint Consultation Enquiry</h2>
            <p><strong>Patient Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Department:</strong> ${department || "General Consultation"}</p>
            <p><strong>Urgency:</strong> ${urgency || "Routine"}</p>
            <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
            <hr style="border: none; border-top: 1px solid #e0e4df; margin: 20px 0;" />
            <h3 style="color: #101512; margin-bottom: 8px;">Enquiry Details:</h3>
            <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; color: #101512; border: 1px solid #e0e4df; white-space: pre-wrap;">${message}</div>
            <hr style="border: none; border-top: 1px solid #e0e4df; margin: 20px 0;" />
            <p style="font-size: 12px; color: #777d79;">CarePoint Clinic Patient Coordination Desk &bull; Boston, MA</p>
          </div>
        `,
      })
    } else {
      console.log(
        `[CarePoint Clinic Enquiry]: From ${fullName} (${email}, ${phone}): Department: ${department}, Message: ${message.slice(0, 80)}...`
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
