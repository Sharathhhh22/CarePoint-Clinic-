"use client"

import React, { useState } from "react"
import { Bot, Sparkles, Copy, Check, Loader2, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ClinicalNoteSummary } from "@/services/llm/types"

interface DoctorAiNoteModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: {
    id: string
    patientName: string
    reason?: string
    appointmentDate: string
    appointmentTime: string
  }
}

export function DoctorAiNoteModal({ isOpen, onClose, appointment }: DoctorAiNoteModalProps) {
  const [vitalsInput, setVitalsInput] = useState("BP: 120/80 mmHg, HR: 72 bpm, SpO2: 98%")
  const [clinicalNotesInput, setClinicalNotesInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [noteResult, setNoteResult] = useState<ClinicalNoteSummary | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/doctor/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: appointment.patientName,
          concern: appointment.reason || "General medical consultation",
          vitals: vitalsInput,
          notes: clinicalNotesInput,
        })
      })

      if (!res.ok) throw new Error("Failed to generate clinical summary")

      const data = await res.json()
      setNoteResult(data)
    } catch (err) {
      console.error(err)
      alert("Could not generate clinical note at this time.")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!noteResult) return
    const formatted = `CLINICAL CONSULTATION NOTE (SOAP)
Patient: ${noteResult.patientName}
Date: ${appointment.appointmentDate} ${appointment.appointmentTime}
Chief Complaint: ${noteResult.chiefComplaint}

[SUBJECTIVE]
${noteResult.subjective}

[OBJECTIVE]
${noteResult.objective}

[ASSESSMENT]
${noteResult.assessment}

[PLAN]
${noteResult.plan}
`
    navigator.clipboard.writeText(formatted)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-border text-foreground max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-xl text-foreground">AI Clinical Note Assistant</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Draft automated SOAP notes & visit summaries for {appointment.patientName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Intake Info */}
          <div className="p-3.5 rounded-xl bg-surface border border-border text-sm space-y-1">
            <p className="font-semibold text-foreground">Patient Chief Complaint:</p>
            <p className="text-muted-foreground">{appointment.reason || "Routine visit / checkup"}</p>
          </div>

          {/* Quick Doctor Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Observed Vitals / Metrics
              </label>
              <input
                type="text"
                value={vitalsInput}
                onChange={e => setVitalsInput(e.target.value)}
                placeholder="BP, Pulse, Temp, SpO2..."
                className="w-full h-10 px-3 rounded-lg border border-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                Additional Physical Findings (Optional)
              </label>
              <textarea
                rows={2}
                value={clinicalNotesInput}
                onChange={e => setClinicalNotesInput(e.target.value)}
                placeholder="e.g. Chest clear on auscultation, throat mildly hyperemic..."
                className="w-full p-2.5 rounded-lg border border-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-10 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Clinical Note...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Draft SOAP Note
                </>
              )}
            </Button>
          </div>

          {/* Note Result */}
          {noteResult && (
            <div className="mt-4 p-4 rounded-xl bg-surface border border-border space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4" /> Structured SOAP Documentation
                </span>
                <Button size="sm" variant="outline" onClick={handleCopy} className="h-7 text-xs border-border text-foreground hover:bg-muted">
                  {copied ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copied ? "Copied" : "Copy Note"}
                </Button>
              </div>

              <div className="space-y-2.5 text-xs md:text-sm">
                <div>
                  <span className="font-bold text-foreground">S (Subjective): </span>
                  <span className="text-muted-foreground">{noteResult.subjective}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">O (Objective): </span>
                  <span className="text-muted-foreground">{noteResult.objective}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">A (Assessment): </span>
                  <span className="text-muted-foreground">{noteResult.assessment}</span>
                </div>
                <div>
                  <span className="font-bold text-foreground">P (Plan): </span>
                  <span className="text-muted-foreground whitespace-pre-line">{noteResult.plan}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
