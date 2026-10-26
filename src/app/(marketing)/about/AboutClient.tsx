"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Shield,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Users,
  Building,
  GraduationCap,
} from "lucide-react"
import { openBookingModal } from "@/lib/booking-events"
import { CarePointDoctorBioModal } from "@/components/carenova/CarePointDoctorBioModal"
import { AnimatedStatsCounter } from "@/components/common/AnimatedStatsCounter"
import { Container } from "@/components/ui/Container"
import { Button, ButtonGroup } from "@/components/ui/Button"

const CLINICAL_PILLARS = [
  {
    icon: Clock,
    title: "Unrushed Consultations",
    description:
      "We allocate 30 to 45 minutes for every consultation. Doctors listen thoroughly, review past medical records, and answer every question without haste.",
  },
  {
    icon: Shield,
    title: "Zero-Queue Punctuality",
    description:
      "Our schedule synchronization ensures you are seen at your appointed time. Say goodbye to overcrowded waiting halls and unpredictable clinic delays.",
  },
  {
    icon: Sparkles,
    title: "Rapid In-House Diagnostics",
    description:
      "State-of-the-art pathology and digital imaging equipment on-site provide same-day diagnostic results delivered straight to your secure patient portal.",
  },
  {
    icon: Heart,
    title: "Empathetic Human Care",
    description:
      "Medicine is more than prescriptions. Our attending physicians and nurse practitioners prioritize patient dignity, mental wellbeing, and compassionate support.",
  },
]

const TIMELINE = [
  {
    year: "2020",
    title: "The Founding Insight",
    desc: "Founded by four senior physicians determined to reform the hurried 7-minute outpatient encounter into a dignified, patient-first clinical experience.",
  },
  {
    year: "2022",
    title: "JCAHO Accreditation & Diagnostics Wing",
    desc: "Awarded Joint Commission accreditation and opened our high-resolution digital ultrasound and rapid blood-chemistry diagnostic laboratory.",
  },
  {
    year: "2024",
    title: "Clinical Triage & Telehealth Launch",
    desc: "Introduced our symptom-matching digital triage engine and HIPAA-encrypted HD telehealth suites, connecting patients with specialists seamlessly.",
  },
  {
    year: "2026",
    title: "Excellence in Human-Centred Care",
    desc: "Recognized as a regional benchmark for clinical excellence with 99.4% patient satisfaction and zero average waiting times.",
  },
]

const PHYSICIANS = [
  {
    name: "Dr. Sara Khan, MD",
    role: "Lead Family Medicine & Wellness",
    degrees: "Harvard Medical School &bull; 14 Yrs Experience",
    image: "/images/carenova/dr-sara-khan.jpg",
    focus: "Preventive health, hypertension, adult wellness",
  },
  {
    name: "Dr. Marcus Vance, MD, FACC",
    role: "Senior Consultant Cardiologist",
    degrees: "Johns Hopkins &bull; Board Certified Cardiology",
    image: "/images/carenova/dr-marcus-vance.jpg",
    focus: "Echocardiography, preventative cardiology, lipid management",
  },
  {
    name: "Dr. Elena Rostova, MD, FAAP",
    role: "Chief of Pediatric Medicine",
    degrees: "Stanford Medicine &bull; Pediatric Specialist",
    image: "/images/carenova/dr-elena-rostova.jpg",
    focus: "Child development, adolescent medicine, allergy care",
  },
  {
    name: "Dr. Anita Chen, MD, PhD",
    role: "Neurologist & Head Pain Specialist",
    degrees: "Columbia University &bull; Neurology Fellowship",
    image: "/images/carenova/dr-anita-chen.jpg",
    focus: "Migraine management, cognitive neurology, nerve diagnostics",
  },
]

