"use client"

import React, { useEffect } from "react"
import { X, Shield, FileText } from "lucide-react"

interface LegalModalProps {
  isOpen: boolean
  onClose: () => void
  type: "privacy" | "terms"
}

export function CareNovaLegalModal({ isOpen, onClose, type }: LegalModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isPrivacy = type === "privacy"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#101512]/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={isPrivacy ? "CarePoint Clinic Privacy Policy" : "CarePoint Clinic Terms of Use"}
    >
      <div
        className="w-full max-w-2xl bg-[#FAFAF7] rounded-3xl border border-[#E0E4DF] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E4DF] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center">
              {isPrivacy ? <Shield className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101512]">
                {isPrivacy ? "Privacy & Patient Data Protection" : "Terms of Service & Clinical Care"}
              </h3>
              <p className="text-xs text-[#777D79]">CarePoint Clinic Legal & Governance Overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E7EEE8] text-[#173F30] hover:bg-[#173F30] hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#101512] leading-relaxed">
          {isPrivacy ? (
            <>
              <div>
                <h4 className="font-bold text-[#173F30] mb-1">1. Patient Confidentiality & Security</h4>
                <p className="text-[#777D79]">
                  At CarePoint Clinic, safeguarding your personal medical information is fundamental to our clinical practice.
                  We implement robust technical and procedural safeguards to ensure your health information remains strictly confidential.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#173F30] mb-1">2. Information We Collect</h4>
                <p className="text-[#777D79]">
                  When booking a consultation or communicating with CarePoint Clinic, we collect contact details (such as name, phone, email) and necessary appointment scheduling preferences. Clinical histories are maintained under strict medical privacy standards.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#173F30] mb-1">3. How Information Is Used</h4>
                <p className="text-[#777D79]">
                  Collected data is strictly utilized for coordinating your outpatient care, confirming appointment timings, providing diagnostic follow-up notes, and ensuring continuity of clinical service. We never monetize or distribute patient information to third-party advertisers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#173F30] mb-1">4. Your Rights & Access</h4>
                <p className="text-[#777D79]">
                  Patients retain the right to request summaries of their scheduled visits, update contact preferences, or request data rectification by contacting our dedicated clinic administration team at any time.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-bold text-[#173F30] mb-1">1. Clinical Scope of Services</h4>
                <p className="text-[#777D79]">
                  CarePoint Clinic provides scheduled outpatient medical consultations, preventive assessments, and health screenings.
                  Online scheduling requests represent an appointment reservation and do not replace emergency medical interventions. In a life-threatening crisis, contact emergency services immediately.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#173F30] mb-1">2. Appointments & Timeliness</h4>
                <p className="text-[#777D79]">
                  We prioritize unrushed, thoughtful care. Patients are kindly asked to arrive approximately 10 minutes prior to scheduled consultation times to complete any necessary check-in verifications.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#173F30] mb-1">3. Cancellations & Rescheduling</h4>
                <p className="text-[#777D79]">
                  If you need to reschedule or cancel a consultation, please notify the clinic at least 4 hours in advance so the slot can be made available to other patients requiring care.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#173F30] mb-1">4. Mutual Respect & Conduct</h4>
                <p className="text-[#777D79]">
                  We are committed to maintaining a compassionate, safe, and respectful environment for both our clinical staff and visiting patients.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#E0E4DF] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#173F30] text-white text-xs font-semibold hover:bg-[#123326] transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}
