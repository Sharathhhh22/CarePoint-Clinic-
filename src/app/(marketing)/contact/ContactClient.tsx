"use client"

import React, { useState, useEffect } from "react"
import {
  Mail,
  MapPin,
  Phone,
  CheckCircle2,
  Loader2,
  Clock,
  MessageCircle,
  ShieldAlert,
  ArrowRight,
  Car,
  Navigation,
  ExternalLink,
} from "lucide-react"
import { openBookingModal } from "@/lib/booking-events"
import { getStoredUtmParams } from "@/components/common/UtmTracker"
import { Button, ButtonGroup } from "@/components/ui/Button"

export function ContactClient() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "General Consultation",
    urgency: "Routine (Within 48h)",
    message: "",
    hp_field: "",
  })

  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [confirmationToken, setConfirmationToken] = useState("")
  const [isOpenNow, setIsOpenNow] = useState(true)

  useEffect(() => {
    // Check if open (Mon-Sat 8:00 - 19:00)
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()
    const isOpen = day >= 1 && day <= 6 && hour >= 8 && hour < 19
    setIsOpenNow(isOpen)
  }, [])

  const validate = () => {
    const errors: Record<string, string> = {}
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required"
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required for appointment confirmations"
    } else if (!/^[0-9+()\s-]{7,20}$/.test(formData.phone.trim())) {
      errors.phone = "Please enter a valid telephone number"
    }

    if (!formData.message.trim()) {
      errors.message = "Please describe your reason for enquiry or symptoms"
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long"
    }

    return errors
  }

  const errors = validate()
  const isValid = Object.keys(errors).length === 0

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      firstName: true,
      email: true,
      phone: true,
      message: true,
    })

    if (!isValid) {
      setErrorMsg("Please correct the highlighted fields before submitting.")
      setStatus("error")
      return
    }

    setStatus("sending")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, utm: getStoredUtmParams() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry.")
      }

      // Generate a mock reference token
      const randomToken = "CP-ENQ-" + Math.floor(10000 + Math.random() * 90000)
      setConfirmationToken(randomToken)
      setStatus("success")
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected network error occurred. Please try again.")
      setStatus("error")
    }
  }

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "General Consultation",
      urgency: "Routine (Within 48h)",
      message: "",
      hp_field: "",
    })
    setTouched({})
    setStatus("idle")
    setErrorMsg("")
  }

  return (
    <div className="w-full">
      {/* 1. EMERGENCY CALLOUT */}
      <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-[#FFF8F0] border border-[#FBE0C6] flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-[#E25C3D] shrink-0 mt-0.5" />
        <div className="text-xs text-[#777D79] leading-relaxed">
          <p className="font-bold text-[#101512] text-sm mb-0.5">
            Important Medical Notice: Non-Emergency Enquiries Only
          </p>
          This communication channel is monitored during business hours for non-urgent appointments and medical enquiries. If you are experiencing acute chest discomfort, shortness of breath, sudden numbness, or a medical crisis, please call <strong>911</strong> or go to the nearest emergency department immediately.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: CONTACT DETAILS & CLINIC INFO */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpenNow ? "bg-[#25D366] animate-pulse" : "bg-[#777D79]"
                }`}
              ></span>
              <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#173F30]">
                {isOpenNow ? "Clinic Open for Consultations" : "Clinic Currently Closed (Opens 8 AM)"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#101512] tracking-tight">
              We are here to support your health journey.
            </h2>
            <p className="text-sm text-[#777D79] mt-3 leading-relaxed">
              Have a question about scheduling, specialist consultations, insurance billing, or diagnostic lab tests? Reach our clinical team directly.
            </p>
          </div>

          {/* CONTACT INFO CARDS */}
          <div className="space-y-4">
            {/* Phone */}
            <div className="p-5 rounded-2xl bg-white border border-[#E0E4DF] flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#777D79]">
                  Call Clinic Directly
                </p>
                <a
                  href="tel:+18002892273"
                  className="text-base font-bold text-[#173F30] hover:underline"
                >
                  +1 (800) 289-2273
                </a>
                <p className="text-xs text-[#777D79] mt-0.5">
                  Mon – Sat, 8:00 AM – 7:00 PM EST
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="p-5 rounded-2xl bg-white border border-[#E0E4DF] flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#777D79]">
                  Email Patient Support
                </p>
                <a
                  href="mailto:care@carepointclinic.com"
                  className="text-base font-bold text-[#173F30] hover:underline"
                >
                  care@carepointclinic.com
                </a>
                <p className="text-xs text-[#777D79] mt-0.5">
                  Average response time: under 4 business hours
                </p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="p-5 rounded-2xl bg-[#E7EEE8]/70 border border-[#A9C2B2]/60 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#101512]">
                    WhatsApp Direct Enquiry
                  </p>
                  <p className="text-xs text-[#777D79] mt-0.5">
                    Fast chat with our patient care coordinator
                  </p>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                className="shrink-0 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-xs"
              >
                <a
                  href="https://wa.me/18002892273?text=Hi%20CarePoint%20Clinic,%20I%20would%20like%20to%20enquire%20about%20a%20consultation."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Chat</span>
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </Button>
            </div>

            {/* Address & Parking */}
            <div className="p-5 rounded-2xl bg-white border border-[#E0E4DF] space-y-3 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#777D79]">
                    Clinic Address
                  </p>
                  <p className="text-sm font-bold text-[#101512]">CarePoint Clinic</p>
                  <p className="text-xs text-[#777D79]">
                    450 Medical Heights Blvd, Suite 300, Boston, MA 02115
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E0E4DF] text-xs text-[#777D79] space-y-1.5">
                <div className="flex items-center gap-2">
                  <Car className="w-3.5 h-3.5 text-[#173F30]" />
                  <span>Complimentary 2-hr validated parking in East Medical Garage.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-[#173F30]" />
                  <span>Subway: Green Line &quot;E&quot; Branch to Medical Center Station.</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=450+Medical+Heights+Blvd+Boston+MA+02115"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173F30] hover:underline pt-1"
              >
                <span>Open in Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE FORM */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E0E4DF] shadow-md">
          {status === "success" ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#E7EEE8] text-[#173F30] text-xs font-bold">
                  Reference Token: {confirmationToken}
                </span>
                <h3 className="text-2xl font-extrabold text-[#101512] tracking-tight">
                  Enquiry Received Successfully!
                </h3>
                <p className="text-sm text-[#777D79] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.firstName}</strong>. Our clinical coordinator has received your message regarding <strong>{formData.department}</strong> and will follow up with you at <strong>{formData.email}</strong> within 4 business hours.
                </p>
              </div>

              <ButtonGroup className="pt-6 w-full sm:w-auto">
                <Button
                  onClick={() => openBookingModal({ service: formData.department })}
                  variant="primary"
                  size="md"
                  className="rounded-full shadow-xs"
                >
                  <span>Schedule Appointment Directly</span>
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="md"
                  className="rounded-full"
                >
                  <span>Send Another Message</span>
                </Button>
              </ButtonGroup>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-[#101512] tracking-tight">
                  Send a Consultation Enquiry
                </h3>
                <p className="text-xs text-[#777D79] mt-1">
                  Fill in your details below. All clinical submissions are protected under strict patient confidentiality standards.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMsg}
                </div>
              )}

              {/* Anti-bot Honeypot Input (Invisible to humans, catches automated crawlers) */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="hp_field">Please leave this field empty</label>
                <input
                  id="hp_field"
                  type="text"
                  name="hp_field"
                  value={formData.hp_field}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-first-name" className="text-xs font-bold text-[#101512]">
                    First Name <span className="text-[#E25C3D]">*</span>
                  </label>
                  <input
                    id="contact-first-name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("firstName")}
                    placeholder="e.g. Sarah"
                    className={`w-full h-11 px-3.5 rounded-xl border bg-[#FAFAF7] text-sm text-[#101512] focus:outline-none focus:ring-2 focus:ring-[#173F30] ${
                      touched.firstName && errors.firstName
                        ? "border-red-400 bg-red-50/30"
                        : "border-[#E0E4DF]"
                    }`}
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-last-name" className="text-xs font-bold text-[#101512]">Last Name</label>
                  <input
                    id="contact-last-name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Jenkins"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E0E4DF] bg-[#FAFAF7] text-sm text-[#101512] focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-[#101512]">
                    Email Address <span className="text-[#E25C3D]">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    placeholder="sarah.jenkins@gmail.com"
                    className={`w-full h-11 px-3.5 rounded-xl border bg-[#FAFAF7] text-sm text-[#101512] focus:outline-none focus:ring-2 focus:ring-[#173F30] ${
                      touched.email && errors.email
                        ? "border-red-400 bg-red-50/30"
                        : "border-[#E0E4DF]"
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-phone" className="text-xs font-bold text-[#101512]">
                    Phone Number <span className="text-[#E25C3D]">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full h-11 px-3.5 rounded-xl border bg-[#FAFAF7] text-sm text-[#101512] focus:outline-none focus:ring-2 focus:ring-[#173F30] ${
                      touched.phone && errors.phone
                        ? "border-red-400 bg-red-50/30"
                        : "border-[#E0E4DF]"
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Department & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-department" className="text-xs font-bold text-[#101512]">
                    Relevant Specialty / Department
                  </label>
                  <select
                    id="contact-department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E0E4DF] bg-[#FAFAF7] text-xs font-semibold text-[#101512] focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  >
                    <option value="Primary Care & Family Medicine">Primary Care & Family Medicine</option>
                    <option value="Cardiovascular Health">Cardiovascular Health</option>
                    <option value="Pediatrics & Child Care">Pediatrics & Child Care</option>
                    <option value="Neurology & Migraine">Neurology & Migraine</option>
                    <option value="Diagnostic Ultrasound & Lab">Diagnostic Ultrasound & Lab</option>
                    <option value="Telehealth Consultation">Telehealth Consultation</option>
                    <option value="General Question / Billing">General Question / Billing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-urgency" className="text-xs font-bold text-[#101512]">Urgency of Request</label>
                  <select
                    id="contact-urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E0E4DF] bg-[#FAFAF7] text-xs font-semibold text-[#101512] focus:outline-none focus:ring-2 focus:ring-[#173F30]"
                  >
                    <option value="Routine (Within 48h)">Routine (Within 48h)</option>
                    <option value="Priority (Within 24h)">Priority (Within 24h)</option>
                    <option value="Same-Day Callback Needed">Same-Day Callback Needed</option>
                  </select>
                </div>
              </div>

              {/* Message textarea */}
              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-bold text-[#101512]">
                  How can we help? (Symptoms or Details) <span className="text-[#E25C3D]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur("message")}
                  placeholder="Please describe your health query or any specific appointment preferences..."
                  className={`w-full p-3.5 rounded-xl border bg-[#FAFAF7] text-xs text-[#101512] focus:outline-none focus:ring-2 focus:ring-[#173F30] resize-none ${
                    touched.message && errors.message
                      ? "border-red-400 bg-red-50/30"
                      : "border-[#E0E4DF]"
                  }`}
                />
                {touched.message && errors.message && (
                  <p className="text-[11px] text-red-600 font-medium">{errors.message}</p>
                )}
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={status === "sending"}
                className="rounded-full shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    <span>Transmitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Consultation Enquiry</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
