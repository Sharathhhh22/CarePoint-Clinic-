"use client"

import React, { useEffect } from "react"
import Image from "next/image"
import { 
  X, 
  ArrowRight, 
  Calendar, 
  GraduationCap, 
  Award, 
  Languages, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Quote,
  Stethoscope
} from "lucide-react"

export interface DoctorBioData {
  id: string
  name: string
  title: string
  specialty: string
  image: string
  availability: string
  philosophy: string
  education: string[]
  certifications: string[]
  languages: string[]
  clinicalFocus: string[]
  insurances: string[]
}

export const DOCTORS_BIO_DATA: Record<string, DoctorBioData> = {
  "Dr. Sara Khan": {
    id: "dr-sara-khan",
    name: "Dr. Sara Khan",
    title: "MD, FACC",
    specialty: "Cardiology & Vascular Health",
    image: "/images/carenova/dr-sara-khan.jpg",
    availability: "Mon, Wed, Fri",
    philosophy: "Preventing cardiac events starts with early risk identification, active listening, and collaborative lifestyle medicine that fits into everyday life.",
    education: [
      "Johns Hopkins University School of Medicine (Doctor of Medicine, MD)",
      "Massachusetts General Hospital (Cardiovascular Disease Fellowship)",
      "Brigham and Women's Hospital (Internal Medicine Residency)"
    ],
    certifications: [
      "American Board of Internal Medicine — Cardiovascular Disease",
      "Fellow of the American College of Cardiology (FACC)",
      "National Board of Echocardiography (Diplomate)"
    ],
    languages: ["English", "Urdu", "Hindi"],
    clinicalFocus: [
      "Preventive Cardiovascular Screening",
      "Hypertension & Lipid Optimization",
      "Coronary Artery Health & Stress Testing",
      "Heart Rhythm Monitoring (ECG Review)",
      "Women's Heart Health"
    ],
    insurances: [
      "Blue Cross Blue Shield",
      "Aetna",
      "Cigna",
      "UnitedHealthcare",
      "Medicare",
      "CarePoint Direct Self-Pay"
    ]
  },
  "Dr. Marcus Vance": {
    id: "dr-marcus-vance",
    name: "Dr. Marcus Vance",
    title: "MD, FAAFP",
    specialty: "Family Medicine & Primary Care",
    image: "/images/carenova/dr-marcus-vance.jpg",
    availability: "Tue, Thu, Sat",
    philosophy: "Comprehensive family medicine means treating the whole individual. We take the time to map preventive roadmaps before acute concerns arise.",
    education: [
      "University of Michigan Medical School (Doctor of Medicine, MD)",
      "Northwestern Memorial Hospital (Family Medicine Residency)",
      "University of Michigan (B.S. in Cellular & Molecular Biology)"
    ],
    certifications: [
      "American Board of Family Medicine (Board Certified)",
      "Fellow of the American Academy of Family Physicians (FAAFP)",
      "Certified in Primary Care Ultrasonography"
    ],
    languages: ["English", "Spanish"],
    clinicalFocus: [
      "Annual Executive Health Screenings",
      "Metabolic Wellness & Type 2 Diabetes Management",
      "Preventive Lifestyle Medicine",
      "Immunizations & Travel Medicine",
      "Cardiometabolic Risk Profiling"
    ],
    insurances: [
      "Blue Cross Blue Shield",
      "Aetna",
      "Cigna",
      "Humana",
      "Medicare",
      "CarePoint Direct Self-Pay"
    ]
  },
  "Dr. Elena Rostova": {
    id: "dr-elena-rostova",
    name: "Dr. Elena Rostova",
    title: "MD, FACP",
    specialty: "Internal Medicine & Diagnostics",
    image: "/images/carenova/dr-elena-rostova.jpg",
    availability: "Mon – Thu",
    philosophy: "Complex adult health requires meticulous diagnostic investigation, thorough biomarker evaluations, and open, unhurried patient communication.",
    education: [
      "Columbia University Vagelos College of Physicians and Surgeons (MD)",
      "NewYork-Presbyterian Hospital (Internal Medicine Residency)",
      "Harvard T.H. Chan School of Public Health (Master of Public Health)"
    ],
    certifications: [
      "American Board of Internal Medicine (Board Certified)",
      "Fellow of the American College of Physicians (FACP)",
      "Advanced Clinical Diagnostic Excellence Award"
    ],
    languages: ["English", "Russian", "German"],
    clinicalFocus: [
      "Complex Diagnostic Evaluations",
      "Endocrine & Thyroid Health",
      "Gastrointestinal Function & Nutrition",
      "Fatigue & Micronutrient Optimization",
      "Chronic Disease Continuity Care"
    ],
    insurances: [
      "Blue Cross Blue Shield",
      "Aetna",
      "Oxford Health Plans",
      "UnitedHealthcare",
      "Medicare",
      "CarePoint Direct Self-Pay"
    ]
  },
  "Dr. Anita Chen": {
    id: "dr-anita-chen",
    name: "Dr. Anita Chen",
    title: "MD, FAAP",
    specialty: "Pediatrics & Child Wellness",
    image: "/images/carenova/dr-anita-chen.jpg",
    availability: "Wed, Fri, Sat",
    philosophy: "We strive to create a warm, reassuring environment where children feel completely safe and parents feel fully supported, heard, and empowered.",
    education: [
      "Stanford University School of Medicine (Doctor of Medicine, MD)",
      "Boston Children's Hospital (Pediatric Residency)",
      "University of California, Berkeley (B.A. in Molecular Biology)"
    ],
    certifications: [
      "American Board of Pediatrics (Board Certified)",
      "Fellow of the American Academy of Pediatrics (FAAP)",
      "Pediatric Advanced Life Support (PALS Certified)"
    ],
    languages: ["English", "Mandarin Chinese"],
    clinicalFocus: [
      "Infant & Child Developmental Milestones",
      "Pediatric Nutrition & Growth Tracking",
      "Childhood Asthma & Allergies",
      "Adolescent Preventative Care",
      "Vaccination Guidance & Well-Child Visits"
    ],
    insurances: [
      "Blue Cross Blue Shield",
      "Aetna",
      "Cigna",
      "UnitedHealthcare",
      "Medicaid / CHIP",
      "CarePoint Direct Self-Pay"
    ]
  }
}

