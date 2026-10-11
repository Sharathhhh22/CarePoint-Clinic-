/**
 * AI Triage domain types
 */

export type UrgencyLevel = 'routine' | 'soon' | 'urgent' | 'emergency'

export interface TriageAnalysis {
  is_emergency: boolean
  urgency: UrgencyLevel
  plain_language_summary: string
  recommended_specialization?: string
  recommended_departments?: string[]
  recommended_specialties?: string[]
  patient_instructions?: string
  possible_conditions?: string[]
  follow_up_questions?: string[]
}

export interface TriageRequest {
  concern: string
}
