"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Sparkles,
  Maximize2,
  X,
  ShieldCheck,
  Wind,
  Volume2,
  Sun,
  CheckCircle2,
  ArrowRight,
  Eye,
} from "lucide-react"
import { openBookingModal } from "@/lib/booking-events"

interface GalleryItem {
  id: string
  title: string
  category: "suites" | "diagnostics" | "lounges" | "pediatrics"
  categoryLabel: string
  image: string
  badge: string
  specs: string[]
  description: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "suite-1",
    title: "Executive Outpatient Consultation Suite",
    category: "suites",
    categoryLabel: "Consultation Suites",
    image: "/images/carenova/clinic-interior.jpg",
    badge: "Biophilic Design",
    specs: [
      "Hospital-grade HEPA H14 continuous air filtration",
      "Acoustically insulated STC-55 privacy partitions",
      "Ergonomic exam recliners with integrated digital vitals",
      "Full spectrum daylight circadian lighting",
    ],
    description:
      "Designed to eliminate clinical intimidation. Our consultation suites combine warm oak finishes, natural daylight, and hospital-grade sterility for unhurried conversations.",
  },
  {
    id: "diag-1",
    title: "Advanced Cardiac & Ultrasound Diagnostic Room",
    category: "diagnostics",
    categoryLabel: "Diagnostics & Imaging",
    image: "/images/carenova/doc-clinic-2.jpg",
    badge: "High Precision",
    specs: [
      "Latest-generation digital color Doppler echocardiography",
      "Point-of-care rapid blood gas and biomarker analyzer",
      "Direct encrypted PACS cloud transmission to physician tablets",
      "Low-radiation digital radiography integration",
    ],
    description:
      "Precision diagnosis without third-party delay. Patients undergo echocardiograms and ultrasound screenings with instant physician-led interpretation.",
  },
  {
    id: "suite-2",
    title: "Family Medicine & Patient Intake Suite",
    category: "suites",
    categoryLabel: "Consultation Suites",
    image: "/images/carenova/doc-clinic-3.jpg",
    badge: "Human-Centred",
    specs: [
      "Touchless contactless hygiene sanitization stations",
      "Direct-entry private consultation flow (no shared queues)",
      "Dedicated family seating for support persons",
      "Integrated electronic health record bedside terminals",
    ],
    description:
      "A relaxed, respectful setting for annual physicals, chronic symptom checkups, and multi-generational family medicine care.",
  },
  {
    id: "lounge-1",
    title: "Tranquil Reception & Botanical Waiting Lounge",
    category: "lounges",
    categoryLabel: "Patient Lounges",
    image: "/images/carenova/doc-clinic-4.jpg",
    badge: "Zero Waiting Fatigue",
    specs: [
      "Averaged wait time of under 4 minutes across all departments",
      "Filtered herbal hydration station and organic refreshments",
      "Biophilic living plant walls promoting calm and lower heart rate",
      "High-speed patient Wi-Fi and quiet workspaces",
    ],
    description:
      "A welcoming, serene departure from standard sterile hospital waiting rooms. Our botanical lounge sets an immediate tone of reassurance from the moment you enter.",
  },
  {
    id: "ped-1",
    title: "Pediatric Comfort & Developmental Examination Room",
    category: "pediatrics",
    categoryLabel: "Pediatrics & Comfort",
    image: "/images/carenova/doc-clinic-5.jpg",
    badge: "Child-Friendly",
    specs: [
      "Pediatric distraction murals and tactile wooden sensory toys",
      "Hypoallergenic soft furnishings and heated infant exam pads",
      "Gentle low-decibel diagnostic instruments",
      "Stroller-accessible double door entryways",
    ],
    description:
      "Specially designed by child development specialists so infants, toddlers, and adolescents feel secure and relaxed during medical examinations.",
  },
  {
    id: "suite-3",
    title: "Clinical Procedure & Rapid Recovery Bay",
    category: "suites",
    categoryLabel: "Consultation Suites",
    image: "/images/carenova/doc-clinic-6.jpg",
    badge: "Sterile Grade A",
    specs: [
      "Positive pressure laminar airflow sterile filtration",
      "Continuous multiparameter cardiac and oxygen monitoring",
      "Private dimmable post-procedure recovery pods",
      "Dedicated 1-on-1 registered nurse oversight",
    ],
    description:
      "Equipped for minor outpatient procedures, wound sutures, allergy challenges, and quiet post-treatment observation.",
  },
]

