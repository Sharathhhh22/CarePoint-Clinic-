"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Stethoscope,
  Heart,
  Baby,
  Brain,
  Activity,
  Video,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  FileText,
  Calendar,
  Sparkles,
} from "lucide-react"
import { openBookingModal } from "@/lib/booking-events"

interface ServiceItem {
  id: string
  name: string
  category: "primary" | "cardio" | "pediatrics" | "neuro" | "diagnostics" | "telehealth"
  icon: any
  leadDoctor: string
  duration: string
  fee: string
  badge: string
  summary: string
  conditions: string[]
  diagnosticTools: string[]
  preparation: string
}

const SERVICES: ServiceItem[] = [
  {
    id: "primary-care",
    name: "Primary Care & Family Medicine",
    category: "primary",
    icon: Stethoscope,
    leadDoctor: "Dr. Sara Khan, MD",
    duration: "30–45 mins",
    fee: "$75",
    badge: "Most Booked",
    summary:
      "Comprehensive outpatient health management for adults and adolescents. Annual physicals, preventive screenings, medication adjustments, and acute symptom evaluation.",
    conditions: ["Hypertension", "Type 2 Diabetes", "Respiratory Infections", "Fatigue", "Annual Health Checkup"],
    diagnosticTools: ["Complete Blood Chemistry", "Urinalysis", "Resting ECG", "Lipid Profile"],
    preparation: "Please bring current medication bottles and previous annual lab results. Fasting 8 hours prior if blood glucose is needed.",
  },
  {
    id: "cardiovascular",
    name: "Cardiovascular Health & Prevention",
    category: "cardio",
    icon: Heart,
    leadDoctor: "Dr. Marcus Vance, MD, FACC",
    duration: "45 mins",
    fee: "$130",
    badge: "Board Certified",
    summary:
      "Specialized cardiac evaluations covering chest discomfort, rhythm abnormalities, palpitations, post-COVID cardiac recovery, and advanced cardiovascular risk stratification.",
    conditions: ["Palpitations & Arrhythmia", "Chest Pressure", "Hyperlipidemia", "Coronary Risk Assessment"],
    diagnosticTools: ["12-Lead Digital ECG", "Echocardiography (Echo)", "24hr Holter Monitoring", "High-Sensitivity Troponin"],
    preparation: "Avoid caffeine, nicotine, and heavy exercise for 4 hours before your cardiac assessment.",
  },
  {
    id: "pediatrics",
    name: "Pediatric & Child Wellness",
    category: "pediatrics",
    icon: Baby,
    leadDoctor: "Dr. Elena Rostova, MD, FAAP",
    duration: "30–45 mins",
    fee: "$90",
    badge: "Family Preferred",
    summary:
      "Gentle, child-centred outpatient consultations. Developmental milestone tracking, immunization schedules, childhood asthma management, and urgent sick child visits.",
    conditions: ["Pediatric Fevers", "Childhood Asthma & Allergies", "Developmental Milestones", "Ear Infections", "School Physicals"],
    diagnosticTools: ["Rapid Strep & Flu Screening", "Pediatric Pulse Oximetry", "Growth Milestone Digitization"],
    preparation: "Bring your child's immunization card and a comfort toy or blanket for younger infants.",
  },
  {
    id: "neurology",
    name: "Neurology & Migraine Clinic",
    category: "neuro",
    icon: Brain,
    leadDoctor: "Dr. Anita Chen, MD, PhD",
    duration: "45–60 mins",
    fee: "$150",
    badge: "Specialist Care",
    summary:
      "Targeted diagnosis and therapeutic plans for chronic migraines, tension headaches, peripheral neuropathy, vestibular dizziness, and cognitive changes.",
    conditions: ["Refractory Migraines", "Tension Headaches", "Dizziness & Vertigo", "Nerve Pain & Tingling", "Tremors"],
    diagnosticTools: ["Cranial Nerve Exam", "Digital Nerve Conduction Screening", "Cognitive Assessment Battery"],
    preparation: "Keep a brief log of headache frequency, triggers, and all over-the-counter medications taken over the last 14 days.",
  },
  {
    id: "diagnostics",
    name: "Digital Ultrasound & Rapid Diagnostics",
    category: "diagnostics",
    icon: Activity,
    leadDoctor: "CarePoint Diagnostic Team",
    duration: "20–30 mins",
    fee: "$65",
    badge: "Same-Day Results",
    summary:
      "On-site diagnostic imaging and certified clinical laboratory testing. Rapid blood chemistry, thyroid panels, abdominal and thyroid ultrasound, and digitized reporting.",
    conditions: ["Thyroid Nodules", "Abdominal Pain", "Metabolic Profiling", "Urinary Tract Infections", "Lipid Screening"],
    diagnosticTools: ["High-Resolution Color Doppler Ultrasound", "Automated Hemogram Analyzer", "Point-of-Care Biomarkers"],
    preparation: "Abdominal ultrasound requires 6-hour fasting; pelvic ultrasound requires drinking 32 oz of water 1 hour before.",
  },
  {
    id: "telehealth",
    name: "HIPAA-Encrypted HD Telehealth",
    category: "telehealth",
    icon: Video,
    leadDoctor: "CarePoint Attending Clinicians",
    duration: "20–30 mins",
    fee: "$55",
    badge: "Instant Connect",
    summary:
      "Secure video consultations from the comfort of home or office. Ideal for medication reviews, lab follow-ups, dermatological rashes, and mild acute symptom triage.",
    conditions: ["Routine Medication Refills", "Lab Result Interpretation", "Minor Skin Irritations", "Seasonal Allergies"],
    diagnosticTools: ["High-Definition Video Link", "Digital Prescription Dispatch to Local Pharmacy", "Secure Patient Chat"],
    preparation: "Test your camera and microphone prior to visit time. Have a quiet, well-lit room ready.",
  },
]

