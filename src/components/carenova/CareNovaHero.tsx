"use client"

import React, { useState } from "react"
import Image from "next/image"
import { 
  ArrowRight, 
  Play, 
  Stethoscope, 
  Calendar, 
  Clock, 
  Quote, 
  Lock,
  HeartPulse,
  Activity
} from "lucide-react"
import { CareNovaVideoModal } from "./CareNovaVideoModal"
import { CareNovaBookingModal } from "./CareNovaBookingModal"

export function CareNovaHero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>()

  const handleOpenBooking = (doc?: string) => {
    setSelectedDoctor(doc)
    setIsBookingOpen(true)
  }

  const handleScrollToAbout = () => {
    const el = document.getElementById("about")
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <section
        id="hero"
        className="relative overflow-hidden bg-[#FAFAF7] pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-12 lg:pb-28"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-14 items-center">
            
            {/* ======================================================== */}
            {/* LEFT COLUMN: Eyebrow, Headline, Paragraph, CTAs, Trust   */}
            {/* ======================================================== */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center z-10">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A9C2B2] shrink-0" aria-hidden="true" />
                <span className="text-xs md:text-sm tracking-wide text-[#777D79] font-medium uppercase">
                  Better Care. Brighter Tomorrows.
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[52px] sm:text-[68px] md:text-[76px] lg:text-[78px] xl:text-[88px] font-extrabold tracking-tight leading-[0.98] text-[#101512] mb-6">
                Healthcare<br />
                <span className="text-[#A9C2B2] font-extrabold">Made</span>{" "}
                <span>Human</span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-base sm:text-lg text-[#777D79] leading-relaxed max-w-[480px] mb-8">
                Accessible, compassionate, personalised healthcare for you and your loved ones.
              </p>

              {/* Primary and Secondary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
                {/* Primary Button */}
                <button
                  onClick={() => handleOpenBooking()}
                  className="inline-flex items-center justify-center gap-2.5 bg-[#173F30] hover:bg-[#123326] text-white text-base font-semibold px-8 py-4 rounded-full transition-all shadow-md hover:shadow-lg active:scale-[0.98] group"
                >
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                {/* Secondary Button */}
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="inline-flex items-center justify-center gap-3 bg-white hover:bg-white/90 text-[#101512] border border-[#E0E4DF] hover:border-[#173F30]/40 text-base font-semibold px-6 py-3.5 rounded-full transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] group"
                >
                  <span className="w-8 h-8 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center group-hover:bg-[#173F30] group-hover:text-white transition-colors shrink-0">
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </span>
                  <span>Watch Our Video</span>
                </button>
              </div>

              {/* Trust Indicator Group */}
              <div className="flex items-center gap-3.5 pt-1 pb-8 border-b border-[#E0E4DF]/70">
                {/* Cluster of clinician & patient thumbnails */}
                <div className="flex items-center -space-x-2.5 overflow-hidden shrink-0">
                  <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-xs">
                    <Image
                      src="/images/carenova/avatar-1.jpg"
                      alt="CarePoint Patient Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-xs">
                    <Image
                      src="/images/carenova/avatar-2.jpg"
                      alt="CarePoint Patient Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-xs">
                    <Image
                      src="/images/carenova/avatar-3.jpg"
                      alt="CarePoint Patient Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-xs">
                    <Image
                      src="/images/carenova/avatar-4.jpg"
                      alt="CarePoint Patient Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Trust copy (strictly non-numeric, human-centred) */}
                <span className="text-sm font-medium text-[#101512]">
                  Care that puts people first
                </span>
              </div>

              {/* Service Assurance Row (4 Compact Items) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6">
                {/* 1. Trusted Professionals */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0">
                    <Stethoscope className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-[#101512]">
                    Trusted Professionals
                  </span>
                </div>

                {/* 2. Responsive Support */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-[#101512]">
                    Responsive Support
                  </span>
                </div>

                {/* 3. Privacy Focused */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-[#101512]">
                    Privacy Focused
                  </span>
                </div>

                {/* 4. Easy Scheduling */}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-[#101512]">
                    Easy Scheduling
                  </span>
                </div>
              </div>

            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: Healthcare Photograph & Floating Cards     */}
            {/* ======================================================== */}
            <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col items-center lg:items-end">
              
              {/* Subtle Pale-Green Organic Shape Behind Main Image */}
              <div
                className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-[#E7EEE8]/70 rounded-[48px] -rotate-1 pointer-events-none -z-10"
                aria-hidden="true"
              />

              {/* Main Image Framing Container */}
              <div className="relative w-full max-w-[540px] lg:max-w-none aspect-[4/4.5] sm:aspect-[4/4.3] lg:aspect-[4/4.3] rounded-[36px] overflow-hidden shadow-xl border-4 border-white/90 bg-[#FAFAF7]">
                <Image
                  src="/images/carenova/hero-doctor.jpg"
                  alt="Doctor speaking with a patient in a bright, modern clinic."
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 650px"
                  className="object-cover object-top sm:object-center"
                />

                {/* Soft ambient gradient overlay at edges to ensure card contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* ====================================================== */}
              {/* DESKTOP FLOATING CARDS (Layered intentionally >=1024px) */}
              {/* ====================================================== */}

              {/* CARD A: COMPASSIONATE CARE (Upper-Left) */}
              <div className="hidden lg:block absolute top-6 -left-8 xl:-left-12 z-20 w-[250px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_12px_32px_rgba(16,21,18,0.08)] border border-[#E0E4DF] transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0">
                      <HeartPulse className="w-5 h-5 text-[#173F30]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#101512] leading-tight">
                        Compassionate Care
                      </h2>
                      <p className="text-xs text-[#777D79] mt-0.5">
                        Every Step of the Way
                      </p>
                    </div>
                  </div>

                  {/* Arrow Action Link leading to About section */}
                  <button
                    onClick={handleScrollToAbout}
                    className="w-7 h-7 rounded-full bg-[#FAFAF7] hover:bg-[#173F30] text-[#777D79] hover:text-white border border-[#E0E4DF] flex items-center justify-center transition-colors shrink-0"
                    aria-label="Learn about our compassionate care approach"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CARD B: NEXT APPOINTMENT (Lower-Right) */}
              <div className="hidden lg:block absolute bottom-10 -right-6 xl:-right-10 z-20 w-[270px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_12px_36px_rgba(16,21,18,0.12)] border border-[#E0E4DF] transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E0E4DF]/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#173F30]" />
                    <span className="text-xs font-bold text-[#101512]">Your Next Appointment</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E7EEE8] text-[#173F30]">
                    Preview
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E0E4DF] shrink-0">
                    <Image
                      src="/images/carenova/dr-sara-khan.jpg"
                      alt="Dr. Sara Khan"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#101512] truncate">Dr. Sara Khan</p>
                    <p className="text-xs text-[#777D79]">Cardiologist</p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBooking("Dr. Sara Khan")}
                  className="w-full py-2 px-3 rounded-xl bg-[#173F30] hover:bg-[#123326] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CARD C: PATIENT EXPERIENCE EDITORIAL QUOTE (Lower-Left) */}
              <div className="hidden lg:block absolute -bottom-5 left-4 z-20 max-w-[280px] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_12px_32px_rgba(16,21,18,0.08)] border border-[#E0E4DF] transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0 mt-0.5">
                    <Quote className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#101512] leading-relaxed italic">
                      &ldquo;Every patient deserves to feel heard, respected, and supported.&rdquo;
                    </p>
                    <p className="text-[10px] text-[#777D79] mt-1 font-semibold not-italic">
                      CarePoint Care Principle
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD D: CARE OVERVIEW (Bottom-Right, subtle) */}
              <div className="hidden xl:flex absolute -bottom-7 right-20 z-10 bg-white/95 backdrop-blur-md rounded-xl px-3.5 py-2.5 shadow-md border border-[#E0E4DF] items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#101512]">Care, Made Simpler</p>
                  <p className="text-[11px] text-[#777D79]">Appointments and services in one place</p>
                </div>
              </div>

              {/* Handwritten Brand Accent & Curved SVG Line (Bottom-Left Corner) */}
              <div className="hidden lg:flex absolute -bottom-14 left-8 z-10 items-center gap-2 pointer-events-none">
                <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 18C14 2 34 2 46 22" stroke="#A9C2B2" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
                </svg>
                <span className="text-xs font-serif italic text-[#777D79] tracking-wider select-none">
                  Healthier Days, Happier You
                </span>
              </div>

              {/* ====================================================== */}
              {/* MOBILE FLOW CARDS (<1024px: Normal Document Flow)      */}
              {/* ====================================================== */}
              <div className="lg:hidden w-full max-w-[540px] mt-6 space-y-3.5">
                {/* Mobile Card: Next Appointment Preview */}
                <div className="w-full bg-white rounded-2xl p-4.5 border border-[#E0E4DF] shadow-xs">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E0E4DF]/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#173F30]" />
                      <span className="text-xs font-bold text-[#101512]">Your Next Appointment</span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E7EEE8] text-[#173F30]">
                      Illustrative Preview
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E0E4DF] shrink-0">
                        <Image
                          src="/images/carenova/dr-sara-khan.jpg"
                          alt="Dr. Sara Khan"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#101512]">Dr. Sara Khan</p>
                        <p className="text-xs text-[#777D79]">Cardiologist</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBooking("Dr. Sara Khan")}
                      className="py-2 px-4 rounded-full bg-[#173F30] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Editorial Quote Card */}
                <div className="w-full bg-white rounded-2xl p-4 border border-[#E0E4DF] shadow-xs flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0 mt-0.5">
                    <Quote className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#101512] leading-relaxed italic">
                      &ldquo;Every patient deserves to feel heard, respected, and supported.&rdquo;
                    </p>
                    <p className="text-[10px] text-[#777D79] mt-1 font-semibold not-italic">
                      CarePoint Care Principle
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Video Modal */}
      <CareNovaVideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        onBookClick={() => handleOpenBooking()}
      />

      {/* Booking Modal */}
      <CareNovaBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDoctor={selectedDoctor}
      />
    </>
  )
}
