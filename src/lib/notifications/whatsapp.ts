/**
 * WhatsApp Notification & Sharing Helper for SlotUrSelf
 */

import { siteConfig } from "@/config/site"

export interface WhatsAppPassDetails {
  appointmentId: string
  ticketNumber?: number
  patientName: string
  doctorName: string
  specialty?: string
  clinicName: string
  clinicAddress?: string
  appointmentDate: string
  appointmentTime: string
  patientMobile?: string
}

export function generateWhatsAppPassMessage(details: WhatsAppPassDetails): string {
  const tokenStr = details.ticketNumber ? `*Token #${details.ticketNumber.toString().padStart(2, '0')}*` : 'Confirmed'
  const mapsQuery = encodeURIComponent(`${details.clinicName}, ${details.clinicAddress || 'Bengaluru'}`)
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`
  const passUrl = `${siteConfig.url}/receipt/${details.appointmentId}`

  return `🏥 *SlotUrSelf Clinic Appointment Pass*

👤 *Patient:* ${details.patientName}
🩺 *Doctor:* ${details.doctorName}${details.specialty ? ` (${details.specialty})` : ''}
🎟️ *Queue Token:* ${tokenStr}
📅 *Date:* ${details.appointmentDate}
⏰ *Time Slot:* ${details.appointmentTime}

📍 *Clinic:* ${details.clinicName}
🗺️ *Get Directions:* ${mapsLink}

📲 *Live Digital Pass & Queue Status:*
${passUrl}

⚠️ _Please arrive 10 minutes prior to your time slot to ensure seamless check-in._`
}

export function generateWhatsAppShareLink(details: WhatsAppPassDetails): string {
  const message = generateWhatsAppPassMessage(details)
  const phone = details.patientMobile ? details.patientMobile.replace(/[^0-9]/g, '') : ''
  
  // Format Indian numbers without + if starting with 91, or add 91 if 10-digits
  const cleanPhone = phone.length === 10 ? `91${phone}` : phone

  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  }
  return `https://wa.me/?text=${encodeURIComponent(message)}`
}