export function GalleryClient() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  const filteredItems =
    activeFilter === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter)

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#173F30]"></span>
              <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#173F30]">
                Architecture &amp; Facilities Showcase
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101512] tracking-tight leading-[1.1] mb-6">
              Spaces designed for healing, <br />
              <span className="text-[#173F30]">equipped for precision.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#777D79] leading-relaxed font-normal">
              Tour CarePoint Clinic&apos;s purpose-built outpatient environment. We replaced sterile, noisy corridors with biophilic natural light, acoustic privacy partitions, and cutting-edge diagnostic technology.
            </p>
          </div>

          {/* FILTER CONTROLS */}
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-[#E0E4DF]">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              All Facilities ({GALLERY_ITEMS.length})
            </button>
            <button
              onClick={() => setActiveFilter("suites")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeFilter === "suites"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Consultation Suites
            </button>
            <button
              onClick={() => setActiveFilter("diagnostics")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeFilter === "diagnostics"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Diagnostics & Imaging
            </button>
            <button
              onClick={() => setActiveFilter("lounges")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeFilter === "lounges"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Patient Lounges
            </button>
            <button
              onClick={() => setActiveFilter("pediatrics")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeFilter === "pediatrics"
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
              }`}
            >
              Pediatrics & Comfort
            </button>
          </div>
        </div>
      </section>

      {/* 2. GALLERY GRID */}
      <section className="py-16 md:py-24 bg-white border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group rounded-3xl bg-[#FAFAF7] border border-[#E0E4DF] overflow-hidden cursor-pointer hover:border-[#173F30]/40 transition-all hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#E7EEE8]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-[#101512]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-[#173F30] flex items-center justify-center shadow-lg backdrop-blur-xs scale-90 group-hover:scale-100 transition-transform">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#173F30] text-[11px] font-bold shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-semibold text-[#173F30] mb-1">
                      {item.categoryLabel}
                    </p>
                    <h3 className="text-lg font-bold text-[#101512] group-hover:text-[#173F30] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#777D79] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-[#173F30]">
                  <span>Explore room specifications</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ENVIRONMENTAL STANDARDS HIGHLIGHT */}
      <section className="py-20 md:py-28 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#173F30] mb-2">
              Environmental Health
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight">
              Clinically Pure. Acoustically Calm.
            </h3>
            <p className="text-base text-[#777D79] mt-3">
              We engineered four distinct environmental safeguards into the physical construction of CarePoint Clinic.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-2xl bg-white border border-[#E0E4DF] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center mb-5">
                <Wind className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#101512] mb-2">HEPA-14 Clean Air</h4>
              <p className="text-xs text-[#777D79] leading-relaxed">
                Hospital air is refreshed 12 times per hour through medical-grade HEPA filters capturing 99.97% of airborne particulate matter.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#E0E4DF] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center mb-5">
                <Volume2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#101512] mb-2">Acoustic Shielding</h4>
              <p className="text-xs text-[#777D79] leading-relaxed">
                Exam suites feature sound-dampening architectural framing and ambient sound masking to ensure 100% confidential dialogue.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#E0E4DF] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center mb-5">
                <Sun className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#101512] mb-2">Natural Daylight</h4>
              <p className="text-xs text-[#777D79] leading-relaxed">
                Large perimeter windows illuminate clinical corridors with natural daylight, supporting circadian stability and patient relaxation.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#E0E4DF] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-[#101512] mb-2">Sterile Surface Audits</h4>
              <p className="text-xs text-[#777D79] leading-relaxed">
                Exam surfaces are disinfected with EPA-registered hospital virucides between every single patient appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIGHTBOX MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#101512]/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E0E4DF] flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-[#101512] hover:bg-white flex items-center justify-center shadow-md transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left image */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px] bg-[#E7EEE8]">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-cover"
              />
              <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#173F30] text-xs font-bold shadow-xs">
                {selectedItem.badge}
              </span>
            </div>

            {/* Right details */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#173F30] mb-1">
                  {selectedItem.categoryLabel}
                </p>
                <h3 className="text-2xl font-bold text-[#101512] mb-3">{selectedItem.title}</h3>
                <p className="text-sm text-[#777D79] leading-relaxed mb-6">
                  {selectedItem.description}
                </p>

                <div className="space-y-2 mb-6">
                  <p className="text-xs font-bold text-[#101512] uppercase tracking-wider">
                    Architectural & Clinical Specs:
                  </p>
                  {selectedItem.specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#777D79]">
                      <CheckCircle2 className="w-4 h-4 text-[#173F30] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E0E4DF] flex items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setSelectedItem(null)
                    openBookingModal()
                  }}
                  className="w-full py-3 px-5 rounded-full bg-[#173F30] hover:bg-[#123326] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Book Consultation Here</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
