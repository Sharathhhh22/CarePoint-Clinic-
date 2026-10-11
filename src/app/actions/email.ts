"use server"

import { NotificationService } from "@/services/notificationService"

export async function sendAppointmentConfirmationEmail(
  userEmail: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string,
  clinicName: string
) {
  return NotificationService.sendAppointmentConfirmationEmail({
    toEmail: userEmail,
    patientName,
    doctorName,
    date,
    time,
    clinicName,
  })
}
