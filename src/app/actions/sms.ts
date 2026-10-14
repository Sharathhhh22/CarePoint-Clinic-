"use server"

import { NotificationService } from "@/services/notificationService"
import { createClient } from "@/utils/supabase/server"
import { sanitizeText } from "@/lib/security/sanitize"

export async function sendSMSNotification(
  patientPhone: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  return NotificationService.sendAppointmentSMS({
    phone: sanitizeText(patientPhone),
    patientName: sanitizeText(patientName),
    doctorName: sanitizeText(doctorName),
    date: sanitizeText(date),
    time: sanitizeText(time),
  })
}
