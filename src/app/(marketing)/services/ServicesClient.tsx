"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Search,
  X,
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
  Printer,
} from "lucide-react"
import { openBookingModal } from "@/lib/booking-events"
import { Skeleton } from "@/components/ui/skeleton"
import { Container } from "@/components/ui/Container"
import { Button } from "@/components/ui/Button"

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

function ServicesGridSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading clinical specialties..."
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-[#FAFAF7] dark:bg-[#121B16] border border-[#E0E4DF] dark:border-[#4E6C5D] p-7 flex flex-col justify-between shadow-xs animate-pulse"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <Skeleton className="w-12 h-12 rounded-2xl bg-[#E7EEE8] dark:bg-[#1E2E25]" />
              <Skeleton className="w-24 h-6 rounded-full bg-[#E0E4DF] dark:bg-[#1E2E25]" />
            </div>
            <Skeleton className="w-48 h-6 rounded-md bg-[#E0E4DF] dark:bg-[#1E2E25] mb-2" />
            <Skeleton className="w-32 h-3.5 rounded-md bg-[#E7EEE8] dark:bg-[#1E2E25] mb-3" />
            <Skeleton className="w-full h-3.5 rounded-md bg-[#E7EEE8] dark:bg-[#1E2E25] mb-2" />
            <Skeleton className="w-4/5 h-3.5 rounded-md bg-[#E7EEE8] dark:bg-[#1E2E25] mb-6" />

            <div className="space-y-4 pt-4 border-t border-[#E0E4DF] dark:border-[#4E6C5D] mb-6">
              <Skeleton className="w-28 h-3 rounded bg-[#E0E4DF] dark:bg-[#1E2E25] mb-2" />
              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="w-20 h-6 rounded-lg bg-[#E7EEE8] dark:bg-[#1E2E25]" />
                <Skeleton className="w-24 h-6 rounded-lg bg-[#E7EEE8] dark:bg-[#1E2E25]" />
                <Skeleton className="w-16 h-6 rounded-lg bg-[#E7EEE8] dark:bg-[#1E2E25]" />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E0E4DF] dark:border-[#4E6C5D] flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="w-16 h-3 rounded bg-[#E0E4DF] dark:bg-[#1E2E25]" />
              <Skeleton className="w-28 h-6 rounded bg-[#E7EEE8] dark:bg-[#1E2E25]" />
            </div>
            <Skeleton className="w-28 h-10 rounded-full bg-[#173F30]/20 dark:bg-[#4E6C5D]/40" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading clinical specialties...</span>
    </div>
  )
}

