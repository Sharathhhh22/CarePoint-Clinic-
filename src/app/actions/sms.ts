"use server"

import { NotificationService } from "@/services/notificationService"

export async function sendSMSNotification(
  patientPhone: string,
  patientName: string,
  doctorName: string,
  date: string,
  time: string
) {
  return NotificationService.sendAppointmentSMS({
    phone: patientPhone,
    patientName,
    doctorName,
    date,
    time,
  })
}
