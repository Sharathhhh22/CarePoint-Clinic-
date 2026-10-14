"use server"

import { TriageService } from "@/services/triageService"
import { sanitizeText } from "@/lib/security/sanitize"

export async function triageSymptoms(
  symptoms: string, 
  availableDepartments: { id: string, name: string }[]
): Promise<{ departmentId: string, reason: string }> {
  try {
    const cleanSymptoms = sanitizeText(symptoms)
    if (!cleanSymptoms) {
      return {
        departmentId: availableDepartments[0]?.id || "",
        reason: "Please specify your symptoms for clinical routing."
      }
    }

    const analysis = await TriageService.analyzeSymptoms(cleanSymptoms)
    const matchedDept = availableDepartments.find(d => 
      analysis.recommended_departments?.some(rd => rd.toLowerCase().includes(d.name.toLowerCase()))
    )

    return {
      departmentId: matchedDept?.id || availableDepartments[0]?.id || "",
      reason: analysis.plain_language_summary
    }
  } catch (error: unknown) {
    console.error("AI Triage Error:", error)
    return {
      departmentId: availableDepartments[0]?.id || "",
      reason: "Preliminary routing to General Medicine."
    }
  }
}
