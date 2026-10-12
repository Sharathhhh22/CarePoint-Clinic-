export type LLMProvider = 'gemini' | 'openai' | 'anthropic' | 'fallback'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    recommendedDepartment?: string
    recommendedSpecialist?: string
    urgency?: 'routine' | 'soon' | 'urgent' | 'emergency'
    suggestedActions?: Array<{
      label: string
      action: 'book' | 'department' | 'emergency' | 'query'
      payload?: string
    }>
  }
}

export interface TriageEvaluation {
  isEmergency: boolean
  urgency: 'routine' | 'soon' | 'urgent' | 'emergency'
  summary: string
  possibleConditions: string[]
  recommendedDepartment: string
  recommendedSpecialist: string
  followUpQuestions: string[]
  patientGuidance: string
}

export interface ClinicalNoteSummary {
  patientName: string
  chiefComplaint: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  rawNotes: string
}
