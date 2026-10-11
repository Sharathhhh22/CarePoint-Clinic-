import { GoogleGenAI } from '@google/genai'
import { env } from '@/config/env'
import { TriageAnalysis } from '@/types/triage'

const RED_FLAGS = [
  'chest pain', 'heart attack', 'stroke', 'trouble breathing', 'breathless',
  'severe bleeding', 'unconscious', 'passed out', 'suicide', 'kill myself', 
  'self-harm', 'choking', 'seizure', 'paralysis'
]

export class TriageService {
  private static ai = new GoogleGenAI({
    apiKey: env.gemini.apiKey || 'MISSING_API_KEY'
  })

  /**
   * Evaluates patient concern for emergency red flags
   */
  static checkRedFlags(concern: string): boolean {
    const concernLower = concern.toLowerCase()
    return RED_FLAGS.some(flag => concernLower.includes(flag))
  }

  /**
   * Analyzes symptoms and returns structured triage recommendation
   */
  static async analyzeSymptoms(concern: string): Promise<TriageAnalysis> {
    if (!concern || typeof concern !== 'string') {
      throw new Error('Please provide a health concern description.')
    }

    // 1. Immediate emergency check
    if (this.checkRedFlags(concern)) {
      return {
        is_emergency: true,
        urgency: 'emergency',
        plain_language_summary: 'Your symptoms match urgent medical red flags. Please seek emergency medical care immediately.',
        recommended_specialization: 'Emergency Medicine',
        recommended_departments: ['Emergency Department'],
        recommended_specialties: ['Emergency Medicine', 'Cardiology', 'Critical Care'],
        patient_instructions: 'Call local emergency services immediately or visit the nearest emergency room.'
      }
    }

    // 2. Safe fallback if API key not configured
    if (!env.gemini.isAvailable()) {
      return {
        is_emergency: false,
        urgency: 'routine',
        plain_language_summary: `Patient reports: ${concern}. (Preliminary triage routed to General Medicine)`,
        recommended_specialization: 'General Physician',
        recommended_departments: ['General Medicine'],
        recommended_specialties: ['General Practitioner'],
        patient_instructions: 'Please schedule a routine visit with a general physician for full physical examination.'
      }
    }

    // 3. Gemini LLM Structured Analysis
    const prompt = `
      You are a preliminary healthcare triage assistant.
      The patient says: "${concern}"
      
      Return a JSON object with:
      - possible_conditions (array of strings, e.g. ["Viral Pharyngitis", "Allergic Rhinitis"])
      - urgency (string, exactly one of: "routine", "soon", "urgent")
      - recommended_specialization (string, e.g. "General Physician", "Cardiologist", "Dermatologist")
      - follow_up_questions (array of 1-3 short strings asking for clarification, e.g. ["Do you have a fever?"])
      - plain_language_summary (string, a short compassionate summary. NEVER diagnose. Use words like "could be related to" or "possible conditions to discuss with a doctor".)

      Do NOT prescribe medication or dosage.
    `

    const response = await this.ai.models.generateContent({
      model: env.gemini.model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    })

    const text = response.text
    if (!text) {
      throw new Error('Empty response from AI triage engine')
    }

    const parsed = JSON.parse(text)
    return {
      is_emergency: false,
      urgency: parsed.urgency || 'routine',
      plain_language_summary: parsed.plain_language_summary || `Symptoms reported: ${concern}`,
      recommended_specialization: parsed.recommended_specialization || 'General Physician',
      recommended_departments: [parsed.recommended_specialization || 'General Medicine'],
      recommended_specialties: [parsed.recommended_specialization || 'General Practitioner'],
      patient_instructions: 'Please discuss these preliminary findings with your doctor during consultation.',
      possible_conditions: parsed.possible_conditions || [],
      follow_up_questions: parsed.follow_up_questions || []
    }
  }
}
