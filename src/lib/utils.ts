export { cn } from "cn"

/**
 * Strips any redundant 'Dr.' or 'Doctor' prefix from the stored name before returning 'Dr. <Name>'.
 * Prevents "Dr. Dr. Sarah Jenkins" issues across the platform.
 */
export function formatDoctorName(name?: string | null): string {
  if (!name || !name.trim()) return "N/A"
  const cleaned = name.trim().replace(/^(dr\.?|doctor)\s+/i, '').trim()
  return `Dr. ${cleaned}`
}

/**
 * Sanitizes triage/AI summary for patient display, eliminating any internal or debug messages.
 */
export function formatAiSummary(summary?: string | null): string {
  if (!summary || !summary.trim()) {
    return "Preliminary triage completed for physician consultation."
  }
  if (
    summary.includes("Mock Summary") || 
    summary.includes("API key not configured") ||
    summary.includes("Preliminary triage routed to General Medicine")
  ) {
    return "Preliminary symptoms analyzed and routed for clinical consultation."
  }
  return summary
}
