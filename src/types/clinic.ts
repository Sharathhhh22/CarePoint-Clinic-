/**
 * Clinic & Doctor domain types
 */

export interface Doctor {
  id: string
  name: string
  specialty: string
  experience_years?: number
  consultation_fee?: number
  is_active?: boolean
  photo_url?: string | null
  clinic_id?: string
  created_at?: string
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
