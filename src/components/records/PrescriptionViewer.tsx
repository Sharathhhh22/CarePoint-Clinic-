"use client"

import { Printer, Download, X, Calendar, User, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PrescriptionData } from "./PrescriptionModal"

interface PrescriptionViewerProps {
  prescription: PrescriptionData
  onClose?: () => void
}

export function PrescriptionViewer({ prescription, onClose }: PrescriptionViewerProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 max-w-2xl mx-auto print:border-none print:shadow-none print:p-0">
      {/* Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-serif text-primary">℞</span>
          <span className="font-bold text-sm text-foreground">Digital Prescription Record</span>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handlePrint}
            className="h-8 text-xs font-semibold rounded-lg border-border"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" /> Print / Save PDF
          </Button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-elevated transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Formal Clinical Rx Letterhead */}
      <div className="space-y-6 text-foreground">
        <div className="flex items-start justify-between border-b-2 border-primary/20 pb-4">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">{prescription.doctorName}</h1>
            <p className="text-xs text-muted-foreground">General Medicine & Clinical Practice</p>
            <p className="text-xs text-muted-foreground font-mono">Reg No: {prescription.doctorRegNo || "KMC-2019-48201"}</p>
          </div>

          <div className="text-right">
            <h2 className="text-sm font-bold text-foreground">{prescription.clinicName || "SlotUrSelf Health Clinic"}</h2>
            <p className="text-xs text-muted-foreground">Indiranagar, Bengaluru, KA 560038</p>
            <p className="text-xs text-muted-foreground">Tel: +91 80 4567 8900</p>
          </div>
        </div>

        {/* Patient Demographics Strip */}
        <div className="p-3.5 rounded-xl bg-surface border border-border grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Patient Name</span>
            <p className="font-semibold text-foreground text-sm">{prescription.patientName}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Consultation Date</span>
            <p className="font-medium text-foreground">{new Date(prescription.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Prescription ID</span>
            <p className="font-mono text-muted-foreground">{prescription.id}</p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Clinical Impression / Diagnosis:</span>
          <p className="text-sm font-semibold text-foreground">{prescription.diagnosis}</p>
        </div>

        {/* Prescription Symbol and Table */}
        <div className="space-y-3">
          <div className="text-2xl font-bold font-serif text-primary">℞</div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-muted-foreground">
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Medicine Name</th>
                  <th className="p-3 font-semibold">Dosage</th>
                  <th className="p-3 font-semibold">Frequency</th>
                  <th className="p-3 font-semibold">Duration</th>
                  <th className="p-3 font-semibold">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prescription.medicines.map((med, idx) => (
                  <tr key={med.id || idx} className="hover:bg-surface/50">
                    <td className="p-3 text-muted-foreground font-mono">{idx + 1}</td>
                    <td className="p-3 font-semibold text-foreground">{med.name}</td>
                    <td className="p-3 text-muted-foreground">{med.dosage || "-"}</td>
                    <td className="p-3 text-foreground font-medium">{med.frequency}</td>
                    <td className="p-3 text-muted-foreground">{med.duration}</td>
                    <td className="p-3 text-muted-foreground">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dietary / General Advice */}
        {prescription.advice && (
          <div className="space-y-1 p-3.5 rounded-xl bg-surface border border-border text-xs">
            <span className="font-bold text-foreground">Dietary & Clinical Advice:</span>
            <p className="text-muted-foreground mt-0.5 leading-relaxed">{prescription.advice}</p>
          </div>
        )}

        {/* Follow-up Note */}
        {prescription.followUpDays ? (
          <div className="text-xs text-muted-foreground">
            <strong>Follow-up:</strong> Review in clinic after {prescription.followUpDays} days or earlier if symptoms persist.
          </div>
        ) : null}

        {/* Signature Stamp */}
        <div className="pt-8 border-t border-border flex items-end justify-between text-xs">
          <div className="text-[11px] text-muted-foreground">
            <p>Generated via SlotUrSelf Verified Clinical Platform</p>
            <p>Certified Electronic Health Record • Valid across pharmacies in India</p>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Signed
            </div>
            <p className="font-semibold text-foreground">{prescription.doctorName}</p>
            <p className="text-[11px] text-muted-foreground">Lic: {prescription.doctorRegNo || "KMC-2019-48201"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
