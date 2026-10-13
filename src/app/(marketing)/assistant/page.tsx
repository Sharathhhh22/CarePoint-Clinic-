"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bot, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, Clock, RefreshCw, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TriageEvaluation } from "@/services/llm/types"

const SAMPLE_SCENARIOS = [
  "Sharp lower back pain radiating down my left leg for 3 days",
  "Pounding headache with nausea and light sensitivity",
  "Persistent dry cough, mild fatigue, and throat tickle",
  "Knee swelling and stiffness after playing sports"
]

export default function AssistantPage() {
  const router = useRouter()
  const [symptomInput, setSymptomInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TriageEvaluation | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze || symptomInput).trim()
    if (!text || loading) return

    setLoading(true)
    setError(null)
    setSymptomInput(text)

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concern: text })
      })

      if (!res.ok) {
        throw new Error("Unable to analyze symptoms at this moment.")
      }

      const data = await res.json()
      setResult({
        isEmergency: data.is_emergency || false,
        urgency: data.urgency || "routine",
        summary: data.plain_language_summary || "Symptoms recorded for physician consultation.",
        possibleConditions: data.possible_conditions || [],
        recommendedDepartment: data.recommended_departments?.[0] || data.recommended_specialization || "General Medicine",
        recommendedSpecialist: data.recommended_specialties?.[0] || data.recommended_specialization || "General Physician",
        followUpQuestions: data.follow_up_questions || [],
        patientGuidance: data.patient_instructions || "Please schedule a consultation with a certified doctor."
      })
    } catch (err: any) {
      setError(err.message || "Failed to analyze symptoms.")
    } finally {
      setLoading(false)
    }
  }

  const handleBook = () => {
    if (!result) return
    router.push(`/appointments/new?dept=${encodeURIComponent(result.recommendedDepartment)}`)
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
            <Bot className="w-3.5 h-3.5" />
            Clinical AI Triage
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            AI Symptom Checker & Guide
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Describe how you are feeling in plain language. Our clinical reasoning engine evaluates urgency and recommends the right department.
          </p>
        </div>

        {/* Emergency Disclaimer */}
        <div className="mb-10 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Important Medical Disclaimer:</strong> This tool provides preliminary clinical navigation, not a definitive medical diagnosis. If you are experiencing chest pain, acute shortness of breath, severe bleeding, or sudden paralysis, dial emergency services (108) immediately.
          </div>
        </div>

        {/* Input Form Card */}
        <Card className="border-border bg-card shadow-sm mb-12">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-foreground">What symptoms are you experiencing?</CardTitle>
            <CardDescription className="text-muted-foreground">
              Include details such as when it started, severity, or any triggers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}>
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="e.g. I have had a severe throbbing headache behind my left eye since yesterday, feeling sensitive to bright light and slightly dizzy..."
                  className="w-full p-4 rounded-xl border border-border bg-input-bg text-foreground placeholder:text-muted-foreground text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  disabled={loading}
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  <div className="text-xs text-muted-foreground w-full sm:w-auto">
                    Try an example:
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || !symptomInput.trim()}
                    className="w-full sm:w-auto h-11 px-6 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-sm transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        Analyze with AI
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Quick Sample Prompts */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              {SAMPLE_SCENARIOS.map((scenario, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnalyze(scenario)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors text-left"
                >
                  "{scenario.slice(0, 42)}..."
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Notice */}
        {error && (
          <div className="p-4 mb-8 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={() => handleAnalyze()} className="border-destructive/40 text-destructive">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </div>
        )}

        {/* Triage Results Card */}
        {result && (
          <div className="space-y-6">
            <Card className="border-border bg-card shadow-md overflow-hidden">
              <div className={`p-4 text-white flex items-center justify-between ${
                result.isEmergency 
                  ? "bg-rose-600" 
                  : result.urgency === "urgent" 
                    ? "bg-amber-600" 
                    : "bg-primary"
              }`}>
                <div className="flex items-center gap-2.5">
                  {result.isEmergency ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  <span className="font-semibold text-sm uppercase tracking-wide">
                    Urgency Level: {result.urgency.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs opacity-90">AI Clinical Triage</span>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                    Preliminary Clinical Assessment
                  </h3>
                  <p className="text-foreground text-base md:text-lg leading-relaxed font-medium">
                    {result.summary}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Recommended Department
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {result.recommendedDepartment}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Attending: {result.recommendedSpecialist}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Potential Conditions to Discuss
                    </p>
                    <ul className="text-sm font-medium text-foreground space-y-1 mt-1">
                      {result.possibleConditions.length > 0 ? (
                        result.possibleConditions.map((cond, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {cond}
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">General clinical evaluation indicated</li>
                      )}
                    </ul>
                  </div>
                </div>

                {result.followUpQuestions.length > 0 && (
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Questions Your Doctor May Ask You
                    </p>
                    <ul className="text-sm text-foreground space-y-2">
                      {result.followUpQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-semibold text-primary">{idx + 1}.</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-border">
                  <p className="text-xs text-muted-foreground text-center sm:text-left">
                    Ready to book your consultation with zero wait time?
                  </p>
                  <Button
                    onClick={handleBook}
                    className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary-hover text-primary-foreground font-bold shadow-sm"
                  >
                    Book {result.recommendedSpecialist}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
