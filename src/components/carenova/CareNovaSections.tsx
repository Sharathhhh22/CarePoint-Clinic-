"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Stethoscope, 
  Heart, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Check, 
  ChevronDown, 
  Calendar,
  Sparkles,
  Users,
  Compass,
  FileCheck,
  User,
  Activity,
  HeartPulse,
  Info,
  BadgeCheck
} from "lucide-react"
import { CareNovaBookingModal } from "./CareNovaBookingModal"
import { CarePointDoctorBioModal } from "./CarePointDoctorBioModal"
import { AnimatedStatsCounter } from "@/components/common/AnimatedStatsCounter"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"

function DoctorsGridSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading clinical specialists..."
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="doctor-card bg-white dark:bg-[#121B16] rounded-3xl overflow-hidden border border-[#E0E4DF] dark:border-[#4E6C5D] shadow-xs flex flex-col justify-between animate-pulse"
        >
          <div>
            <div className="relative aspect-[4/4.5] w-full bg-[#E7EEE8] dark:bg-[#1B2921]">
              <div className="absolute top-3 right-3">
                <Skeleton className="w-16 h-5 rounded-full bg-white dark:bg-[#121B16]" />
              </div>
            </div>
            <div className="p-5 space-y-2.5">
              <Skeleton className="w-20 h-3 rounded bg-[#E7EEE8] dark:bg-[#1E2E25]" />
              <Skeleton className="w-36 h-5 rounded bg-[#E0E4DF] dark:bg-[#1E2E25]" />
              <Skeleton className="w-44 h-3 rounded bg-[#E7EEE8] dark:bg-[#1E2E25]" />
              <Skeleton className="w-full h-3 rounded bg-[#E7EEE8] dark:bg-[#1E2E25]" />
              <Skeleton className="w-4/5 h-3 rounded bg-[#E7EEE8] dark:bg-[#1E2E25]" />
            </div>
          </div>
          <div className="p-5 pt-0 space-y-2">
            <Skeleton className="w-full h-9 rounded-full bg-[#E0E4DF] dark:bg-[#1E2E25]" />
            <Skeleton className="w-full h-9 rounded-full bg-[#173F30]/20 dark:bg-[#4E6C5D]/40" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading clinical specialists...</span>
    </div>
  )
}

