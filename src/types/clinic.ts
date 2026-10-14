/**
 * Clinic & Doctor domain types
 */

export type DoctorStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended'

export interface Doctor {
  id: string
  name: string
  specialty: string
  experience_years?: number
  consultation_fee?: number
  currency?: string
  is_active?: boolean
  photo_url?: string | null
  qualifications?: string | null
  medical_registration_no?: string | null
  registration_authority?: string | null
  bio?: string | null
  status?: DoctorStatus
  admin_reviewer_id?: string | null
  reviewed_at?: string | null
  rejection_reason?: string | null
  verification_doc_url?: string | null
  clinic_id?: string
  profile_id?: string | null
  department_id?: string | null
  appointment_duration_mins?: number
  created_at?: string
  updated_at?: string
}

export interface DoctorAvailability {
  id: string
  doctor_id: string
  day_of_week: number // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time: string // HH:MM:SS
  end_time: string // HH:MM:SS
  time_zone?: string
  is_active?: boolean
  created_at?: string
}

export interface DoctorVerificationHistory {
  id: string
  doctor_id: string
  reviewer_id: string
  decision: 'approved' | 'rejected' | 'suspended' | 'reactivated'
  reason?: string | null
  reviewed_at: string
  metadata?: Record<string, unknown>
  reviewer?: {
    id: string
    full_name?: string | null
    email?: string | null
  }
}

export interface Clinic {
  id: string
  name: string
  address: string
  city: string
  phone?: string
  latitude?: number
  longitude?: number
  distance_km?: number
  doctors?: Doctor[]
  created_at?: string
}

export interface Department {
  id: string
  name: string
  description?: string
  icon?: string
}
