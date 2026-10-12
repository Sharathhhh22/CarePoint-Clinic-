"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowRight, Loader2, HeartPulse, Stethoscope, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

interface Step1Props {
  data: any
  updateData: (key: string, value: any) => void
  onNext: () => void
}

export function Step1Concern({ data, updateData, onNext }: Step1Props) {
  const [concern, setConcern] = useState(data.concern || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const analyzeConcern = async () => {
    if (!concern.trim()) {
      setError("Please describe your health concern briefly.")
      return
    }

    if (concern.trim().length < 5) {
      setError("Please provide a little more detail.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concern })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to analyze concern")
      }

      updateData("concern", concern)
      updateData("aiAnalysis", result)
      
      // Proceed to next step
      onNext()

    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // If we already have AI analysis, we show the summary and allow them to proceed or edit
  if (data.aiAnalysis) {
    const ai = data.aiAnalysis
    const isEmergency = ai.is_emergency || ai.urgency === 'emergency' || ai.urgency === 'urgent'

    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-2">Initial Assessment</h2>
          <p className="text-muted-foreground mb-8">Based on your concern, here is a preliminary analysis.</p>

          <div className={`p-6 rounded-xl border ${isEmergency ? 'bg-destructive/10 border-destructive/30' : 'bg-primary/10 border-primary/20'} mb-6`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${isEmergency ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
                {isEmergency ? <AlertTriangle className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
              </div>
              <div>
                <h3 className={`font-semibold text-lg ${isEmergency ? 'text-destructive' : 'text-foreground'}`}>
                  {ai.plain_language_summary}
                </h3>
                
                {isEmergency && (
                  <div className="mt-4 p-4 bg-destructive/15 text-destructive rounded-lg font-medium border border-destructive/30">
                    If this is a life-threatening emergency, please call your national emergency number immediately (e.g. 911 or 112).
                  </div>
                )}

                {!isEmergency && ai.follow_up_questions?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-foreground mb-2">Consider discussing these with your doctor:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      {ai.follow_up_questions.map((q: string, i: number) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isEmergency && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Recommended Specialist</p>
                <p className="font-semibold text-foreground">{ai.recommended_specialization}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Urgency</p>
                <p className="font-semibold text-foreground capitalize">{ai.urgency}</p>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-6 text-center italic">
            * This is an AI-generated preliminary assessment, not a definitive medical diagnosis. 
            Always consult a qualified healthcare provider for medical advice.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => updateData("aiAnalysis", null)}
            className="text-muted-foreground hover:text-foreground"
          >
            Edit Concern
          </Button>
          <Button 
            onClick={onNext}
            className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold px-8 h-11"
          >
            Find {ai.recommended_specialization}s
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    )
  }

  // Default state: text input
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/15 text-primary rounded-lg">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">What brings you in today?</h2>
        </div>
        <p className="text-muted-foreground mb-8 ml-11">
          Briefly describe your symptoms or reason for visit. Our AI assistant will help direct you to the right specialist.
        </p>

        <div className="space-y-4">
          <Textarea 
            placeholder="e.g., I've had a persistent dry cough and mild fever for the last 3 days..."
            className="min-h-[160px] text-base p-4 resize-none border-border focus-visible:ring-ring text-foreground bg-input-bg placeholder:text-muted-foreground"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            disabled={isLoading}
          />
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex justify-end">
        <Button 
          onClick={analyzeConcern} 
          disabled={isLoading || !concern.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold px-8 h-11 w-full sm:w-auto relative overflow-hidden"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
