import { TriageAnalysis } from '@/types/triage'
import { LLMService } from './llm/llmService'

export class TriageService {
  /**
   * Evaluates patient concern for emergency red flags
   */
  static checkRedFlags(concern: string): boolean {
    return LLMService.isEmergency(concern)
  }

  /**
   * Analyzes symptoms and returns structured triage recommendation
   * Uses multi-provider LLM pipeline with deterministic clinical fallback.
   */
  static async analyzeSymptoms(concern: string): Promise<TriageAnalysis> {
    if (!concern || typeof concern !== 'string') {
      throw new Error('Please provide a health concern description.')
    }

    const evaluation = await LLMService.evaluateTriage(concern)

    return {
      is_emergency: evaluation.isEmergency,
      urgency: evaluation.urgency,
      plain_language_summary: evaluation.summary,
      recommended_specialization: evaluation.recommendedSpecialist,
      recommended_departments: [evaluation.recommendedDepartment],
      recommended_specialties: [evaluation.recommendedSpecialist],
      patient_instructions: evaluation.patientGuidance,
      possible_conditions: evaluation.possibleConditions,
      follow_up_questions: evaluation.followUpQuestions
    }
  }
}
