/**
 * Multi-step booking state management types
 */

import { TriageAnalysis } from './triage'
import { PaymentMethod } from './appointment'

export interface BookingPatientDetails {
  dob: string
  height: string
  weight: string
  notes?: string
  guardianName?: string
  consent: boolean
}

export interface BookingState {
  currentStep: number
  concern: string
  aiAnalysis: TriageAnalysis | null
  clinicId: string | null
  clinicName?: string | null
  doctorId: string | null
  doctorName?: string | null
  consultationFee?: number | null
  date: string | null
  time: string | null
  appointmentId: string | null
  details: BookingPatientDetails
  paymentMethod: PaymentMethod
}
