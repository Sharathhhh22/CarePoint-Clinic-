"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react"
import { getStoredUtmParams } from "@/components/common/UtmTracker"
import { toast } from "@/components/ui/toast"
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Stethoscope, 
  Heart, 
  ShieldCheck,
  AlertCircle,
  CreditCard,
  UserCheck,
  Sparkles,
  Lock
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
    price: "$95",
    icon: Stethoscope
  },
  {
    id: "preventive",
    name: "Preventive Health",
    desc: "Comprehensive screening, cardiovascular wellness, and lifestyle planning",
    duration: "45 min",
    price: "$150",
    icon: Heart
  },
  {
    id: "specialist",
    name: "Specialist Consultation",
    desc: "In-depth clinical evaluation with a medical specialist",
    duration: "45 min",
    price: "$175",
    icon: ShieldCheck
  },
  {
    id: "followup",
    name: "Follow-up Care",
    desc: "Treatment review, recovery evaluation, and prescription checks",
    duration: "20 min",
    price: "$65",
    icon: Clock
  }
]

interface CalendarDay {
  dateNum: number
  dayName: string
  fullLabel: string
  isAvailable: boolean
  slots?: number
  reason?: string
}

const CALENDAR_DAYS: CalendarDay[] = [
  { dateNum: 15, dayName: "Thu", fullLabel: "Thursday, Oct 15", isAvailable: false, reason: "Past date" },
  { dateNum: 16, dayName: "Fri", fullLabel: "Friday, Oct 16", isAvailable: false, reason: "Past date" },
  { dateNum: 17, dayName: "Sat", fullLabel: "Saturday, Oct 17", isAvailable: false, reason: "Past date" },
  { dateNum: 18, dayName: "Sun", fullLabel: "Sunday, Oct 18", isAvailable: false, reason: "Clinic Closed on Sundays" },
  { dateNum: 19, dayName: "Mon", fullLabel: "Monday, Oct 19", isAvailable: true, slots: 6 },
  { dateNum: 20, dayName: "Tue", fullLabel: "Tuesday, Oct 20", isAvailable: true, slots: 8 },
  { dateNum: 21, dayName: "Wed", fullLabel: "Wednesday, Oct 21", isAvailable: true, slots: 5 },
  { dateNum: 22, dayName: "Thu", fullLabel: "Thursday, Oct 22", isAvailable: true, slots: 7 },
  { dateNum: 23, dayName: "Fri", fullLabel: "Friday, Oct 23", isAvailable: true, slots: 4 },
  { dateNum: 24, dayName: "Sat", fullLabel: "Saturday, Oct 24", isAvailable: false, reason: "Fully Booked" },
  { dateNum: 25, dayName: "Sun", fullLabel: "Sunday, Oct 25", isAvailable: false, reason: "Clinic Closed on Sundays" },
  { dateNum: 26, dayName: "Mon", fullLabel: "Monday, Oct 26", isAvailable: true, slots: 9 },
  { dateNum: 27, dayName: "Tue", fullLabel: "Tuesday, Oct 27", isAvailable: true, slots: 6 },
  { dateNum: 28, dayName: "Wed", fullLabel: "Wednesday, Oct 28", isAvailable: true, slots: 7 },
]

const TIME_SLOTS = [
  { time: "09:00 AM", period: "Morning", available: true },
  { time: "09:45 AM", period: "Morning", available: true },
  { time: "10:30 AM", period: "Morning", available: true },
  { time: "11:15 AM", period: "Morning", available: true },
  { time: "01:30 PM", period: "Afternoon", available: false }, // Booked
  { time: "02:15 PM", period: "Afternoon", available: true },
  { time: "03:00 PM", period: "Afternoon", available: true },
  { time: "03:45 PM", period: "Afternoon", available: true },
  { time: "04:30 PM", period: "Afternoon", available: true },
]