export function AboutClient() {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#173F30]"></span>
              <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#173F30]">
                Our Mission &amp; Brand Story
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101512] tracking-tight leading-[1.1] mb-6">
              Healthcare built around people, <br />
              <span className="text-[#173F30]">not crowded queues.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#777D79] leading-relaxed font-normal">
              At CarePoint Clinic, we believe clinical outpatient care should be unhurried, transparent, and profoundly human. We replaced ambiguous schedules with verified punctuality, modern diagnostic facilities, and compassionate doctors who listen.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-10 border-t border-[#E0E4DF]">
            <div className="p-4 rounded-2xl bg-white border border-[#E0E4DF] shadow-xs">
              <p className="text-3xl font-extrabold text-[#173F30]">35 min</p>
              <p className="text-xs font-medium text-[#777D79] mt-1">Avg. Consultation Time</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E0E4DF] shadow-xs">
              <p className="text-3xl font-extrabold text-[#173F30]">&lt; 5 min</p>
              <p className="text-xs font-medium text-[#777D79] mt-1">Average Wait Time</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E0E4DF] shadow-xs">
              <p className="text-3xl font-extrabold text-[#173F30]">100%</p>
              <p className="text-xs font-medium text-[#777D79] mt-1">Board Certified MDs</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E0E4DF] shadow-xs">
              <p className="text-3xl font-extrabold text-[#173F30]">99.4%</p>
              <p className="text-xs font-medium text-[#777D79] mt-1">Patient Satisfaction</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. OUR PHILOSOPHY & CLINICAL PILLARS */}
      <section className="py-20 md:py-28 bg-white border-b border-[#E0E4DF]/60">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#173F30] mb-3">
              The Four Standards
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight">
              A Higher Standard of Outpatient Medicine
            </h3>
            <p className="text-base text-[#777D79] mt-4">
              Everything in our clinic, from architecture to scheduling software, is designed to eliminate friction and foster genuine healing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLINICAL_PILLARS.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="card-grid-item h-full p-7 rounded-2xl bg-[#FAFAF7] border border-[#E0E4DF] flex flex-col justify-between hover:border-[#173F30]/40 transition-all hover:shadow-md group"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-[#101512] mb-2">{item.title}</h4>
                    <p className="text-sm text-[#777D79] leading-relaxed">{item.description}</p>
                  </div>
                  <div className="pt-6 flex items-center gap-1.5 text-xs font-semibold text-[#173F30]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CarePoint Guarantee</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* 3. CLINICAL TEAM SHOWCASE */}
      <section className="py-20 md:py-28 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#173F30] mb-2">
                Medical Leadership
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight">
                Led by Seasoned Physicians
              </h3>
              <p className="text-base text-[#777D79] mt-3 max-w-xl">
                Every physician at CarePoint Clinic holds active board certification, university faculty appointments, and extensive clinical practice experience.
              </p>
            </div>
            <Button
              onClick={() => openBookingModal()}
              variant="primary"
              size="sm"
              className="rounded-full shadow-xs self-start md:self-auto"
            >
              <span>Book with a Specialist</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PHYSICIANS.map((doc, idx) => (
              <div
                key={idx}
                className="card-grid-item h-full bg-white rounded-2xl border border-[#E0E4DF] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 w-full bg-[#E7EEE8] overflow-hidden">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-base font-bold text-[#101512]">{doc.name}</h4>
                    <p className="text-xs font-semibold text-[#173F30] mt-0.5">{doc.role}</p>
                    <p
                      className="text-xs text-[#777D79] mt-2 font-medium"
                      dangerouslySetInnerHTML={{ __html: doc.degrees }}
                    />
                    <p className="text-xs text-[#777D79] mt-2 leading-relaxed border-t border-[#E0E4DF] pt-3">
                      <span className="font-semibold text-[#101512]">Clinical Focus: </span>
                      {doc.focus}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 mt-auto">
                  <Button
                    onClick={() => setSelectedDoctor(doc.name)}
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="rounded-xl border-[#E0E4DF] text-[#173F30] hover:bg-[#E7EEE8]"
                  >
                    <GraduationCap className="size-4" aria-hidden="true" />
                    <span>View Credentials &amp; Bio</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. CLINIC MILESTONES & JOURNEY */}
      <section className="py-20 md:py-28 bg-white border-b border-[#E0E4DF]/60">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#173F30] mb-2">
              Our Journey
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight">
              Milestones in Patient-First Medicine
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {TIMELINE.map((step, idx) => (
              <div
                key={idx}
                className="relative flex flex-col p-6 rounded-2xl bg-[#FAFAF7] border border-[#E0E4DF]"
              >
                <span className="text-3xl font-black text-[#A9C2B2] mb-3">{step.year}</span>
                <h4 className="text-base font-bold text-[#101512] mb-2">{step.title}</h4>
                <p className="text-xs text-[#777D79] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. FACILITY & ACCREDITATION STANDARDS */}
      <section className="py-20 bg-[#FAFAF7]">
        <Container>
          <div className="bg-[#173F30] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-[#A9C2B2]" />
                <span className="text-xs uppercase tracking-[0.16em] font-bold text-white/90">
                  Accreditation &amp; Safety Standards
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                Clinical safety without compromise.
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8">
                CarePoint Clinic operates under strict JCAHO guidelines with medical-grade HEPA air filtration, digitized electronic health records (HIPAA Grade 256-bit AES encryption), and daily sterile protocol audits.
              </p>

              <ButtonGroup>
                <Button
                  onClick={() => openBookingModal()}
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto rounded-full bg-white text-[#173F30] hover:bg-[#FAFAF7] shadow-md font-bold"
                >
                  <span>Book an In-Person Consultation</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Link href="/gallery">
                    <span>Explore Clinic Facilities</span>
                  </Link>
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </Container>
      </section>

      {/* DOCTOR BIO MODAL */}
      {selectedDoctor && (
        <CarePointDoctorBioModal
          isOpen={true}
          onClose={() => setSelectedDoctor(null)}
          doctorName={selectedDoctor}
          onBookDoctor={(doc) => {
            setSelectedDoctor(null)
            openBookingModal({ doctor: doc })
          }}
        />
      )}
    </div>
  )
}