interface CarePointDoctorBioModalProps {
  doctorName?: string
  isOpen: boolean
  onClose: () => void
  onBookDoctor?: (doctorName: string) => void
}

export function CarePointDoctorBioModal({
  doctorName,
  isOpen,
  onClose,
  onBookDoctor
}: CarePointDoctorBioModalProps) {
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

  if (!isOpen || !doctorName) return null

  const doctor = DOCTORS_BIO_DATA[doctorName] || DOCTORS_BIO_DATA["Dr. Sara Khan"]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#101512]/65 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`${doctor.name} Clinical Profile & Credentials`}
    >
      <div
        className="w-full max-w-3xl bg-[#FAFAF7] rounded-[28px] sm:rounded-[36px] border border-[#E0E4DF] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E0E4DF] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#173F30]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#777D79]">
              CarePoint Clinic Medical Specialist Profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E7EEE8] text-[#173F30] hover:bg-[#173F30] hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close doctor profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-7">
          
          {/* Top Doctor Showcase */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-5 sm:p-6 rounded-3xl border border-[#E0E4DF] shadow-xs">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-[#E7EEE8]">
              <Image
                src={doctor.image}
                alt={`${doctor.name}, ${doctor.specialty} at CarePoint Clinic`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 120px, 160px"
              />
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E7EEE8] text-[#173F30]">
                  {doctor.title}
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#FAFAF7] text-[#777D79] border border-[#E0E4DF] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#173F30]" />
                  <span>Available: {doctor.availability}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#101512] leading-tight mb-1">
                {doctor.name}
              </h2>

              <p className="text-sm font-semibold text-[#173F30] mb-3">
                {doctor.specialty}
              </p>

              {/* Languages Spoken */}
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#777D79]">
                <Languages className="w-4 h-4 text-[#173F30] shrink-0" />
                <span>Languages: <strong className="text-[#101512]">{doctor.languages.join(", ")}</strong></span>
              </div>
            </div>
          </div>

          {/* Clinical Philosophy Quote */}
          <div className="p-5 rounded-2xl bg-[#E7EEE8]/70 border border-[#A9C2B2]/40 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-[#173F30] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm text-[#101512] font-medium italic leading-relaxed">
                &ldquo;{doctor.philosophy}&rdquo;
              </p>
              <p className="text-xs font-bold text-[#173F30] mt-1.5 not-italic">
                Care Philosophy — {doctor.name}
              </p>
            </div>
          </div>

          {/* Two-Column Credentials & Focus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Education & Residency */}
            <div className="bg-white p-5 rounded-2xl border border-[#E0E4DF] space-y-3">
              <div className="flex items-center gap-2 text-[#173F30]">
                <GraduationCap className="w-4 h-4" />
                <h3 className="text-sm font-bold text-[#101512]">Education & Training</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#777D79]">
                {doctor.education.map((edu, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A9C2B2] mt-1.5 shrink-0" />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Board Certifications */}
            <div className="bg-white p-5 rounded-2xl border border-[#E0E4DF] space-y-3">
              <div className="flex items-center gap-2 text-[#173F30]">
                <Award className="w-4 h-4" />
                <h3 className="text-sm font-bold text-[#101512]">Board Certifications</h3>
              </div>
              <ul className="space-y-2 text-xs text-[#777D79]">
                {doctor.certifications.map((cert, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#173F30] mt-0.5 shrink-0" />
                    <span className="text-[#101512] font-medium">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clinical Areas of Focus */}
            <div className="bg-white p-5 rounded-2xl border border-[#E0E4DF] space-y-3">
              <div className="flex items-center gap-2 text-[#173F30]">
                <Stethoscope className="w-4 h-4" />
                <h3 className="text-sm font-bold text-[#101512]">Clinical Areas of Focus</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {doctor.clinicalFocus.map((focus, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#E7EEE8] text-[#173F30] font-medium"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </div>

            {/* Accepted Insurance Plans */}
            <div className="bg-white p-5 rounded-2xl border border-[#E0E4DF] space-y-3">
              <div className="flex items-center gap-2 text-[#173F30]">
                <ShieldCheck className="w-4 h-4" />
                <h3 className="text-sm font-bold text-[#101512]">Accepted Insurance</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {doctor.insurances.map((ins, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#FAFAF7] border border-[#E0E4DF] text-[#777D79] font-medium"
                  >
                    {ins}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E0E4DF] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-[#101512]">
              Consultation with {doctor.name}
            </p>
            <p className="text-[11px] text-[#777D79]">
              Unrushed outpatient appointment with complete diagnostic evaluation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full border border-[#E0E4DF] text-xs font-semibold text-[#101512] hover:bg-[#E7EEE8] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                if (onBookDoctor) {
                  onBookDoctor(doctor.name)
                }
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-[#173F30] hover:bg-[#123326] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs hover:shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book with {doctor.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
