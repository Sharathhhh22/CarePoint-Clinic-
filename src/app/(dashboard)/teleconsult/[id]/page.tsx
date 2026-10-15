import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { TeleconsultRoom } from "@/components/telemedicine/TeleconsultRoom"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teleconsultation Room",
  description: "Secure, encrypted in-browser telemedicine consultation on SlotUrSelf.",
}

interface TeleconsultPageProps {
  params: Promise<{ id: string }>
}

export default async function TeleconsultPage({ params }: TeleconsultPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/teleconsult/${id}`)
  }

  // Fetch appointment details
  const { data: appointment, error } = await supabase
    .from('appointments')
    .select(`
      id,
      appointment_date,
      appointment_time,
      patient_name,
      reason,
      doctor_id,
      patient_id,
      doctors (
        id,
        name,
        specialty,
        profile_id
      ),
      clinics (
        name,
        city
      )
    `)
    .eq('id', id)
    .single()

  if (error || !appointment) {
    redirect('/dashboard')
  }

  // Determine if the current user is the doctor or the patient
  const isDoctor = (appointment.doctors as any)?.profile_id === user.id

  const appointmentData = {
    id: appointment.id,
    patient_name: appointment.patient_name || "Patient",
    doctor_name: (appointment.doctors as any)?.name ? `Dr. ${(appointment.doctors as any).name}` : "Doctor",
    specialty: (appointment.doctors as any)?.specialty,
    clinic_name: (appointment.clinics as any)?.name,
    appointment_time: appointment.appointment_time,
    appointment_date: appointment.appointment_date,
    reason: appointment.reason,
    isDoctor
  }

  return (
    <div className="max-w-6xl mx-auto py-4">
      <TeleconsultRoom appointmentId={id} appointmentData={appointmentData} />
    </div>
  )
}
