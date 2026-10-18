"use client"

import React, { useState } from "react"
import Image from "next/image"
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
  FileCheck
} from "lucide-react"
import { CareNovaBookingModal } from "./CareNovaBookingModal"

export function CareNovaSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingService, setBookingService] = useState<string | undefined>()
  const [bookingDoctor, setBookingDoctor] = useState<string | undefined>()

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
      {/* SECTION A: OUR APPROACH TO CARE                          */}
      {/* ======================================================== */}
      <section id="about" className="py-20 md:py-28 bg-[#FAFAF7] border-t border-[#E0E4DF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
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
            <div className="lg:col-span-6 relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-lg border border-[#E0E4DF]">
              <Image
                src="/images/carenova/clinic-interior.jpg"
                alt="CarePoint modern, calm clinic consultation rooms"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E0E4DF]">
                <p className="text-xs font-bold text-[#101512]">Calm, Private Clinical Environments</p>
                <p className="text-[11px] text-[#777D79] mt-0.5">Designed intentionally to eliminate clinical anxiety and encourage open dialogue.</p>
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

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION C: MEET OUR DOCTORS                              */}
      {/* ======================================================== */}
      <section id="doctors" className="py-20 md:py-28 bg-[#FAFAF7] border-t border-[#E0E4DF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="max-w-2xl mb-14">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.name}
                className="bg-white rounded-3xl overflow-hidden border border-[#E0E4DF] hover:border-[#173F30]/40 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div>
                  {/* Doctor Portrait */}
                  <div className="relative aspect-[4/4.5] w-full bg-[#E7EEE8] overflow-hidden">
                    <Image
                      src={doc.image}
                      alt={`${doc.name}, ${doc.specialty} at CarePoint Clinic`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover object-top group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#173F30] border border-[#E0E4DF]">
                      {doc.availability}
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-xs font-semibold text-[#A9C2B2] uppercase tracking-wider">
                      {doc.specialty}
                    </span>
                    <h3 className="text-lg font-bold text-[#101512] mt-0.5 mb-1">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-[#777D79] font-medium mb-2">
                      {doc.qualification}
                    </p>
                    <p className="text-xs text-[#777D79] leading-relaxed">
                      {doc.focus}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleBookDoctor(doc.name)}
                    className="w-full py-2.5 px-4 rounded-full bg-[#173F30] hover:bg-[#123326] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <span>Book with {doc.name.split(" ")[1]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION D: PRICING & CARE PLANS                          */}
      {/* ======================================================== */}
      <section id="pricing" className="py-20 md:py-28 bg-[#FAFAF7] border-t border-[#E0E4DF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173F30] bg-[#E7EEE8] px-3.5 py-1.5 rounded-full inline-block mb-3">
              Transparent Fees
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#101512] leading-[1.08] mb-3">
              Simple, transparent pricing.
            </h2>
            <p className="text-base text-[#777D79] leading-relaxed">
              Quality healthcare without hidden billing or surprise facility fees. Clear consultation rates upfront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
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
                    <span className="text-4xl font-extrabold text-[#173F30]">{tier.price}</span>
                    <span className="text-xs text-[#777D79]">/ consultation</span>
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
            ))}
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

                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-all hover:bg-white/10"
                >
                  <span>Explore Our Services</span>
                </a>
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
    </>
  )
}