export function ServicesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleCategoryClick = (cat: string) => {
    if (cat === selectedCategory) return
    setIsLoading(true)
    setSelectedCategory(cat)
    setTimeout(() => {
      setIsLoading(false)
    }, 220)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 180)
  }

  const categoryLabels: Record<string, string> = {
    all: "All Specialties",
    primary: "Primary Care",
    cardio: "Cardiovascular",
    pediatrics: "Pediatrics",
    neuro: "Neurology",
    diagnostics: "Diagnostics & Lab",
    telehealth: "HD Telehealth",
  }

  const filteredServices = React.useMemo(() => {
    return SERVICES.filter((s) => {
      const matchesCategory =
        selectedCategory === "all" || s.category === selectedCategory

      if (!matchesCategory) return false

      if (!searchQuery.trim()) return true

      const q = searchQuery.toLowerCase().trim()
      const matchesName = s.name.toLowerCase().includes(q)
      const matchesSummary = s.summary.toLowerCase().includes(q)
      const matchesDoctor = s.leadDoctor.toLowerCase().includes(q)
      const matchesConditions = s.conditions.some((c) => c.toLowerCase().includes(q))
      const matchesTools = s.diagnosticTools.some((t) => t.toLowerCase().includes(q))

      return matchesName || matchesSummary || matchesDoctor || matchesConditions || matchesTools
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <Container>
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

          {/* SEARCH & CATEGORY FILTER CONTROLS */}
          <div className="mt-10 pt-8 border-t border-[#E0E4DF] dark:border-[#4E6C5D] space-y-6">
            
            {/* Screen Reader Live Region for Announcements */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {`Showing ${filteredServices.length} ${
                filteredServices.length === 1 ? "service" : "services"
              }${searchQuery ? ` matching "${searchQuery}"` : ""}${
                selectedCategory !== "all" ? ` in ${categoryLabels[selectedCategory] || selectedCategory}` : ""
              }`}
            </div>

            {/* Keyword Search Input */}
            <div className="max-w-xl relative">
              <label htmlFor="services-search" className="sr-only">
                Search medical services, symptoms, or diagnostic tests
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#777D79] dark:text-[#9BAAA0] absolute left-3.5 pointer-events-none" />
                <input
                  id="services-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by specialty, symptom (e.g. palpitations, migraine), or test..."
                  className="w-full h-11 pl-10 pr-10 rounded-full border border-[#E0E4DF] dark:border-[#4E6C5D] bg-white dark:bg-[#121B16] text-xs sm:text-sm text-[#101512] dark:text-[#EAEFEA] placeholder:text-[#777D79] dark:placeholder:text-[#6E8076] focus:outline-none focus:ring-2 focus:ring-[#173F30] dark:focus:ring-[#A9C2B2] shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 p-1 rounded-full text-[#777D79] hover:text-[#101512] dark:hover:text-[#FAFAF7] cursor-pointer"
                    aria-label="Clear service search query"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills & Results Counter & Print Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div 
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Filter clinical services by category"
              >
                <button
                  onClick={() => handleCategoryClick("all")}
                  className={`min-h-11 px-4 py-2.5 inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-[#173F30] text-white shadow-xs"
                      : "bg-white dark:bg-[#121B16] text-[#777D79] dark:text-[#9BAAA0] border border-[#E0E4DF] dark:border-[#4E6C5D] hover:text-[#101512] dark:hover:text-[#FAFAF7] hover:bg-[#E7EEE8] dark:hover:bg-[#1B2921]"
                  }`}
                >
                  All Specialties ({SERVICES.length})
                </button>
                <button
                  onClick={() => handleCategoryClick("primary")}
                  className={`min-h-11 px-4 py-2.5 inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === "primary"
                      ? "bg-[#173F30] text-white shadow-xs"
                      : "bg-white dark:bg-[#121B16] text-[#777D79] dark:text-[#9BAAA0] border border-[#E0E4DF] dark:border-[#4E6C5D] hover:text-[#101512] dark:hover:text-[#FAFAF7] hover:bg-[#E7EEE8] dark:hover:bg-[#1B2921]"
                  }`}
                >
                  Primary Care
                </button>
                <button
                  onClick={() => handleCategoryClick("cardio")}
                  className={`min-h-11 px-4 py-2.5 inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === "cardio"
                      ? "bg-[#173F30] text-white shadow-xs"
                      : "bg-white dark:bg-[#121B16] text-[#777D79] dark:text-[#9BAAA0] border border-[#E0E4DF] dark:border-[#4E6C5D] hover:text-[#101512] dark:hover:text-[#FAFAF7] hover:bg-[#E7EEE8] dark:hover:bg-[#1B2921]"
                  }`}
                >
                  Cardiovascular
                </button>
                <button
                  onClick={() => handleCategoryClick("pediatrics")}
                  className={`min-h-11 px-4 py-2.5 inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === "pediatrics"
                      ? "bg-[#173F30] text-white shadow-xs"
                      : "bg-white dark:bg-[#121B16] text-[#777D79] dark:text-[#9BAAA0] border border-[#E0E4DF] dark:border-[#4E6C5D] hover:text-[#101512] dark:hover:text-[#FAFAF7] hover:bg-[#E7EEE8] dark:hover:bg-[#1B2921]"
                  }`}
                >
                  Pediatrics
                </button>
                <button
                  onClick={() => handleCategoryClick("neuro")}
                  className={`min-h-11 px-4 py-2.5 inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === "neuro"
                      ? "bg-[#173F30] text-white shadow-xs"
                      : "bg-white dark:bg-[#121B16] text-[#777D79] dark:text-[#9BAAA0] border border-[#E0E4DF] dark:border-[#4E6C5D] hover:text-[#101512] dark:hover:text-[#FAFAF7] hover:bg-[#E7EEE8] dark:hover:bg-[#1B2921]"
                  }`}
                >
                  Neurology
                </button>
                <button
                  onClick={() => handleCategoryClick("diagnostics")}
                  className={`min-h-11 px-4 py-2.5 inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === "diagnostics"
                      ? "bg-[#173F30] text-white shadow-xs"
                      : "bg-white dark:bg-[#121B16] text-[#777D79] dark:text-[#9BAAA0] border border-[#E0E4DF] dark:border-[#4E6C5D] hover:text-[#101512] dark:hover:text-[#FAFAF7] hover:bg-[#E7EEE8] dark:hover:bg-[#1B2921]"
                  }`}
                >
                  Diagnostics &amp; Lab
                </button>
                <button
                  onClick={() => handleCategoryClick("telehealth")}
                  className={`min-h-11 px-4 py-2.5 inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === "telehealth"
                      ? "bg-[#173F30] text-white shadow-xs"
                      : "bg-white dark:bg-[#121B16] text-[#777D79] dark:text-[#9BAAA0] border border-[#E0E4DF] dark:border-[#4E6C5D] hover:text-[#101512] dark:hover:text-[#FAFAF7] hover:bg-[#E7EEE8] dark:hover:bg-[#1B2921]"
                  }`}
                >
                  Telehealth
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs text-[#777D79] dark:text-[#9BAAA0] font-medium no-print">
                  Showing <strong className="text-[#101512] dark:text-[#EAEFEA]">{filteredServices.length}</strong> of {SERVICES.length} services
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print min-h-11 px-4 py-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#E0E4DF] dark:border-[#4E6C5D] bg-white dark:bg-[#121B16] text-xs font-semibold text-[#173F30] dark:text-[#A9C2B2] hover:bg-[#E7EEE8] dark:hover:bg-[#1B2921] transition-all shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173F30]"
                  title="Print or save this clinical specialties directory as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Directory (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#0E1713] border-b border-[#E0E4DF]/60 dark:border-[#4E6C5D]/60">
        <Container>
          
          {/* PRINT-ONLY OFFICIAL DIRECTORY HEADER */}
          <div className="hidden print:block mb-8 pb-4 border-b-2 border-black">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-black tracking-tight">CarePoint Clinic</h2>
                <p className="text-xs text-gray-700 font-semibold">Official Outpatient Specialties Directory &amp; Schedule of Fees</p>
              </div>
              <div className="text-right text-xs text-gray-700 leading-tight">
                <p className="font-bold">450 Medical Heights Blvd, Suite 300</p>
                <p>Boston, MA 02115 &bull; Tel: (800) 289-CARE</p>
                <p className="text-[10px] text-gray-500 mt-0.5">care@carepointclinic.com &bull; carepointclinic.com</p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <ServicesGridSkeleton />
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#E7EEE8] dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#101512] dark:text-[#EAEFEA]">
                No clinical services found
              </h3>
              <p className="text-xs sm:text-sm text-[#777D79] dark:text-[#9BAAA0] leading-relaxed">
                We couldn&apos;t find any service matching &quot;{searchQuery}&quot; in {categoryLabels[selectedCategory] || selectedCategory}. Try adjusting your keywords or clearing the filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className="px-5 py-2.5 rounded-full bg-[#173F30] hover:bg-[#123326] text-white text-xs font-semibold transition-all shadow-xs"
              >
                Reset Search &amp; View All Services
              </button>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  className="service-card card-grid-item h-full rounded-3xl bg-[#FAFAF7] dark:bg-[#121B16] border border-[#E0E4DF] dark:border-[#4E6C5D] p-7 flex flex-col justify-between hover:border-[#173F30]/40 dark:hover:border-[#A9C2B2]/40 transition-all hover:shadow-lg group"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#E7EEE8] dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white dark:bg-[#1E2E25] text-[#173F30] dark:text-[#A9C2B2] border border-[#E0E4DF] dark:border-[#4E6C5D] text-xs font-bold">
                        {service.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#101512] dark:text-[#EAEFEA] mb-2">{service.name}</h3>
                    <p className="text-xs font-semibold text-[#173F30] dark:text-[#A9C2B2] mb-3">
                      Led by {service.leadDoctor}
                    </p>
                    <p className="text-sm text-[#777D79] dark:text-[#9BAAA0] leading-relaxed mb-6">
                      {service.summary}
                    </p>

                    {/* Conditions & diagnostics */}
                    <div className="space-y-4 pt-4 border-t border-[#E0E4DF] dark:border-[#4E6C5D] mb-6">
                      <div>
                        <p className="text-xs font-bold text-[#101512] dark:text-[#EAEFEA] mb-2">Frequently Treated:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {service.conditions.map((c, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1E2E25] border border-[#E0E4DF] dark:border-[#4E6C5D] text-[11px] font-medium text-[#777D79] dark:text-[#9BAAA0]"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white dark:bg-[#1B2921] border border-[#E0E4DF] dark:border-[#4E6C5D] text-xs text-[#777D79] dark:text-[#9BAAA0]">
                        <p className="font-semibold text-[#101512] dark:text-[#EAEFEA] mb-1 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#173F30] dark:text-[#A9C2B2]" /> Visit Preparation:
                        </p>
                        <p className="text-[11px] leading-relaxed">{service.preparation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Booking Action */}
                  <div className="pt-6 border-t border-[#E0E4DF] dark:border-[#4E6C5D] flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[11px] text-[#777D79] dark:text-[#9BAAA0] uppercase font-bold tracking-wider">
                        Consultation
                      </p>
                      <p className="text-xl font-extrabold text-[#173F30] dark:text-[#A9C2B2]">
                        {service.fee}{" "}
                        <span className="text-xs font-medium text-[#777D79] dark:text-[#9BAAA0]">
                          / {service.duration}
                        </span>
                      </p>
                    </div>

                    <Button
                      onClick={() => openBookingModal({ service: service.name })}
                      variant="primary"
                      size="sm"
                      className="no-print rounded-full shadow-xs active:scale-95"
                    >
                      <span>Book Visit</span>
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                    <p className="hidden print:block text-[11px] font-semibold text-gray-700">
                      Book: (800) 289-CARE
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        </Container>
      </section>

      {/* 3. PATIENT JOURNEY / WHAT TO EXPECT */}
      <section className="py-20 md:py-28 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <Container>
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
              <h4 className="text-xl font-bold text-[#101512] mb-3">On-Time Reception &amp; Vitals</h4>
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
              <h4 className="text-xl font-bold text-[#101512] mb-3">Instant Plan &amp; Prescriptions</h4>
              <p className="text-sm text-[#777D79] leading-relaxed">
                Receive clear treatment options, digital prescriptions routed directly to your preferred pharmacy, and immediate booking for any follow-up tests or lab requisitions.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. EMERGENCY TRIAGE ADVISORY */}
      <section className="py-12 bg-[#FFF8F0] border-b border-[#FBE0C6]">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-6">
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

          <Button asChild variant="outline" size="sm" className="shrink-0 rounded-full bg-white border-[#FBE0C6] text-[#101512] hover:bg-[#FAFAF7]">
            <Link href="/contact">
              <span>Emergency Guidance &amp; Contact</span>
            </Link>
          </Button>
        </Container>
      </section>
    </div>
  )
}
