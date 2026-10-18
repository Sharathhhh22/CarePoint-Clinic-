"use client"

import { useState } from "react"
import { Plus, Trash2, CheckCircle2, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"

export interface PrescriptionMedicine {
  id: string
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

export interface PrescriptionData {
  id: string
  appointmentId: string
  patientId?: string
  patientName: string
  doctorName: string
  doctorRegNo?: string
  clinicName?: string
  date: string
  diagnosis: string
  medicines: PrescriptionMedicine[]
  advice: string
  followUpDays?: number
}

interface PrescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: string
  patientName: string
  doctorName: string
  doctorRegNo?: string
  clinicName?: string
  onPrescriptionCreated?: (prescription: PrescriptionData) => void
}

export function PrescriptionModal({
  isOpen,
  onClose,
  appointmentId,
  patientName,
  doctorName,
  doctorRegNo = "KMC-2019-48201",
  clinicName = "SlotUrSelf Health Clinic",
  onPrescriptionCreated
}: PrescriptionModalProps) {
  const [diagnosis, setDiagnosis] = useState("")
  const [advice, setAdvice] = useState("")
  const [followUpDays, setFollowUpDays] = useState<number>(7)
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: "1",
      name: "Paracetamol",
      dosage: "650 mg",
      frequency: "Twice daily (1-0-1)",
      duration: "3 days",
      instructions: "After food"
    }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()

  if (!isOpen) return null

  const addMedicine = () => {
    setMedicines(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        dosage: "",
        frequency: "Once daily",
        duration: "5 days",
        instructions: "After meals"
      }
    ])
  }

  const updateMedicine = (id: string, field: keyof PrescriptionMedicine, value: string) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const removeMedicine = (id: string) => {
    if (medicines.length === 1) return
    setMedicines(prev => prev.filter(m => m.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!diagnosis.trim()) {
      setError("Please provide a provisional diagnosis.")
      return
    }

    const validMeds = medicines.filter(m => m.name.trim().length > 0)
    if (validMeds.length === 0) {
      setError("Please specify at least one medication.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const rxData: PrescriptionData = {
        id: `rx-${Date.now()}`,
        appointmentId,
        patientName,
        doctorName,
        doctorRegNo,
        clinicName,
        date: new Date().toISOString().split('T')[0],
        diagnosis: diagnosis.trim(),
        medicines: validMeds,
        advice: advice.trim(),
        followUpDays
      }

      // Save to localStorage as persistent health record store
      const stored = localStorage.getItem("sloturself_prescriptions")
      const existing = stored ? JSON.parse(stored) : []
      localStorage.setItem("sloturself_prescriptions", JSON.stringify([rxData, ...existing]))

      // Also persist to patient_records if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('patient_records').insert([
          {
            patient_id: user.id,
            title: `Digital Prescription - ${diagnosis.trim()} (${new Date().toLocaleDateString('en-IN')})`,
            file_url: "#prescription-" + rxData.id
          }
        ])
      }

      onPrescriptionCreated?.(rxData)
      onClose()
    } catch (err: any) {
      console.warn("Save rx error:", err)
      setError("Failed to save prescription. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-card border border-border w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
              ℞
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Write Digital Prescription</h2>
              <p className="text-xs text-muted-foreground">
                Patient: <span className="font-semibold text-foreground">{patientName}</span> • Prescribing Physician: <span className="font-semibold text-foreground">{doctorName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
            aria-label="Close prescription modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Diagnosis */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Provisional Diagnosis & Clinical Impression <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Rhinopharyngitis with low-grade fever / Hypertension Stage 1"
              className="w-full h-11 px-3.5 rounded-xl border border-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Medicines Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Prescribed Medications
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMedicine}
                className="h-8 text-xs font-semibold rounded-lg border-border"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-primary" /> Add Medicine
              </Button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, idx) => (
                <div key={med.id} className="p-4 rounded-xl bg-surface border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">Medicine #{idx + 1}</span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(med.id)}
                        className="p-1 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    <div className="lg:col-span-2">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => updateMedicine(med.id, 'name', e.target.value)}
                        placeholder="Drug / Medicine Name"
                        className="w-full h-9 px-3 rounded-lg border border-border bg-input-bg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)}
                        placeholder="Strength (e.g. 500mg)"
                        className="w-full h-9 px-3 rounded-lg border border-border bg-input-bg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <select
                        value={med.frequency}
                        onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)}
                        className="w-full h-9 px-2.5 rounded-lg border border-border bg-input-bg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Once daily (1-0-0)">Once daily (Morning)</option>
                        <option value="Twice daily (1-0-1)">Twice daily (1-0-1)</option>
                        <option value="Thrice daily (1-1-1)">Thrice daily (1-1-1)</option>
                        <option value="At Bedtime (0-0-1)">At Bedtime (0-0-1)</option>
                        <option value="As needed (SOS)">As needed (SOS)</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={med.instructions}
                        onChange={(e) => updateMedicine(med.id, 'instructions', e.target.value)}
                        className="w-full h-9 px-2 rounded-lg border border-border bg-input-bg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="After food">After food</option>
                        <option value="Before food">Before food</option>
                        <option value="With water">With water</option>
                        <option value="Empty stomach">Empty stomach</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Follow-Up */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Dietary & General Clinical Advice
              </label>
              <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                placeholder="e.g. Hydrate well, avoid cold beverages, complete the antibiotic course..."
                className="w-full h-20 p-3 rounded-xl border border-border bg-input-bg text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Follow-up Review
              </label>
              <select
                value={followUpDays}
                onChange={(e) => setFollowUpDays(parseInt(e.target.value, 10))}
                className="w-full h-11 px-3 rounded-xl border border-border bg-input-bg text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={3}>After 3 Days</option>
                <option value={5}>After 5 Days</option>
                <option value={7}>After 1 Week</option>
                <option value={14}>After 2 Weeks</option>
                <option value={30}>After 1 Month</option>
                <option value={0}>As Needed (SOS)</option>
              </select>
            </div>
          </div>

          {/* Signature Verification Footer Preview */}
          <div className="p-4 rounded-xl bg-surface/70 border border-border flex items-center justify-between text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">{doctorName}</p>
              <p>Registration No: {doctorRegNo}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Signed
              </span>
              <p className="text-[11px]">{clinicName}</p>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl border-border">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-xl px-6"
            >
              {isSubmitting ? "Generating Rx..." : "Sign & Issue Prescription"}
            </Button>
          </div>
        </form>

      </div>
    </div>
  )
}
