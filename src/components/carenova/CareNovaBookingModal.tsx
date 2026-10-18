"use client"
import { getStoredUtmParams } from "@/components/common/UtmTracker"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Stethoscope, 
  Heart, 
  ShieldCheck,
  AlertCircle
} from "lucide-react"

interface CareNovaBookingModalProps {
  isOpen: boolean
  onClose: () => void
  initialService?: string
  initialDoctor?: string
}

const DOCTORS = [
  {
    name: "Dr. Sara Khan",
    specialty: "Cardiologist",
    image: "/images/carenova/dr-sara-khan.jpg",
    availability: "Available Tomorrow"
  },
  {
    name: "Dr. Marcus Vance",
    specialty: "Family Medicine",
    image: "/images/carenova/dr-marcus-vance.jpg",
    availability: "Available Today"
  },
  {
    name: "Dr. Elena Rostova",
    specialty: "Internal Medicine",
    image: "/images/carenova/dr-elena-rostova.jpg",
    availability: "Available Today"
  },
  {
    name: "Dr. Anita Chen",
    specialty: "Pediatrics",
    image: "/images/carenova/dr-anita-chen.jpg",
    availability: "Available Tomorrow"
  }
]

const SERVICES = [
  {
    id: "general",
    name: "General Consultation",
    desc: "Primary evaluation, routine check-ups, and health assessments",
    duration: "30 min",
    icon: Stethoscope
  },
  {
    id: "preventive",
    name: "Preventive Health",
    desc: "Comprehensive screening, cardiovascular wellness, and lifestyle planning",
    duration: "45 min",
    icon: Heart
  },
  {
    id: "specialist",
    name: "Specialist Consultation",
    desc: "In-depth clinical evaluation with a medical specialist",
    duration: "45 min",
    icon: ShieldCheck
  },
  {
    id: "followup",
    name: "Follow-up Care",
    desc: "Treatment review, recovery evaluation, and prescription checks",
    duration: "20 min",
    icon: Clock
  }
]

const TIME_SLOTS = [
  "09:00 AM", "09:45 AM", "10:30 AM", "11:15 AM", 
  "02:00 PM", "02:45 PM", "03:30 PM", "04:15 PM", "05:00 PM"
]

