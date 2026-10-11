/**
 * User & Profile domain types
 */

export type UserRole = 'patient' | 'doctor' | 'admin' | 'staff'

export interface UserProfile {
  id: string
  full_name?: string | null
  mobile?: string | null
  address?: string | null
  role?: UserRole
  created_at?: string
  updated_at?: string
}
