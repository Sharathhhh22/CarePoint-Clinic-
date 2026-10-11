import { Resend } from 'resend'
import twilio from 'twilio'
import { env } from '@/config/env'

export interface EmailNotificationPayload {
  toEmail: string
  patientName: string
  doctorName: string
  date: string
  time: string
  clinicName: string
}

export interface SMSNotificationPayload {
  phone: string
  patientName: string
  doctorName: string
  date: string
  time: string
}

export class NotificationService {
  /**
   * Sends appointment confirmation email via Resend
   */
  static async sendAppointmentConfirmationEmail(payload: EmailNotificationPayload): Promise<{ success: boolean; error?: string }> {
    if (!env.resend.isConfigured()) {
      console.warn('NotificationService: Resend is not configured. Skipping confirmation email.')
      return { success: false, error: 'Resend API key missing' }
    }

    try {
      const resend = new Resend(env.resend.apiKey)
      const { data, error } = await resend.emails.send({
        from: env.resend.fromEmail,
        to: [payload.toEmail],
        subject: 'Appointment Confirmed - APPOINTLY',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0f172a; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Appointment Confirmed</h1>
            </div>
            <div style="padding: 32px; background-color: #ffffff;">
              <p style="font-size: 16px; color: #334155; margin-top: 0;">Hi <strong>${payload.patientName}</strong>,</p>
              <p style="font-size: 16px; color: #334155; line-height: 1.5;">Your appointment has been successfully scheduled. Here are the details:</p>
              
              <div style="background-color: #f8fafc; border-radius: 6px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px;"><strong>Doctor:</strong> Dr. ${payload.doctorName}</p>
                <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px;"><strong>Date:</strong> ${payload.date}</p>
                <p style="margin: 0 0 12px 0; color: #0f172a; font-size: 15px;"><strong>Time:</strong> ${payload.time}</p>
                <p style="margin: 0; color: #0f172a; font-size: 15px;"><strong>Clinic:</strong> ${payload.clinicName}</p>
              </div>

              <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 0;">
                Please arrive 10 minutes before your scheduled slot. You can view your live pass and countdown timer from your patient portal.
              </p>
            </div>
            <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #eaeaea;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} APPOINTLY. All rights reserved.</p>
            </div>
          </div>
        `
      })

      if (error) {
        console.error('Resend Error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send confirmation email'
      console.error('Email notification error:', err)
      return { success: false, error: msg }
    }
  }

  /**
   * Sends appointment confirmation SMS via Twilio
   */
  static async sendAppointmentSMS(payload: SMSNotificationPayload): Promise<{ success: boolean; error?: string }> {
    if (!env.twilio.isConfigured()) {
      console.warn('NotificationService: Twilio is not configured. Skipping SMS.')
      return { success: false, error: 'Twilio not configured' }
    }

    try {
      let formattedPhone = payload.phone.trim()
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone
      }

      const client = twilio(env.twilio.accountSid, env.twilio.authToken)
      await client.messages.create({
        body: `Hi ${payload.patientName}, your appointment with Dr. ${payload.doctorName} is confirmed for ${payload.date} at ${payload.time}.`,
        from: env.twilio.phoneNumber,
        to: formattedPhone,
      })

      return { success: true }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send SMS'
      console.error('SMS notification error:', err)
      return { success: false, error: msg }
    }
  }
}