export function CareNovaBookingModal({
  isOpen,
  onClose,
  initialService,
  initialDoctor,
}: CareNovaBookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  
  // Form State
  const [selectedService, setSelectedService] = useState(initialService || "General Consultation")
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor || "Dr. Sara Khan")
  const [selectedDate, setSelectedDate] = useState("Tomorrow, Oct 19")
  const [selectedTime, setSelectedTime] = useState("10:30 AM")
  
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [notes, setNotes] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingRef, setBookingRef] = useState("")

  useEffect(() => {
    if (initialService) setSelectedService(initialService)
    if (initialDoctor) setSelectedDoctor(initialDoctor)
  }, [initialService, initialDoctor])

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

  const validateDetails = () => {
    const newErrors: Record<string, string> = {}
    if (!patientName.trim()) newErrors.name = "Please enter your full name."
    if (!patientEmail.trim() || !patientEmail.includes("@")) {
      newErrors.email = "Please enter a valid email address."
    }
    if (!patientPhone.trim() || patientPhone.replace(/\D/g, "").length < 7) {
      newErrors.phone = "Please enter a valid telephone number."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateDetails()) return

    setIsSubmitting(true)
    setTimeout(() => {
      const randomCode = "CP-" + Math.floor(10000 + Math.random() * 90000)
      setBookingRef(randomCode)
      try {
        const utm = getStoredUtmParams()
        sessionStorage.setItem("carepoint_last_booking", JSON.stringify({
          code: randomCode,
          service: selectedService,
          doctor: selectedDoctor,
          date: selectedDate,
          time: selectedTime,
          utm,
          created_at: new Date().toISOString()
        }))
      } catch {}
      setIsSubmitting(false)
      setStep(4) // Confirmation step
    }, 600)
  }

  const resetForm = () => {
    setStep(1)
    setPatientName("")
    setPatientEmail("")
    setPatientPhone("")
    setNotes("")
    setErrors({})
    setBookingRef("")
  }

  const availableDates = [
    { label: "Today, Oct 18", slots: "3 available" },
    { label: "Tomorrow, Oct 19", slots: "6 available" },
    { label: "Monday, Oct 21", slots: "8 available" },
    { label: "Tuesday, Oct 22", slots: "5 available" }
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#101512]/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="CarePoint Clinic Appointment Booking"
    >
      <div
        className="w-full max-w-2xl bg-[#FAFAF7] rounded-3xl border border-[#E0E4DF] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E4DF] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101512]">CarePoint Clinic Scheduling</h3>
              <p className="text-xs text-[#777D79]">
                {step === 1 && "Step 1 of 3: Select Service & Doctor"}
                {step === 2 && "Step 2 of 3: Select Date & Time"}
                {step === 3 && "Step 3 of 3: Patient Information"}
                {step === 4 && "Appointment Request Submitted"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E7EEE8] text-[#173F30] hover:bg-[#173F30] hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicator (if not confirmation) */}
        {step < 4 && (
          <div className="w-full bg-[#E7EEE8] h-1">
            <div 
              className="bg-[#173F30] h-1 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Service & Doctor Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101512] mb-3">
                  Choose a Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map(srv => {
                    const IconComp = srv.icon
                    const isSelected = selectedService === srv.name
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedService(srv.name)}
                        className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                          isSelected
                            ? "bg-white border-[#173F30] ring-2 ring-[#173F30]/10 shadow-xs"
                            : "bg-[#FAFAF7] border-[#E0E4DF] hover:border-[#A9C2B2] hover:bg-white"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-[#173F30] text-white" : "bg-[#E7EEE8] text-[#173F30]"
                        }`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-[#101512]">{srv.name}</span>
                            <span className="text-[11px] font-medium text-[#777D79] bg-[#E7EEE8] px-2 py-0.5 rounded-full">{srv.duration}</span>
                          </div>
                          <p className="text-xs text-[#777D79] mt-1 line-clamp-2">{srv.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101512] mb-3">
                  Select Clinician
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DOCTORS.map(doc => {
                    const isSelected = selectedDoctor === doc.name
                    return (
                      <button
                        key={doc.name}
                        type="button"
                        onClick={() => setSelectedDoctor(doc.name)}
                        className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                          isSelected
                            ? "bg-white border-[#173F30] ring-2 ring-[#173F30]/10 shadow-xs"
                            : "bg-[#FAFAF7] border-[#E0E4DF] hover:border-[#A9C2B2] hover:bg-white"
                        }`}
                      >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#E0E4DF]">
                          <Image
                            src={doc.image}
                            alt={doc.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#101512] truncate">{doc.name}</p>
                          <p className="text-xs text-[#777D79]">{doc.specialty}</p>
                        </div>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E7EEE8] text-[#173F30] shrink-0">
                          {doc.availability}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101512] mb-3">
                  Select Day
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableDates.map(date => {
                    const isSelected = selectedDate === date.label
                    return (
                      <button
                        key={date.label}
                        type="button"
                        onClick={() => setSelectedDate(date.label)}
                        className={`p-3 rounded-2xl text-center border transition-all ${
                          isSelected
                            ? "bg-[#173F30] text-white border-[#173F30] shadow-xs"
                            : "bg-white text-[#101512] border-[#E0E4DF] hover:border-[#A9C2B2]"
                        }`}
                      >
                        <p className="font-semibold text-xs truncate">{date.label}</p>
                        <p className={`text-[10px] mt-1 ${isSelected ? 'text-[#A9C2B2]' : 'text-[#777D79]'}`}>
                          {date.slots}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#101512] mb-3">
                  Available Slots
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
                  {TIME_SLOTS.map(time => {
                    const isSelected = selectedTime === time
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2.5 px-3 rounded-xl text-center text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-[#173F30] text-white border-[#173F30] shadow-xs font-bold"
                            : "bg-white text-[#101512] border-[#E0E4DF] hover:border-[#A9C2B2]"
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Selection Summary Callout */}
              <div className="p-4 rounded-2xl bg-[#E7EEE8] border border-[#A9C2B2]/40 flex items-center justify-between text-xs text-[#173F30]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#173F30] shrink-0" />
                  <span>
                    Selected: <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> with <strong>{selectedDoctor}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Patient Information */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="booking-patient-name" className="block text-xs font-bold uppercase tracking-wider text-[#101512] mb-1.5">
                  Full Name <span className="text-[#173F30]">*</span>
                </label>
                <input
                  id="booking-patient-name"
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E0E4DF] focus:border-[#173F30] focus:outline-hidden text-sm text-[#101512]"
                />
                {errors.name && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="booking-patient-email" className="block text-xs font-bold uppercase tracking-wider text-[#101512] mb-1.5">
                    Email Address <span className="text-[#173F30]">*</span>
                  </label>
                  <input
                    id="booking-patient-email"
                    type="email"
                    value={patientEmail}
                    onChange={e => setPatientEmail(e.target.value)}
                    placeholder="eleanor@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E0E4DF] focus:border-[#173F30] focus:outline-hidden text-sm text-[#101512]"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="booking-patient-phone" className="block text-xs font-bold uppercase tracking-wider text-[#101512] mb-1.5">
                    Phone Number <span className="text-[#173F30]">*</span>
                  </label>
                  <input
                    id="booking-patient-phone"
                    type="tel"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E0E4DF] focus:border-[#173F30] focus:outline-hidden text-sm text-[#101512]"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="booking-notes" className="block text-xs font-bold uppercase tracking-wider text-[#101512] mb-1.5">
                  Reason for Visit / Clinical Notes (Optional)
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Briefly describe your symptoms or reason for scheduling..."
                  className="w-full px-4 py-2 rounded-xl bg-white border border-[#E0E4DF] focus:border-[#173F30] focus:outline-hidden text-sm text-[#101512]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E7EEE8]/60 border border-[#E0E4DF] text-xs text-[#777D79] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#173F30] shrink-0 mt-0.5" />
                <span>
                  Your personal and clinical health data is handled strictly in adherence to CarePoint Clinic privacy guidelines. No third-party data sharing.
                </span>
              </div>
            </form>
          )}

          {/* STEP 4: Confirmation State */}
          {step === 4 && (
            <div className="text-center py-6 px-2 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#E7EEE8] text-[#173F30] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E7EEE8] text-[#173F30]">
                  Reference #{bookingRef}
                </span>
                <h4 className="text-2xl font-bold text-[#101512] mt-2">
                  Appointment Request Received
                </h4>
                <p className="text-sm text-[#777D79] max-w-md mx-auto mt-1 leading-relaxed">
                  Thank you, {patientName}. Our clinic administration has scheduled your consultation.
                  A confirmation summary has been logged for your arrival.
                </p>
              </div>

              {/* Consultation Summary Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-[#E0E4DF] text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-[#E0E4DF]/60">
                  <span className="text-[#777D79]">Doctor:</span>
                  <span className="font-semibold text-[#101512]">{selectedDoctor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E0E4DF]/60">
                  <span className="text-[#777D79]">Service:</span>
                  <span className="font-semibold text-[#101512]">{selectedService}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E0E4DF]/60">
                  <span className="text-[#777D79]">Scheduled Time:</span>
                  <span className="font-semibold text-[#101512]">{selectedDate} &bull; {selectedTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#777D79]">Patient:</span>
                  <span className="font-semibold text-[#101512]">{patientName} ({patientPhone})</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#E0E4DF] text-xs font-semibold text-[#101512] hover:bg-[#E7EEE8] transition-colors"
                >
                  Book Another Visit
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#173F30] text-white text-xs font-semibold hover:bg-[#123326] transition-colors shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 - 3) */}
        {step < 4 && (
          <div className="px-6 py-4 bg-white border-t border-[#E0E4DF] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E0E4DF] text-xs font-semibold text-[#101512] hover:bg-[#E7EEE8] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <span className="text-xs text-[#777D79]">CarePoint Clinic Scheduling</span>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as 2 | 3)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#173F30] text-white text-xs font-semibold hover:bg-[#123326] transition-colors shadow-xs"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#173F30] text-white text-xs font-semibold hover:bg-[#123326] transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Confirming Request..." : "Confirm Appointment"} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
