/**
 * Appointment domain types
 */

export type AppointmentStatus = 'held' | 'confirmed' | 'cancelled' | 'completed'

export type PaymentMethod = 'ONLINE_PAYMENT' | 'PAY_AT_CLINIC'
export type PaymentMode = 'online' | 'PAY_AT_CLINIC' | string

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  clinic_id?: string
  appointment_date: string
  appointment_time: string
  status: AppointmentStatus
  held_until?: string | null
  patient_name?: string | null
  patient_phone?: string | null
  dob?: string | null
  height_cm?: number | null
  weight_kg?: number | null
  consent_given?: boolean | null
  payment_mode?: PaymentMode | null
  payment_status?: string | null
  ticket_number?: number | null
  reason?: string | null
  created_at?: string
  updated_at?: string
  
  // Joined relations
  doctors?: {
    id: string
    name: string
    specialty?: string
    photo_url?: string | null
    consultation_fee?: number | null
  }
  clinics?: {
    id: string
    name: string
    address?: string
    city?: string
    phone?: string
  }
  profiles?: {
    id: string
    full_name?: string | null
    mobile?: string | null
  }
}

export interface HoldSlotRequest {
  doctorId: string
  clinicId: string
  date: string
  time: string
}

export interface ConfirmAppointmentRequest {
  appointmentId: string
  dob: string
  height?: number | string | null
  weight?: number | string | null
  guardianName?: string | null
  shareData: boolean
  concern?: string | null
  aiSummary?: string | null
  paymentMethod: PaymentMethod
}