export function CareNovaSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingService, setBookingService] = useState<string | undefined>()
  const [bookingDoctor, setBookingDoctor] = useState<string | undefined>()
  
  // State for Doctor Bio Drawer & Symptom Matcher
  const [selectedBioDoctor, setSelectedBioDoctor] = useState<string | undefined>()
  const [isBioOpen, setIsBioOpen] = useState(false)
  const [selectedConcernId, setSelectedConcernId] = useState("cardio-palpitations")

  // Interactive UI Features State: Doctor specialty filter and Pricing cycle
  const [activeDoctorSpecialty, setActiveDoctorSpecialty] = useState<string>("All Specialties")
  const [isDoctorsLoading, setIsDoctorsLoading] = useState<boolean>(false)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const handleDoctorSpecialtySelect = (specialty: string) => {
    if (specialty === activeDoctorSpecialty) return
    setIsDoctorsLoading(true)
    setActiveDoctorSpecialty(specialty)
    toast({
      title: "Physicians Filtered",
      description: specialty === "All Specialties" ? "Displaying all clinical departments" : `Showing verified specialists for: ${specialty}`,
      variant: "info",
    })
    setTimeout(() => {
      setIsDoctorsLoading(false)
    }, 220)
  }

  const handleBillingCycleToggle = () => {
    const nextCycle = billingCycle === "monthly" ? "annual" : "monthly"
    setBillingCycle(nextCycle)
    toast({
      title: nextCycle === "annual" ? "Annual Billing Activated" : "Monthly Billing Selected",
      description: nextCycle === "annual" ? "20% discount applied to all concierge care plans" : "Standard monthly outpatient billing rate",
      variant: "success",
    })
  }

  const doctorSpecialties = ["All Specialties", "Cardiology", "Family Medicine", "Internal Medicine", "Pediatrics"]

  const handleOpenDoctorBio = (docName: string) => {
    setSelectedBioDoctor(docName)
    setIsBioOpen(true)
  }

  const handleBookService = (serviceName: string) => {
    setBookingService(serviceName)
    setBookingDoctor(undefined)
    setIsBookingOpen(true)
  }

  const handleBookDoctor = (docName: string) => {
    setBookingDoctor(docName)
    setBookingService(undefined)
    setIsBookingOpen(true)
  }

  const handleOpenGeneralBooking = () => {
    setBookingDoctor(undefined)
    setBookingService(undefined)
    setIsBookingOpen(true)
  }

  const handleSelectConcern = (concernId: string, matchedDoc: string, specialty: string) => {
    setSelectedConcernId(concernId)
    toast({
      title: "Clinical Match Identified",
      description: `Matched with ${matchedDoc} • ${specialty}`,
      variant: "info",
    })
  }

  const services = [
    {
      title: "General Consultation",
      tagline: "Primary Outpatient Care",
      desc: "Thorough health assessments, diagnostic reviews, and holistic guidance for acute or routine medical concerns.",
      duration: "30 min appointment",
      icon: Stethoscope,
      features: [
        "Comprehensive vital assessment",
        "Clinical diagnosis & guidance",
        "Personalized care plan"
      ]
    },
    {
      title: "Preventive Health",
      tagline: "Long-term Wellness Planning",
      desc: "Proactive screening for cardiovascular health, metabolic markers, and preventative lifestyle evaluations.",
      duration: "45 min appointment",
      icon: Heart,
      features: [
        "Cardiovascular screening",
        "Biomarker & lifestyle assessment",
        "Preventive health roadmap"
      ]
    },
    {
      title: "Specialist Consultation",
      tagline: "Dedicated Clinical Expertise",
      desc: "Direct clinical evaluations with certified specialists in cardiology, internal medicine, and pediatrics.",
      duration: "45 min appointment",
      icon: ShieldCheck,
      features: [
        "Specialist examination",
        "In-depth test evaluation",
        "Targeted treatment management"
      ]
    },
    {
      title: "Follow-up Care",
      tagline: "Continuous Recovery & Support",
      desc: "Structured post-consultation monitoring, prescription adjustments, and seamless treatment follow-ups.",
      duration: "20 min appointment",
      icon: Clock,
      features: [
        "Treatment progress review",
        "Medication management",
        "Open clinician Q&A"
      ]
    }
  ]

  const doctors = [
    {
      name: "Dr. Sara Khan",
      specialty: "Cardiology",
      focus: "Preventive cardiology & vascular health",
      image: "/images/carenova/dr-sara-khan.jpg",
      qualification: "MD, Clinical Cardiology Specialist",
      availability: "Mon, Wed, Fri"
    },
    {
      name: "Dr. Marcus Vance",
      specialty: "Family Medicine",
      focus: "Primary care & adolescent wellness",
      image: "/images/carenova/dr-marcus-vance.jpg",
      qualification: "MD, Board-Certified Family Physician",
      availability: "Tue, Thu, Sat"
    },
    {
      name: "Dr. Elena Rostova",
      specialty: "Internal Medicine",
      focus: "Metabolic wellness & diagnostic evaluations",
      image: "/images/carenova/dr-elena-rostova.jpg",
      qualification: "MD, Specialist Physician",
      availability: "Mon – Thu"
    },
    {
      name: "Dr. Anita Chen",
      specialty: "Pediatrics",
      focus: "Child development & infant preventative care",
      image: "/images/carenova/dr-anita-chen.jpg",
      qualification: "MD, FAAP Pediatric Specialist",
      availability: "Wed, Fri, Sat"
    }
  ]

  const filteredDoctors = React.useMemo(() => {
    if (activeDoctorSpecialty === "All Specialties") return doctors
    return doctors.filter(doc => doc.specialty === activeDoctorSpecialty)
  }, [activeDoctorSpecialty, doctors])

  const handleDoctorTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      const nextIndex = (index + 1) % doctorSpecialties.length
      handleDoctorSpecialtySelect(doctorSpecialties[nextIndex])
      document.getElementById(`tab-doc-${nextIndex}`)?.focus()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      const prevIndex = (index - 1 + doctorSpecialties.length) % doctorSpecialties.length
      handleDoctorSpecialtySelect(doctorSpecialties[prevIndex])
      document.getElementById(`tab-doc-${prevIndex}`)?.focus()
    } else if (e.key === "Home") {
      e.preventDefault()
      handleDoctorSpecialtySelect(doctorSpecialties[0])
      document.getElementById(`tab-doc-0`)?.focus()
    } else if (e.key === "End") {
      e.preventDefault()
      const lastIndex = doctorSpecialties.length - 1
      handleDoctorSpecialtySelect(doctorSpecialties[lastIndex])
      document.getElementById(`tab-doc-${lastIndex}`)?.focus()
    }
  }

  const SYMPTOM_CONCERNS = [
    {
      id: "cardio-palpitations",
      label: "Chest Tightness & Palpitations",
      category: "Cardiovascular Health",
      description: "Occasional chest tightness, flutter, elevated resting heart rate, or exertional shortness of breath.",
      matchedDoctor: "Dr. Sara Khan",
      matchedDoctorTitle: "Cardiologist (MD, FACC)",
      doctorImage: "/images/carenova/dr-sara-khan.jpg",
      matchedService: "Specialist Consultation",
      tierPrice: "$130",
      duration: "45 min consultation",
      reason: "Dr. Sara Khan specializes in cardiovascular risk evaluation, resting ECG reviews, and preventative cardiac care to investigate palpitations and discomfort thoroughly.",
      recommendedPlan: "In-depth cardiovascular examination + vital monitoring"
    },
    {
      id: "cardio-hypertension",
      label: "High Blood Pressure & Lipids",
      category: "Cardiovascular Health",
      description: "Persistent elevated home blood pressure readings, cholesterol optimization, or family history of heart disease.",
      matchedDoctor: "Dr. Sara Khan",
      matchedDoctorTitle: "Cardiologist (MD, FACC)",
      doctorImage: "/images/carenova/dr-sara-khan.jpg",
      matchedService: "Specialist Consultation",
      tierPrice: "$130",
      duration: "45 min consultation",
      reason: "Dr. Sara Khan crafts bespoke cardiovascular roadmaps, combining vascular health markers with evidence-based lifestyle medicine.",
      recommendedPlan: "Cardiovascular risk profiling + lipid management plan"
    },
    {
      id: "primary-annual",
      label: "Annual Executive Physical & Bloodwork",
      category: "Preventive Primary Care",
      description: "Proactive annual health checkup, complete metabolic biomarker screening, and long-term vitality planning.",
      matchedDoctor: "Dr. Marcus Vance",
      matchedDoctorTitle: "Family Medicine (MD, FAAFP)",
      doctorImage: "/images/carenova/dr-marcus-vance.jpg",
      matchedService: "Comprehensive Wellness",
      tierPrice: "$195",
      duration: "60 min consultation",
      reason: "Dr. Marcus Vance conducts rigorous whole-person preventive evaluations, metabolic profiling, and personalized health roadmaps.",
      recommendedPlan: "Full systemic physical examination + multi-biomarker review"
    },
    {
      id: "primary-routine",
      label: "Acute Illness, Cough or Prescription Refill",
      category: "General Practice",
      description: "Persistent flu or cold symptoms, respiratory congestion, minor infections, or routine medication adjustments.",
      matchedDoctor: "Dr. Marcus Vance",
      matchedDoctorTitle: "Family Medicine (MD, FAAFP)",
      doctorImage: "/images/carenova/dr-marcus-vance.jpg",
      matchedService: "General Consultation",
      tierPrice: "$75",
      duration: "30 min consultation",
      reason: "Dr. Marcus Vance delivers rapid diagnostic assessments and compassionate outpatient relief for acute ailments and prescription reviews.",
      recommendedPlan: "Thorough vital assessment + acute diagnosis & care plan"
    },
    {
      id: "internal-fatigue",
      label: "Chronic Fatigue, Brain Fog & Metabolism",
      category: "Internal Medicine",
      description: "Unexplained low energy, sluggish metabolism, thyroid fluctuations, or sudden changes in weight.",
      matchedDoctor: "Dr. Elena Rostova",
      matchedDoctorTitle: "Internal Medicine (MD, FACP)",
      doctorImage: "/images/carenova/dr-elena-rostova.jpg",
      matchedService: "Specialist Consultation",
      tierPrice: "$130",
      duration: "45 min consultation",
      reason: "Dr. Elena Rostova excels at complex diagnostic investigations, endocrine balance, and uncovering root clinical causes of chronic exhaustion.",
      recommendedPlan: "Specialist diagnostic review + endocrine panel analysis"
    },
    {
      id: "internal-digestive",
      label: "Digestive Discomfort & Acid Reflux",
      category: "Internal Medicine",
      description: "Persistent gastrointestinal irritation, acid reflux, stomach discomfort, or food sensitivity questions.",
      matchedDoctor: "Dr. Elena Rostova",
      matchedDoctorTitle: "Internal Medicine (MD, FACP)",
      doctorImage: "/images/carenova/dr-elena-rostova.jpg",
      matchedService: "Specialist Consultation",
      tierPrice: "$130",
      duration: "45 min consultation",
      reason: "Dr. Elena Rostova provides structured gastrointestinal reviews, diagnostic assessments, and gut-friendly clinical strategies.",
      recommendedPlan: "Targeted clinical examination + gastrointestinal plan"
    },
    {
      id: "pediatric-fever",
      label: "Child Fever, Cough & Ear Irritation",
      category: "Pediatric Care",
      description: "Sudden childhood fever, ear pain, persistent cough, or infant irritability requiring gentle examination.",
      matchedDoctor: "Dr. Anita Chen",
      matchedDoctorTitle: "Pediatrician (MD, FAAP)",
      doctorImage: "/images/carenova/dr-anita-chen.jpg",
      matchedService: "Specialist Consultation",
      tierPrice: "$130",
      duration: "45 min consultation",
      reason: "Dr. Anita Chen creates an empathetic, comforting clinical space to evaluate and treat acute childhood illnesses with calm guidance for parents.",
      recommendedPlan: "Gentle pediatric assessment + comforting treatment plan"
    },
    {
      id: "pediatric-wellchild",
      label: "Well-Child Checkup & Milestone Tracking",
      category: "Pediatric Care",
      description: "Routine infant growth curves, developmental milestones, adolescent wellness, and vaccination roadmaps.",
      matchedDoctor: "Dr. Anita Chen",
      matchedDoctorTitle: "Pediatrician (MD, FAAP)",
      doctorImage: "/images/carenova/dr-anita-chen.jpg",
      matchedService: "General Consultation",
      tierPrice: "$75",
      duration: "30 min consultation",
      reason: "Dr. Anita Chen partners closely with families to support healthy developmental milestones and immunization schedules with zero pressure.",
      recommendedPlan: "Developmental milestone check + pediatric wellness guidance"
    }
  ]

  const faqs = [
    {
      q: "How do I book an appointment at CarePoint Clinic?",
      a: "You can book directly using the 'Book an Appointment' button on this page. Choose your desired service or doctor, select an available date and time slot, and enter your contact details. Your appointment request is logged and verified with a booking reference."
    },
    {
      q: "Can I reschedule an appointment?",
      a: "Yes. If your schedule changes, simply contact our clinic support at care@carepointclinic.com or call our clinic line with your booking reference at least 4 hours before your slot to select a new convenient time without penalty."
    },
    {
      q: "What should I bring to my visit?",
      a: "Please bring a valid photo ID, any relevant medical history or previous laboratory reports, and a list of any current medications or supplements you take. Arriving 10 minutes early allows for smooth check-in."
    },
    {
      q: "How can I contact the clinic directly?",
      a: "You can reach CarePoint Clinic by email at care@carepointclinic.com or by telephone at +1 (800) 289-2273. Our clinic desk is staffed Monday through Saturday from 8:00 AM to 7:00 PM."
    }
  ]

  const pricingTiers = [
    {
      name: "Primary Consultation",
      price: "$75",
      time: "30 minutes",
      description: "Ideal for routine assessments, minor illness evaluation, or general medical advice.",
      features: [
        "In-person clinical evaluation",
        "Vital signs & medical review",
        "Clear diagnostic recommendations",
        "Digital appointment summary"
      ],
      popular: false
    },
    {
      name: "Specialist Consultation",
      price: "$130",
      time: "45 minutes",
      description: "Dedicated consultation with our cardiology, internal medicine, or pediatric doctors.",
      features: [
        "Focused specialist consultation",
        "Diagnostic & lab review",
        "Tailored care management plan",
        "Dedicated follow-up check-in"
      ],
      popular: true
    },
    {
      name: "Comprehensive Wellness",
      price: "$195",
      time: "60 minutes",
      description: "Thorough multi-system assessment, preventative screening, and lifestyle strategy.",
      features: [
        "Full systemic medical examination",
        "Cardiovascular & metabolic review",
        "Preventative nutrition & lifestyle plan",
        "Direct clinician email access"
      ],
      popular: false
    }
  ]

  return (
    <>
      {/* ======================================================== */}
      {/* SECTION A: OUR APPROACH TO CARE & ANIMATED METRICS       */}
      {/* ======================================================== */}
      <section id="about" className="py-20 md:py-28 bg-[#FAFAF7] dark:bg-[#0D1511] border-t border-[#E0E4DF] dark:border-[#4E6C5D]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* INTERACTIVE FEATURE: Animated Stats Counter */}
          <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121B16] border border-[#E0E4DF] dark:border-[#4E6C5D] shadow-xs">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <AnimatedStatsCounter
                target={15000}
                suffix="+"
                label="Patients Cared For"
                subtext="Outpatient visits since 2020"
              />
              <AnimatedStatsCounter
                target={99.4}
                decimals={1}
                suffix="%"
                label="Patient Satisfaction"
                subtext="Verified post-visit surveys"
              />
              <AnimatedStatsCounter
                target={5}
                prefix="< "
                suffix=" min"
                label="Average Wait Time"
                subtext="Synchronized arrival appointments"
              />
              <AnimatedStatsCounter
                target={100}
                suffix="%"
                label="Board-Certified MDs"
                subtext="Verified hospital credentials"
              />
            </div>
          </div>
          
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173F30] bg-[#E7EEE8] px-3.5 py-1.5 rounded-full inline-block mb-3">
              Our Care Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101512] leading-[1.08] mb-4">
              Thoughtful care, centred on you.
            </h2>
            <p className="text-base sm:text-lg text-[#777D79] leading-relaxed">
              From your first visit to your follow-up, we aim to make every step of your healthcare experience clearer, easier, and more personal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Supporting Clinic Editorial Visual */}
            <div className="lg:col-span-6 rounded-[32px] overflow-hidden shadow-md border border-[#E0E4DF] bg-white flex flex-col">
              <div className="relative aspect-[4/3] w-full bg-[#E7EEE8]">
                <Image
                  src="/images/carenova/clinic-interior.jpg"
                  alt="CarePoint modern, calm clinic consultation rooms"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E0E4DF] bg-white">
                <div>
                  <p className="text-xs font-bold text-[#101512]">Calm, Private Clinical Environments</p>
                  <p className="text-[11px] text-[#777D79] mt-0.5">Designed intentionally to eliminate clinical anxiety and encourage open dialogue.</p>
                </div>
                <Link
                  href="/gallery"
                  className="shrink-0 px-4 py-2 rounded-full bg-[#173F30] hover:bg-[#123326] text-white text-xs font-semibold transition-colors text-center shadow-2xs"
                >
                  View Facility Gallery
                </Link>
              </div>
            </div>

            {/* Editorial Pillars */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E0E4DF] hover:border-[#A9C2B2] transition-colors shadow-2xs">
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center font-bold text-sm shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#101512]">Attentive, Unrushed Consultations</h3>
                </div>
                <p className="text-sm text-[#777D79] leading-relaxed">
                  We schedule generous appointment windows so doctors have the time to listen thoroughly to your history, symptoms, and lifestyle context without pressure.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E0E4DF] hover:border-[#A9C2B2] transition-colors shadow-2xs">
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center font-bold text-sm shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#101512]">Collaborative Healthcare Decisions</h3>
                </div>
                <p className="text-sm text-[#777D79] leading-relaxed">
                  We demystify clinical jargon. You receive transparent explanations of options and partner with your physician to make informed choices.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E0E4DF] hover:border-[#A9C2B2] transition-colors shadow-2xs">
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center font-bold text-sm shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#101512]">Seamless Continuity of Care</h3>
                </div>
                <p className="text-sm text-[#777D79] leading-relaxed">
                  From initial diagnosis through recovery check-ins, your primary physician and specialists coordinate together under one cohesive care standard.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#173F30] hover:underline"
                >
                  <span>Learn more about our clinical standards & medical leadership</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION B: SERVICES                                      */}
      {/* ======================================================== */}
      <section id="services" className="py-20 md:py-28 bg-[#FAFAF7] border-t border-[#E0E4DF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173F30] bg-[#E7EEE8] px-3.5 py-1.5 rounded-full inline-block mb-3">
                Clinical Offerings
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101512] leading-[1.08] mb-3">
                Care for every stage of life.
              </h2>
              <p className="text-base sm:text-lg text-[#777D79] leading-relaxed">
                Focused outpatient clinical consultations grounded in preventive health and evidence-based medicine.
              </p>
            </div>

            <button
              onClick={handleOpenGeneralBooking}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#173F30] hover:text-[#123326] underline-offset-4 hover:underline shrink-0"
            >
              <span>View all available consultation slots</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComp = service.icon
              return (
                <div
                  key={service.title}
                  className="bg-white rounded-3xl p-7 border border-[#E0E4DF] hover:border-[#173F30]/40 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center mb-6 group-hover:bg-[#173F30] group-hover:text-white transition-colors shrink-0">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <span className="text-[11px] font-semibold text-[#A9C2B2] uppercase tracking-wider">
                      {service.tagline}
                    </span>
                    <h3 className="text-xl font-bold text-[#101512] mt-1 mb-2.5">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#777D79] leading-relaxed mb-6">
                      {service.desc}
                    </p>

                    <div className="space-y-2 mb-6 pt-4 border-t border-[#E0E4DF]/60">
                      {service.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs text-[#101512]">
                          <Check className="w-3.5 h-3.5 text-[#173F30] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E0E4DF]">
                    <button
                      onClick={() => handleBookService(service.title)}
                      className="w-full py-2.5 px-4 rounded-full bg-[#E7EEE8] hover:bg-[#173F30] text-[#173F30] hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#E0E4DF] bg-white text-xs font-bold text-[#173F30] hover:bg-[#E7EEE8] transition-colors shadow-2xs"
            >
              <span>Explore All Clinical Specialties & Preparation Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION: SYMPTOM CHECKER & SPECIALIST MATCHING TOOL       */}
      {/* ======================================================== */}
      <section id="symptom-matcher" className="py-20 md:py-28 bg-white border-t border-[#E0E4DF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173F30] bg-[#E7EEE8] px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#173F30]" />
              <span>Clinical Triage & Specialist Matching</span>
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101512] leading-[1.08] mb-3">
              Find the right doctor for your health concern.
            </h2>
            <p className="text-base sm:text-lg text-[#777D79] leading-relaxed">
              Select what you are experiencing or looking for, and our clinical routing guide will match you with the ideal specialist and consultation format.
            </p>
          </div>

          {/* Interactive Two-Column Matcher Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Symptom Concern Selectors */}
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#777D79] mb-4">
                Select Your Primary Health Focus:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SYMPTOM_CONCERNS.map((concern) => {
                  const isSelected = selectedConcernId === concern.id
                  return (
                    <button
                      key={concern.id}
                      onClick={() => handleSelectConcern(concern.id, concern.matchedDoctor, concern.matchedDoctorTitle)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                        isSelected
                          ? "bg-[#173F30] text-white border-[#173F30] shadow-md ring-2 ring-[#173F30]/30 -translate-y-0.5"
                          : "bg-[#FAFAF7] hover:bg-[#E7EEE8]/60 text-[#101512] border-[#E0E4DF] hover:border-[#A9C2B2]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSelected 
                              ? "bg-white/20 text-white" 
                              : "bg-[#E7EEE8] text-[#173F30]"
                          }`}>
                            {concern.category}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#A9C2B2] animate-pulse" />
                          )}
                        </div>

                        <h3 className={`text-sm font-bold leading-tight mb-1 ${
                          isSelected ? "text-white" : "text-[#101512] group-hover:text-[#173F30]"
                        }`}>
                          {concern.label}
                        </h3>

                        <p className={`text-xs line-clamp-2 leading-relaxed ${
                          isSelected ? "text-white/80" : "text-[#777D79]"
                        }`}>
                          {concern.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-current/15 flex items-center justify-between text-[11px]">
                        <span className={isSelected ? "text-white/90 font-medium" : "text-[#173F30] font-semibold"}>
                          Matches {concern.matchedDoctor}
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? "translate-x-0.5" : "group-hover:translate-x-0.5 text-[#777D79]"
                        }`} />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Matched Specialist Recommendation Card (Sticky) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              {(() => {
                const active = SYMPTOM_CONCERNS.find(c => c.id === selectedConcernId) || SYMPTOM_CONCERNS[0]
                return (
                  <div className="bg-[#FAFAF7] rounded-[32px] p-6 sm:p-7 border border-[#E0E4DF] shadow-lg space-y-6">
                    
                    {/* Header: Match Tag */}
                    <div className="flex items-center justify-between pb-4 border-b border-[#E0E4DF]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#173F30]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#173F30]">
                          Recommended Specialist Match
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-[#E0E4DF] text-[#777D79]">
                        {active.duration}
                      </span>
                    </div>

                    {/* Doctor Info Group */}
                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#E0E4DF] shadow-2xs">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#E0E4DF] shrink-0 bg-[#E7EEE8]">
                        <Image
                          src={active.doctorImage}
                          alt={`${active.matchedDoctor} at CarePoint Clinic`}
                          fill
                          className="object-cover object-top"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold text-[#A9C2B2] uppercase tracking-wider">
                          {active.category}
                        </span>
                        <h4 className="text-lg font-bold text-[#101512] truncate">
                          {active.matchedDoctor}
                        </h4>
                        <p className="text-xs text-[#777D79] truncate">
                          {active.matchedDoctorTitle}
                        </p>
                      </div>
                    </div>

                    {/* Why this match? */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E0E4DF] space-y-2">
                      <div className="flex items-center gap-1.5 text-[#173F30] text-xs font-bold uppercase tracking-wider">
                        <Info className="w-3.5 h-3.5" />
                        <span>Clinical Rationale</span>
                      </div>
                      <p className="text-xs text-[#777D79] leading-relaxed">
                        {active.reason}
                      </p>
                    </div>

                    {/* Recommended Consultation Format & Tier */}
                    <div className="p-4 rounded-2xl bg-[#E7EEE8]/60 border border-[#A9C2B2]/40 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold text-[#777D79] uppercase tracking-wider">
                          Consultation Tier
                        </p>
                        <p className="text-sm font-bold text-[#101512]">
                          {active.matchedService}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-[#173F30]">
                          {active.tierPrice}
                        </p>
                        <p className="text-[10px] text-[#777D79]">
                          Transparent rate
                        </p>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="space-y-2.5 pt-1">
                      <button
                        onClick={() => handleBookDoctor(active.matchedDoctor)}
                        className="w-full py-3.5 px-6 rounded-full bg-[#173F30] hover:bg-[#123326] active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book with {active.matchedDoctor.split(" ")[1]}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenDoctorBio(active.matchedDoctor)}
                        className="w-full py-2.5 px-4 rounded-full border border-[#E0E4DF] hover:border-[#173F30]/40 hover:bg-white text-xs font-semibold text-[#101512] flex items-center justify-center gap-2 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#173F30]" />
                        <span>View Specialist Qualifications & Bio</span>
                      </button>
                    </div>

                  </div>
                )
              })()}
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION C: MEET OUR DOCTORS                              */}
      {/* ======================================================== */}
      <section id="doctors" className="py-20 md:py-28 bg-[#FAFAF7] border-t border-[#E0E4DF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173F30] bg-[#E7EEE8] px-3.5 py-1.5 rounded-full inline-block mb-3">
                Clinical Team
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101512] leading-[1.08] mb-3">
                Meet the people behind your care.
              </h2>
              <p className="text-base text-[#777D79] leading-relaxed">
                Our multidisciplinary clinicians combine deep medical training with authentic empathy.
                <span className="block text-xs text-[#777D79]/80 mt-1 italic">
                  * Illustrative demonstration clinical profiles.
                </span>
              </p>
            </div>

            <div className="text-xs text-[#777D79] flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-[#173F30]" />
              <span>All physicians board-certified & credentialed</span>
            </div>
          </div>

          {/* KEYBOARD-ACCESSIBLE TABS */}
          <div className="mb-10">
            <div
              role="tablist"
              aria-label="Filter clinicians by medical specialty"
              className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-white dark:bg-[#121B16] border border-[#E0E4DF] dark:border-[#4E6C5D] w-fit shadow-2xs"
            >
              {doctorSpecialties.map((specialty, idx) => {
                const isSelected = activeDoctorSpecialty === specialty
                return (
                  <button
                    key={specialty}
                    id={`tab-doc-${idx}`}
                    role="tab"
                    aria-selected={isSelected}
                    aria-controls="doctors-tabpanel"
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => handleDoctorSpecialtySelect(specialty)}
                    onKeyDown={(e) => handleDoctorTabKeyDown(e, idx)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173F30] dark:focus-visible:ring-[#A9C2B2] ${
                      isSelected
                        ? "bg-[#173F30] text-white shadow-xs dark:bg-[#1E4D3B] dark:text-[#EAEFEA]"
                        : "text-[#777D79] dark:text-[#9BAAA0] hover:text-[#101512] dark:hover:text-[#FAFAF7] hover:bg-[#E7EEE8] dark:hover:bg-[#1B2921]"
                    }`}
                  >
                    {specialty}
                  </button>
                )
              })}
            </div>
            <p className="sr-only" aria-live="polite">
              {`Showing ${filteredDoctors.length} ${filteredDoctors.length === 1 ? 'specialist' : 'specialists'} in ${activeDoctorSpecialty}`}
            </p>
          </div>

          {isDoctorsLoading ? (
            <DoctorsGridSkeleton />
          ) : (
            <div
              id="doctors-tabpanel"
              role="tabpanel"
              aria-label={`Doctors in ${activeDoctorSpecialty}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.name}
                  className="doctor-card bg-white dark:bg-[#121B16] rounded-3xl overflow-hidden border border-[#E0E4DF] dark:border-[#4E6C5D] hover:border-[#173F30]/40 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    {/* Doctor Portrait - Clickable to open bio */}
                    <div 
                      onClick={() => handleOpenDoctorBio(doc.name)}
                      className="relative aspect-[4/4.5] w-full bg-[#E7EEE8] dark:bg-[#1B2921] overflow-hidden cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`View clinical profile of ${doc.name}`}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleOpenDoctorBio(doc.name) }}
                    >
                      <Image
                        src={doc.image}
                        alt={`${doc.name}, ${doc.specialty} at CarePoint Clinic`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                        className="object-cover object-top group-hover:scale-103 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white dark:bg-[#121B16] px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#173F30] dark:text-[#A9C2B2] border border-[#E0E4DF] dark:border-[#4E6C5D] shadow-xs">
                        {doc.availability}
                      </div>
                    </div>

                    <div className="p-5">
                      <span className="text-xs font-semibold text-[#A9C2B2] uppercase tracking-wider">
                        {doc.specialty}
                      </span>
                      <h3 
                        onClick={() => handleOpenDoctorBio(doc.name)}
                        className="text-lg font-bold text-[#101512] dark:text-[#EAEFEA] mt-0.5 mb-1 hover:text-[#173F30] dark:hover:text-[#A9C2B2] cursor-pointer transition-colors"
                      >
                        {doc.name}
                      </h3>
                      <p className="text-xs text-[#777D79] dark:text-[#9BAAA0] font-medium mb-2">
                        {doc.qualification}
                      </p>
                      <p className="text-xs text-[#777D79] dark:text-[#9BAAA0] leading-relaxed">
                        {doc.focus}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Buttons: Single Primary CTA + Bio Link */}
                  <div className="p-5 pt-0 space-y-2">
                    <button
                      onClick={() => handleBookDoctor(doc.name)}
                      className="no-print w-full h-11 rounded-full bg-[#173F30] hover:bg-[#123326] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-sm cursor-pointer"
                    >
                      <span>Book with {doc.name.split(" ")[1]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenDoctorBio(doc.name)}
                      className="w-full py-1 text-center text-[11px] font-medium text-[#777D79] hover:text-[#173F30] dark:text-[#9BAAA0] dark:hover:text-[#A9C2B2] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <User className="w-3 h-3 text-[#173F30] dark:text-[#A9C2B2]" />
                      <span>View Credentials &amp; Bio</span>
                    </button>
                    <p className="hidden print:block text-[11px] font-semibold text-gray-700 text-center">
                      Appointments: (800) 289-CARE
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#E0E4DF] bg-white text-xs font-bold text-[#173F30] hover:bg-[#E7EEE8] transition-colors shadow-2xs"
            >
              <span>Meet Full Medical Team & Accreditations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION D: PRICING & CARE PLANS                          */}
      {/* ======================================================== */}
      <section id="pricing" className="py-20 md:py-28 bg-[#FAFAF7] border-t border-[#E0E4DF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173F30] bg-[#E7EEE8] px-3.5 py-1.5 rounded-full inline-block mb-3">
              Transparent Fees
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101512] dark:text-[#EAEFEA] leading-[1.08] mb-3">
              Simple, transparent pricing.
            </h2>
            <p className="text-base text-[#777D79] dark:text-[#9BAAA0] leading-relaxed">
              Quality healthcare without hidden billing or surprise facility fees. Clear consultation rates upfront.
            </p>
          </div>

          {/* INTERACTIVE FEATURE: Monthly vs Annual Switch */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-[#101512] dark:text-[#EAEFEA] font-bold" : "text-[#777D79] dark:text-[#9BAAA0]"}`}>
              Monthly Billing
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={billingCycle === "annual"}
              aria-label="Toggle between monthly and annual care plans"
              onClick={handleBillingCycleToggle}
              className="relative w-14 h-8 rounded-full bg-[#E0E4DF] dark:bg-[#1B2921] border border-[#CBD5E1] dark:border-[#4E6C5D] p-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173F30] dark:focus-visible:ring-[#A9C2B2]"
            >
              <span
                className={`block w-6 h-6 rounded-full bg-[#173F30] dark:bg-[#A9C2B2] shadow-sm transform transition-transform duration-200 ${
                  billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${billingCycle === "annual" ? "text-[#101512] dark:text-[#EAEFEA] font-bold" : "text-[#777D79] dark:text-[#9BAAA0]"}`}>
                Annual Care Plan
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#173F30] text-[#A9C2B2] text-[10px] font-black uppercase tracking-wider animate-pulse">
                Save 20%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => {
              const basePriceNum = parseInt(tier.price.replace("$", ""), 10)
              const annualPriceNum = Math.round(basePriceNum * 0.8)
              const displayPrice = billingCycle === "annual" ? `$${annualPriceNum}` : tier.price
              const billingPeriodText = billingCycle === "annual" ? "/ month (annual plan)" : "/ consultation"

              return (
              <div
                key={tier.name}
                className={`rounded-3xl p-8 border transition-all flex flex-col justify-between ${
                  tier.popular
                    ? "bg-white border-[#173F30] shadow-lg ring-2 ring-[#173F30]/10 relative"
                    : "bg-white border-[#E0E4DF] shadow-xs hover:border-[#A9C2B2]"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#173F30] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-[#101512] mb-1">{tier.name}</h3>
                  <p className="text-xs text-[#777D79] mb-4">{tier.time}</p>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-extrabold text-[#173F30] dark:text-[#A9C2B2]">{displayPrice}</span>
                    <span className="text-xs text-[#777D79] dark:text-[#9BAAA0] ml-1">{billingPeriodText}</span>
                  </div>

                  <p className="text-xs text-[#777D79] leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-3 mb-8 pt-4 border-t border-[#E0E4DF]/60">
                    {tier.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-[#101512]">
                        <Check className="w-4 h-4 text-[#173F30] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleBookService(tier.name)}
                  className={`w-full py-3 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    tier.popular
                      ? "bg-[#173F30] text-white hover:bg-[#123326] shadow-xs"
                      : "bg-[#E7EEE8] text-[#173F30] hover:bg-[#173F30] hover:text-white"
                  }`}
                >
                  <span>Select Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#E0E4DF] bg-white text-xs font-bold text-[#173F30] hover:bg-[#E7EEE8] transition-colors shadow-2xs"
            >
              <span>Check Insurance Network Coverage & Complete Fee Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION E: APPOINTMENT CALL TO ACTION                    */}
      {/* ======================================================== */}
      <section className="py-16 md:py-24 bg-[#FAFAF7]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="relative rounded-[36px] bg-[#173F30] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
            {/* Subtle background curved decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#A9C2B2]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E7EEE8]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A9C2B2] bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
                Begin Your Care Journey
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] mb-4 text-white">
                Your health deserves thoughtful care.
              </h2>
              <p className="text-base sm:text-lg text-[#E7EEE8]/90 leading-relaxed mb-8">
                Take the next step towards a more personal healthcare experience.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleOpenGeneralBooking}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#173F30] hover:bg-[#FAFAF7] text-sm font-bold px-8 py-3.5 rounded-full transition-all shadow-md active:scale-[0.98] group"
                >
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#173F30]" />
                </button>

                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-all hover:bg-white/10"
                >
                  <span>Explore All Services</span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-all hover:bg-white/10"
                >
                  <span>Contact & Location</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION F: FREQUENTLY ASKED QUESTIONS                    */}
      {/* ======================================================== */}
      <section id="faq" className="py-20 md:py-28 bg-[#FAFAF7] border-t border-[#E0E4DF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#173F30] bg-[#E7EEE8] px-3.5 py-1.5 rounded-full inline-block mb-3">
                Patient Resources
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#101512] leading-[1.1] mb-4">
                Frequently asked questions.
              </h2>
              <p className="text-base text-[#777D79] leading-relaxed mb-6">
                Have another question or need personalized assistance before your visit? Our reception team is glad to assist you.
              </p>
              
              <div className="p-5 rounded-2xl bg-white border border-[#E0E4DF] space-y-2">
                <p className="text-xs font-bold text-[#101512]">Need direct clinic help?</p>
                <p className="text-xs text-[#777D79]">Email our coordination desk at <span className="text-[#173F30] font-semibold">care@carepointclinic.com</span></p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-[#E0E4DF] bg-white overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#101512] hover:text-[#173F30] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#777D79] transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-[#173F30]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm text-[#777D79] leading-relaxed border-t border-[#E0E4DF]/60 animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

          </div>

        </div>
      </section>

      {/* Appointment Booking Modal */}
      <CareNovaBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={bookingService}
        initialDoctor={bookingDoctor}
      />

      {/* Doctor Credentials & Bio Modal */}
      <CarePointDoctorBioModal
        isOpen={isBioOpen}
        onClose={() => setIsBioOpen(false)}
        doctorName={selectedBioDoctor}
        onBookDoctor={(doc) => {
          setIsBioOpen(false)
          handleBookDoctor(doc)
        }}
      />
    </>
  )
}