export function ServicesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredServices =
    selectedCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === selectedCategory)

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#173F30]"></span>
              <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#173F30]">
                Our Outpatient Specialties
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101512] tracking-tight leading-[1.1] mb-6">
              Specialized clinical care, <br />
              <span className="text-[#173F30]">seamlessly coordinated.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#777D79] leading-relaxed font-normal">
              From everyday primary health to advanced cardiology and neurology, CarePoint Clinic brings board-certified physicians and rapid on-site diagnostics together under one roof.
            </p>
          </div>

          {/* CATEGORY FILTER TABS */}
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-[#E0E4DF]">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              All Specialties ({SERVICES.length})
            </button>
            <button
              onClick={() => setSelectedCategory("primary")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "primary"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Primary Care
            </button>
            <button
              onClick={() => setSelectedCategory("cardio")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "cardio"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Cardiovascular
            </button>
            <button
              onClick={() => setSelectedCategory("pediatrics")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "pediatrics"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Pediatrics
            </button>
            <button
              onClick={() => setSelectedCategory("neuro")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "neuro"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Neurology
            </button>
            <button
              onClick={() => setSelectedCategory("diagnostics")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "diagnostics"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Diagnostics & Lab
            </button>
            <button
              onClick={() => setSelectedCategory("telehealth")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "telehealth"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Telehealth
            </button>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-16 md:py-24 bg-white border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  className="rounded-3xl bg-[#FAFAF7] border border-[#E0E4DF] p-7 flex flex-col justify-between hover:border-[#173F30]/40 transition-all hover:shadow-lg group"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white text-[#173F30] border border-[#E0E4DF] text-xs font-bold">
                        {service.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#101512] mb-2">{service.name}</h3>
                    <p className="text-xs font-semibold text-[#173F30] mb-3">
                      Led by {service.leadDoctor}
                    </p>
                    <p className="text-sm text-[#777D79] leading-relaxed mb-6">
                      {service.summary}
                    </p>

                    {/* Conditions & diagnostics */}
                    <div className="space-y-4 pt-4 border-t border-[#E0E4DF] mb-6">
                      <div>
                        <p className="text-xs font-bold text-[#101512] mb-2">Frequently Treated:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {service.conditions.map((c, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-white border border-[#E0E4DF] text-[11px] font-medium text-[#777D79]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-[#E0E4DF] text-xs text-[#777D79]">
                        <p className="font-semibold text-[#101512] mb-1 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#173F30]" /> Visit Preparation:
                        </p>
                        <p className="text-[11px] leading-relaxed">{service.preparation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Booking Action */}
                  <div className="pt-6 border-t border-[#E0E4DF] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-[#777D79] uppercase font-bold tracking-wider">
                        Consultation
                      </p>
                      <p className="text-xl font-extrabold text-[#173F30]">
                        {service.fee}{" "}
                        <span className="text-xs font-medium text-[#777D79]">
                          / {service.duration}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => openBookingModal({ service: service.name })}
                      className="inline-flex items-center gap-1.5 bg-[#173F30] hover:bg-[#123326] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-xs active:scale-95"
                    >
                      <span>Book Visit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. PATIENT JOURNEY / WHAT TO EXPECT */}
      <section className="py-20 md:py-28 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#173F30] mb-2">
              The Consultation Experience
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight">
              What to Expect at Your Visit
            </h3>
            <p className="text-base text-[#777D79] mt-3">
              We eliminated the typical healthcare bottlenecks to provide an effortless, transparent patient journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#E0E4DF] shadow-xs relative">
              <span className="w-10 h-10 rounded-full bg-[#E7EEE8] text-[#173F30] font-black text-lg flex items-center justify-center mb-6">
                1
              </span>
              <h4 className="text-xl font-bold text-[#101512] mb-3">On-Time Reception & Vitals</h4>
              <p className="text-sm text-[#777D79] leading-relaxed">
                Step into a quiet, sunlit environment. You are guided to your private suite without waiting hall congestion. A registered nurse records vital signs and initial context.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E0E4DF] shadow-xs relative">
              <span className="w-10 h-10 rounded-full bg-[#E7EEE8] text-[#173F30] font-black text-lg flex items-center justify-center mb-6">
                2
              </span>
              <h4 className="text-xl font-bold text-[#101512] mb-3">In-Depth Doctor Consultation</h4>
              <p className="text-sm text-[#777D79] leading-relaxed">
                Your attending physician reviews your past history, listens to your concerns attentively, conducts thorough examinations, and explains physiological causes in plain English.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#E0E4DF] shadow-xs relative">
              <span className="w-10 h-10 rounded-full bg-[#E7EEE8] text-[#173F30] font-black text-lg flex items-center justify-center mb-6">
                3
              </span>
              <h4 className="text-xl font-bold text-[#101512] mb-3">Instant Plan & Prescriptions</h4>
              <p className="text-sm text-[#777D79] leading-relaxed">
                Receive clear treatment options, digital prescriptions routed directly to your preferred pharmacy, and immediate booking for any follow-up tests or lab requisitions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EMERGENCY TRIAGE ADVISORY */}
      <section className="py-12 bg-[#FFF8F0] border-b border-[#FBE0C6]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E25C3D]/10 text-[#E25C3D] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#101512]">
                Need Emergency or Immediate Acute Care?
              </h4>
              <p className="text-xs text-[#777D79] mt-0.5 max-w-xl">
                CarePoint Clinic is an outpatient clinic. If you are experiencing acute chest pain, severe shortness of breath, sudden weakness, or uncontrolled bleeding, please dial 911 or go to your nearest Emergency Room immediately.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="shrink-0 px-5 py-2.5 rounded-full bg-white border border-[#FBE0C6] text-xs font-bold text-[#101512] hover:bg-[#FAFAF7] transition-all"
          >
            Emergency Guidance & Contact
          </Link>
        </div>
      </section>
    </div>
  )
}