export function CareNovaBookingModal({
  isOpen,
  onClose,
  initialService,
  initialDoctor,
}: CareNovaBookingModalProps) {
  const shouldReduceMotion = useReducedMotion()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  
  // Form State
  const [selectedService, setSelectedService] = useState(initialService || "General Consultation")
  const [selectedDoctor, setSelectedDoctor] = useState(initialDoctor || "Dr. Sara Khan")
  const [selectedDate, setSelectedDate] = useState("Monday, Oct 19")
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

  const currentServiceObj = SERVICES.find(s => s.name === selectedService) || SERVICES[0]
  const currentDoctorObj = DOCTORS.find(d => d.name === selectedDoctor) || DOCTORS[0]

  const handleSelectService = (name: string, duration: string) => {
    setSelectedService(name)
    toast({
      title: "Service Selected",
      description: `${name} • Duration: ${duration}`,
      variant: "default",
    })
  }

  const handleSelectDoctor = (name: string, specialty: string) => {
    setSelectedDoctor(name)
    toast({
      title: "Physician Selected",
      description: `${name} (${specialty})`,
      variant: "default",
    })
  }

  const handleSelectDate = (fullLabel: string, slotsCount?: number) => {
    setSelectedDate(fullLabel)
    toast({
      title: "Consultation Date Selected",
      description: `${fullLabel} • ${slotsCount || "Available"} slots remaining`,
      variant: "default",
    })
  }

  const handleSelectTime = (time: string) => {
    setSelectedTime(time)
    toast({
      title: "Time Slot Reserved",
      description: `${selectedDate} at ${time}`,
      variant: "info",
    })
  }

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
      setStep(4)
      toast({
        title: "Appointment Request Confirmed",
        description: `Booking #${randomCode} scheduled for ${patientName}`,
        variant: "success",
      })
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

  // Animation variants
  const stepVariants: Variants = {
    initial: shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.22,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
    exit: {
      opacity: shouldReduceMotion ? 1 : 0,
      x: shouldReduceMotion ? 0 : -16,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.18,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#101512]/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="CarePoint Clinic Appointment Booking Wizard"
    >
      <div
        className="w-full max-w-4xl bg-[#FAFAF7] dark:bg-[#0D1511] rounded-3xl border border-[#E0E4DF] dark:border-[#4E6C5D] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E4DF] dark:border-[#4E6C5D] bg-white dark:bg-[#121B16]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#E7EEE8] dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#101512] dark:text-[#EAEFEA]">CarePoint Clinic Scheduling</h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#173F30] dark:text-[#A9C2B2] bg-[#E7EEE8] dark:bg-[#1E2E25] px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#777D79] dark:text-[#9BAAA0]">
                {step === 1 && "Step 1 of 3 • Select Clinical Service & Physician"}
                {step === 2 && "Step 2 of 3 • Choose Date & Time Slot"}
                {step === 3 && "Step 3 of 3 • Patient Contact & Intake Details"}
                {step === 4 && "Appointment Confirmed • Booking Summary"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E7EEE8] dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2] hover:bg-[#173F30] hover:text-white dark:hover:bg-[#A9C2B2] dark:hover:text-[#101512] flex items-center justify-center transition-colors focus-visible:outline-none"
            aria-label="Close booking wizard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        {step < 4 && (
          <div className="w-full bg-[#E7EEE8] dark:bg-[#1E2E25] h-1" role="progressbar" aria-valuenow={(step / 3) * 100} aria-valuemin={0} aria-valuemax={100}>
            <div 
              className="bg-[#173F30] dark:bg-[#A9C2B2] h-1 transition-all duration-300 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Main Layout: 2-Column with Live Summary Panel */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT: Interactive Wizard Steps (cols 1-7 or 12 for step 4) */}
            <div className={step === 4 ? "lg:col-span-12" : "lg:col-span-7 xl:col-span-8 space-y-6"}>
              <AnimatePresence mode="wait">
                {/* STEP 1: Service & Doctor Selection */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#101512] dark:text-[#EAEFEA]">
                          1. Select Clinical Service
                        </label>
                        <span className="text-xs text-[#777D79] dark:text-[#9BAAA0]">Transparent fee shown</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {SERVICES.map(srv => {
                          const IconComp = srv.icon
                          const isSelected = selectedService === srv.name
                          return (
                            <button
                              key={srv.id}
                              type="button"
                              onClick={() => handleSelectService(srv.name, srv.duration)}
                              className={`p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 relative cursor-pointer focus-visible:outline-none ${
                                isSelected
                                  ? "bg-white dark:bg-[#16213A] border-[#173F30] dark:border-[#A9C2B2] ring-2 ring-[#173F30]/15 dark:ring-[#A9C2B2]/20 shadow-xs"
                                  : "bg-[#FAFAF7] dark:bg-[#121B16] border-[#E0E4DF] dark:border-[#4E6C5D] hover:border-[#A9C2B2] hover:bg-white dark:hover:bg-[#16213A]"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isSelected 
                                  ? "bg-[#173F30] text-white dark:bg-[#A9C2B2] dark:text-[#101512]" 
                                  : "bg-[#E7EEE8] dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2]"
                              }`}>
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-semibold text-sm text-[#101512] dark:text-[#EAEFEA] truncate">{srv.name}</span>
                                  <span className="text-xs font-bold text-[#173F30] dark:text-[#A9C2B2] shrink-0">{srv.price}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[11px] text-[#777D79] dark:text-[#9BAAA0]">{srv.duration}</span>
                                </div>
                                <p className="text-xs text-[#777D79] dark:text-[#9BAAA0] mt-1 line-clamp-2 leading-relaxed">{srv.desc}</p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#101512] dark:text-[#EAEFEA]">
                          2. Select Board-Certified Physician
                        </label>
                        <span className="text-xs text-[#777D79] dark:text-[#9BAAA0]">Verified credentials</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {DOCTORS.map(doc => {
                          const isSelected = selectedDoctor === doc.name
                          return (
                            <button
                              key={doc.name}
                              type="button"
                              onClick={() => handleSelectDoctor(doc.name, doc.specialty)}
                              className={`p-3 rounded-2xl text-left border transition-all flex items-center gap-3 cursor-pointer focus-visible:outline-none ${
                                isSelected
                                  ? "bg-white dark:bg-[#16213A] border-[#173F30] dark:border-[#A9C2B2] ring-2 ring-[#173F30]/15 dark:ring-[#A9C2B2]/20 shadow-xs"
                                  : "bg-[#FAFAF7] dark:bg-[#121B16] border-[#E0E4DF] dark:border-[#4E6C5D] hover:border-[#A9C2B2] hover:bg-white dark:hover:bg-[#16213A]"
                              }`}
                            >
                              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#E0E4DF] dark:border-[#4E6C5D]">
                                <Image
                                  src={doc.image}
                                  alt={doc.name}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-[#101512] dark:text-[#EAEFEA] truncate">{doc.name}</p>
                                <p className="text-xs text-[#777D79] dark:text-[#9BAAA0]">{doc.specialty}</p>
                              </div>
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#E7EEE8] dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2] shrink-0">
                                {doc.availability}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Interactive Calendar & Time Selection */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    {/* Interactive Calendar with Unavailable Days Clearly Marked */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#101512] dark:text-[#EAEFEA]">
                          Select Appointment Date
                        </label>
                        <div className="flex items-center gap-3 text-[11px] text-[#777D79] dark:text-[#9BAAA0]">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#173F30] dark:bg-[#A9C2B2]" /> Available
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#CBD5E1] dark:bg-[#4E6C5D]" /> Unavailable
                          </span>
                        </div>
                      </div>

                      {/* Calendar Day Grid */}
                      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                        {CALENDAR_DAYS.map(day => {
                          const isSelected = selectedDate === day.fullLabel
                          const isUnavailable = !day.isAvailable

                          if (isUnavailable) {
                            return (
                              <button
                                key={day.dateNum}
                                type="button"
                                disabled={true}
                                aria-disabled="true"
                                title={day.reason || "Unavailable"}
                                className="p-2 sm:p-2.5 rounded-xl border border-[#E0E4DF]/50 dark:border-[#4E6C5D]/30 bg-[#E0E4DF]/20 dark:bg-[#121B16]/40 text-[#94A3B8] dark:text-[#64748B] flex flex-col items-center justify-center cursor-not-allowed opacity-55 relative overflow-hidden"
                              >
                                <span className="text-[10px] font-medium uppercase">{day.dayName}</span>
                                <span className="text-xs sm:text-sm font-semibold line-through decoration-red-400">{day.dateNum}</span>
                                <span className="text-[9px] mt-0.5 truncate w-full text-center">
                                  {day.reason?.includes("Closed") ? "Closed" : "Booked"}
                                </span>
                              </button>
                            )
                          }

                          return (
                            <button
                              key={day.dateNum}
                              type="button"
                              onClick={() => handleSelectDate(day.fullLabel, day.slots)}
                              className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer relative focus-visible:outline-none ${
                                isSelected
                                  ? "bg-[#173F30] text-white dark:bg-[#A9C2B2] dark:text-[#101512] border-[#173F30] dark:border-[#A9C2B2] shadow-sm font-bold ring-2 ring-[#173F30]/20"
                                  : "bg-white dark:bg-[#16213A] text-[#101512] dark:text-[#EAEFEA] border-[#E0E4DF] dark:border-[#4E6C5D] hover:border-[#173F30] dark:hover:border-[#A9C2B2]"
                              }`}
                            >
                              <span className={`text-[10px] font-medium uppercase ${isSelected ? 'text-[#A9C2B2] dark:text-[#173F30]' : 'text-[#777D79] dark:text-[#9BAAA0]'}`}>
                                {day.dayName}
                              </span>
                              <span className="text-xs sm:text-sm font-bold">{day.dateNum}</span>
                              <span className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/90 dark:text-[#101512]/90 font-medium' : 'text-[#173F30] dark:text-[#A9C2B2]'}`}>
                                {day.slots} slots
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Slots Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#101512] dark:text-[#EAEFEA]">
                          Select Arrival Time Slot
                        </label>
                        <span className="text-xs text-[#777D79] dark:text-[#9BAAA0]">Eastern Time (US & Canada)</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map(slot => {
                          const isSelected = selectedTime === slot.time
                          if (!slot.available) {
                            return (
                              <button
                                key={slot.time}
                                type="button"
                                disabled={true}
                                aria-disabled="true"
                                className="py-2.5 px-3 rounded-xl text-center text-xs font-medium border border-[#E0E4DF]/60 dark:border-[#4E6C5D]/40 bg-[#E0E4DF]/20 dark:bg-[#121B16]/40 text-[#94A3B8] dark:text-[#64748B] line-through cursor-not-allowed opacity-50"
                              >
                                {slot.time}
                              </button>
                            )
                          }
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              onClick={() => handleSelectTime(slot.time)}
                              className={`py-2.5 px-3 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer focus-visible:outline-none ${
                                isSelected
                                  ? "bg-[#173F30] text-white dark:bg-[#A9C2B2] dark:text-[#101512] border-[#173F30] dark:border-[#A9C2B2] shadow-xs ring-2 ring-[#173F30]/15"
                                  : "bg-white dark:bg-[#16213A] text-[#101512] dark:text-[#EAEFEA] border-[#E0E4DF] dark:border-[#4E6C5D] hover:border-[#173F30] dark:hover:border-[#A9C2B2]"
                              }`}
                            >
                              {slot.time}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Patient Intake Form */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="booking-patient-name" className="block text-xs font-bold uppercase tracking-wider text-[#101512] dark:text-[#EAEFEA] mb-1.5">
                          Full Legal Name <span className="text-[#173F30] dark:text-[#A9C2B2]">*</span>
                        </label>
                        <input
                          id="booking-patient-name"
                          type="text"
                          value={patientName}
                          onChange={e => setPatientName(e.target.value)}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#16213A] border border-[#E0E4DF] dark:border-[#4E6C5D] text-sm text-[#101512] dark:text-[#EAEFEA] focus-visible:outline-none"
                        />
                        {errors.name && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="booking-patient-email" className="block text-xs font-bold uppercase tracking-wider text-[#101512] dark:text-[#EAEFEA] mb-1.5">
                            Email Address <span className="text-[#173F30] dark:text-[#A9C2B2]">*</span>
                          </label>
                          <input
                            id="booking-patient-email"
                            type="email"
                            value={patientEmail}
                            onChange={e => setPatientEmail(e.target.value)}
                            placeholder="eleanor@gmail.com"
                            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#16213A] border border-[#E0E4DF] dark:border-[#4E6C5D] text-sm text-[#101512] dark:text-[#EAEFEA] focus-visible:outline-none"
                          />
                          {errors.email && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
                        </div>

                        <div>
                          <label htmlFor="booking-patient-phone" className="block text-xs font-bold uppercase tracking-wider text-[#101512] dark:text-[#EAEFEA] mb-1.5">
                            Phone Number <span className="text-[#173F30] dark:text-[#A9C2B2]">*</span>
                          </label>
                          <input
                            id="booking-patient-phone"
                            type="tel"
                            value={patientPhone}
                            onChange={e => setPatientPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#16213A] border border-[#E0E4DF] dark:border-[#4E6C5D] text-sm text-[#101512] dark:text-[#EAEFEA] focus-visible:outline-none"
                          />
                          {errors.phone && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="booking-notes" className="block text-xs font-bold uppercase tracking-wider text-[#101512] dark:text-[#EAEFEA] mb-1.5">
                          Reason for Visit / Clinical Notes (Optional)
                        </label>
                        <textarea
                          id="booking-notes"
                          rows={3}
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                          placeholder="Briefly describe your symptoms or reason for scheduling..."
                          className="w-full px-4 py-2 rounded-xl bg-white dark:bg-[#16213A] border border-[#E0E4DF] dark:border-[#4E6C5D] text-sm text-[#101512] dark:text-[#EAEFEA] focus-visible:outline-none"
                        />
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#E7EEE8]/60 dark:bg-[#1E2E25]/60 border border-[#E0E4DF] dark:border-[#4E6C5D] text-xs text-[#777D79] dark:text-[#9BAAA0] flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0 mt-0.5" />
                        <span>
                          Your personal and clinical health data is handled strictly in adherence to CarePoint Clinic privacy guidelines. No third-party data sharing.
                        </span>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 4: Confirmation State */}
                {step === 4 && (
                  <motion.div
                    key="step-4"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-center py-6 px-2 space-y-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#E7EEE8] dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2] mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E7EEE8] dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2]">
                        Reference #{bookingRef}
                      </span>
                      <h4 className="text-2xl font-bold text-[#101512] dark:text-[#EAEFEA] mt-2">
                        Appointment Confirmed
                      </h4>
                      <p className="text-sm text-[#777D79] dark:text-[#9BAAA0] max-w-md mx-auto mt-1 leading-relaxed">
                        Thank you, {patientName || "Patient"}. Your consultation has been logged with {selectedDoctor}.
                        An automated SMS confirmation summary has been registered for your arrival.
                      </p>
                    </div>

                    <div className="max-w-md mx-auto p-4 rounded-2xl bg-white dark:bg-[#16213A] border border-[#E0E4DF] dark:border-[#4E6C5D] text-left text-xs space-y-2.5">
                      <div className="flex justify-between py-1 border-b border-[#E0E4DF]/60 dark:border-[#4E6C5D]/40">
                        <span className="text-[#777D79] dark:text-[#9BAAA0]">Physician:</span>
                        <span className="font-semibold text-[#101512] dark:text-[#EAEFEA]">{selectedDoctor}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#E0E4DF]/60 dark:border-[#4E6C5D]/40">
                        <span className="text-[#777D79] dark:text-[#9BAAA0]">Service:</span>
                        <span className="font-semibold text-[#101512] dark:text-[#EAEFEA]">{selectedService} ({currentServiceObj.price})</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-[#E0E4DF]/60 dark:border-[#4E6C5D]/40">
                        <span className="text-[#777D79] dark:text-[#9BAAA0]">Scheduled Date & Time:</span>
                        <span className="font-semibold text-[#101512] dark:text-[#EAEFEA]">{selectedDate} • {selectedTime}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#777D79] dark:text-[#9BAAA0]">Patient Details:</span>
                        <span className="font-semibold text-[#101512] dark:text-[#EAEFEA]">{patientName} ({patientPhone})</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#E0E4DF] dark:border-[#4E6C5D] text-xs font-semibold text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8] dark:hover:bg-[#1E2E25] transition-colors cursor-pointer"
                      >
                        Book Another Visit
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#173F30] text-white dark:bg-[#A9C2B2] dark:text-[#101512] text-xs font-semibold hover:bg-[#123326] dark:hover:bg-[#90AF9B] transition-colors shadow-xs cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT: Live Summary Panel (Steps 1-3) */}
            {step < 4 && (
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#121B16] border border-[#E0E4DF] dark:border-[#4E6C5D] shadow-xs space-y-4 sticky top-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E0E4DF]/60 dark:border-[#4E6C5D]/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#101512] dark:text-[#EAEFEA] flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#173F30] dark:text-[#A9C2B2]" />
                      Live Summary
                    </span>
                    <span className="text-[10px] font-bold text-[#173F30] dark:text-[#A9C2B2] bg-[#E7EEE8] dark:bg-[#1E2E25] px-2 py-0.5 rounded-full">
                      Step {step} of 3
                    </span>
                  </div>

                  {/* Selected Service Card */}
                  <div className="p-3 rounded-2xl bg-[#FAFAF7] dark:bg-[#16213A] border border-[#E0E4DF] dark:border-[#4E6C5D] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E7EEE8] dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2] flex items-center justify-center shrink-0">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#101512] dark:text-[#EAEFEA] truncate">{selectedService}</p>
                      <div className="flex items-center justify-between text-[11px] text-[#777D79] dark:text-[#9BAAA0] mt-0.5">
                        <span>Duration: {currentServiceObj.duration}</span>
                        <span className="font-bold text-[#173F30] dark:text-[#A9C2B2]">{currentServiceObj.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected Doctor Card */}
                  <div className="p-3 rounded-2xl bg-[#FAFAF7] dark:bg-[#16213A] border border-[#E0E4DF] dark:border-[#4E6C5D] flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#E0E4DF] dark:border-[#4E6C5D]">
                      <Image
                        src={currentDoctorObj.image}
                        alt={currentDoctorObj.name}
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#101512] dark:text-[#EAEFEA] truncate">{currentDoctorObj.name}</p>
                      <p className="text-[11px] text-[#777D79] dark:text-[#9BAAA0]">{currentDoctorObj.specialty}</p>
                    </div>
                  </div>

                  {/* Selected Date & Time */}
                  <div className="p-3 rounded-2xl bg-[#FAFAF7] dark:bg-[#16213A] border border-[#E0E4DF] dark:border-[#4E6C5D] space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-[#101512] dark:text-[#EAEFEA]">
                      <Calendar className="w-3.5 h-3.5 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
                      <span className="font-semibold truncate">{selectedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#777D79] dark:text-[#9BAAA0]">
                      <Clock className="w-3.5 h-3.5 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
                      <span>{selectedTime} Arrival Window</span>
                    </div>
                  </div>

                  {/* Patient Info Preview if on step 3 */}
                  {patientName && (
                    <div className="p-3 rounded-2xl bg-[#E7EEE8]/50 dark:bg-[#1E2E25]/50 border border-[#A9C2B2]/30 text-xs text-[#101512] dark:text-[#EAEFEA]">
                      <span className="text-[10px] text-[#777D79] dark:text-[#9BAAA0] uppercase font-bold block">Patient:</span>
                      <p className="font-semibold truncate">{patientName}</p>
                      {patientPhone && <p className="text-[11px] text-[#777D79] dark:text-[#9BAAA0]">{patientPhone}</p>}
                    </div>
                  )}

                  {/* Total Upfront Fee Summary */}
                  <div className="pt-2 border-t border-[#E0E4DF]/60 dark:border-[#4E6C5D]/40 flex items-center justify-between text-xs">
                    <span className="text-[#777D79] dark:text-[#9BAAA0]">Estimated Consultation:</span>
                    <span className="font-bold text-sm text-[#173F30] dark:text-[#A9C2B2]">{currentServiceObj.price}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-[#777D79] dark:text-[#9BAAA0] pt-1">
                    <Lock className="w-3 h-3 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
                    <span>No surprise facility fees • Pay after care</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer Controls (Steps 1 - 3) */}
        {step < 4 && (
          <div className="px-6 py-4 bg-white dark:bg-[#121B16] border-t border-[#E0E4DF] dark:border-[#4E6C5D] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E0E4DF] dark:border-[#4E6C5D] text-xs font-semibold text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8] dark:hover:bg-[#1E2E25] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <span className="text-xs text-[#777D79] dark:text-[#9BAAA0]">CarePoint Outpatient Clinic</span>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as 2 | 3)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#173F30] text-white dark:bg-[#A9C2B2] dark:text-[#101512] text-xs font-semibold hover:bg-[#123326] dark:hover:bg-[#90AF9B] transition-colors shadow-xs cursor-pointer"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#173F30] text-white dark:bg-[#A9C2B2] dark:text-[#101512] text-xs font-semibold hover:bg-[#123326] dark:hover:bg-[#90AF9B] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
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
