"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  Check,
  Shield,
  HelpCircle,
  CreditCard,
  Building,
  ArrowRight,
  Info,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import { openBookingModal } from "@/lib/booking-events"

interface InsuranceOption {
  id: string
  name: string
  status: "In-Network" | "Out-of-Network" | "Direct Self-Pay"
  typicalCopay: string
  notes: string
}

const INSURANCE_NETWORKS: InsuranceOption[] = [
  {
    id: "bcbs",
    name: "BlueCross BlueShield",
    status: "In-Network",
    typicalCopay: "$15 – $30",
    notes: "Direct claims filing; no specialist referral required for internal medicine or cardiology.",
  },
  {
    id: "aetna",
    name: "Aetna Health",
    status: "In-Network",
    typicalCopay: "$20 – $35",
    notes: "Pre-authorized preventative annual physicals covered at 100% with $0 copay.",
  },
  {
    id: "cigna",
    name: "Cigna Healthcare",
    status: "In-Network",
    typicalCopay: "$20 – $35",
    notes: "Full electronic claims integration with same-day eligibility confirmation.",
  },
  {
    id: "united",
    name: "UnitedHealthcare (UHC)",
    status: "In-Network",
    typicalCopay: "$25 – $40",
    notes: "In-network across Choice Plus and Core tiers; rapid diagnostic coverage included.",
  },
  {
    id: "medicare",
    name: "Medicare Part B",
    status: "In-Network",
    typicalCopay: "20% Co-insurance after deductible",
    notes: "Standard Medicare assignment accepted. We file all paperwork on your behalf.",
  },
  {
    id: "selfpay",
    name: "Self-Pay / Uninsured",
    status: "Direct Self-Pay",
    typicalCopay: "Published flat rates ($75 - $195)",
    notes: "Transparent upfront flat pricing with zero hidden lab add-ons or facility charges.",
  },
]

const COMPARISON_ROWS = [
  { feature: "Full Vitals & Nursing Triage", plan1: true, plan2: true, plan3: true },
  { feature: "Attending Physician Consultation", plan1: "30 mins", plan2: "45 mins", plan3: "75 mins" },
  { feature: "E-Prescriptions Sent to Pharmacy", plan1: true, plan2: true, plan3: true },
  { feature: "7-Day Patient Portal Messaging", plan1: true, plan2: true, plan3: true },
  { feature: "Board-Certified Specialist Review", plan1: false, plan2: true, plan3: true },
  { feature: "12-Lead Resting ECG Included", plan1: false, plan2: "Optional Add-on", plan3: true },
  { feature: "Complete Metabolic Blood Chemistry", plan1: false, plan2: false, plan3: true },
  { feature: "Personalized 60-Day Care Protocol", plan1: false, plan2: true, plan3: true },
  { feature: "Post-Visit Physician Phone Follow-up", plan1: false, plan2: false, plan3: true },
]

const FAQS = [
  {
    q: "Are there any hidden facility or room fees?",
    a: "Never. Our published self-pay consultation fees cover everything listed in the appointment tier. If an elective lab test or ultrasound is suggested by your physician, the exact price is discussed and approved by you beforehand.",
  },
  {
    q: "Can I use my FSA or HSA debit card?",
    a: "Yes! All CarePoint Clinic consultations, in-house diagnostics, and prescribed treatments are eligible medical expenses under IRS guidelines. You will receive an instant itemized superbill with diagnostic codes (ICD-10/CPT).",
  },
  {
    q: "What happens if I need to cancel or reschedule?",
    a: "You can reschedule or cancel directly from your confirmation email up to 4 hours prior to your consultation with zero penalty. We believe healthcare should accommodate real life.",
  },
  {
    q: "How does insurance billing work?",
    a: "If you provide your insurance details, our billing coordinators verify your active benefits and submit claims electronically on your behalf. You only pay your plan's designated copay or coinsurance at check-in.",
  },
]

export function PricingClient() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("bcbs")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const activeInsurance = INSURANCE_NETWORKS.find((n) => n.id === selectedNetwork)

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#173F30]"></span>
              <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#173F30]">
                Transparent Healthcare Pricing
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101512] tracking-tight leading-[1.1] mb-6">
              Predictable costs, <br />
              <span className="text-[#173F30]">no surprise invoices.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#777D79] leading-relaxed font-normal">
              We publish our consultation fees openly and verify your insurance coverage upfront. What you see is what you pay: no surprise facility fees, no confusing bills months later.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THREE PRICING TIERS */}
      <section className="py-16 md:py-24 bg-white border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* TIER 1 */}
            <div className="rounded-3xl bg-[#FAFAF7] border border-[#E0E4DF] p-8 flex flex-col justify-between hover:border-[#173F30]/40 transition-all shadow-xs">
              <div>
                <span className="px-3 py-1 rounded-full bg-white text-[#777D79] text-xs font-bold border border-[#E0E4DF]">
                  Standard Care
                </span>
                <h3 className="text-2xl font-bold text-[#101512] mt-4 mb-2">
                  Primary Consultation
                </h3>
                <p className="text-xs text-[#777D79] mb-6">
                  Ideal for general health checkups, minor acute symptoms, and ongoing prescriptions.
                </p>

                <div className="mb-6 pb-6 border-b border-[#E0E4DF]">
                  <span className="text-4xl font-extrabold text-[#101512]">$75</span>
                  <span className="text-xs font-medium text-[#777D79] ml-2">/ 30 min session</span>
                </div>

                <ul className="space-y-3 text-xs text-[#777D79] mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#173F30] shrink-0" />
                    <span>30-minute unrushed physician exam</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#173F30] shrink-0" />
                    <span>Comprehensive vital signs check</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#173F30] shrink-0" />
                    <span>Digital prescription dispatch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#173F30] shrink-0" />
                    <span>7-day patient portal messaging</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openBookingModal({ service: "Primary Care & Family Medicine" })}
                className="w-full py-3 px-5 rounded-full border border-[#E0E4DF] text-[#173F30] font-bold text-xs hover:bg-[#E7EEE8] transition-colors"
              >
                Book Primary Care
              </button>
            </div>

            {/* TIER 2 - FEATURED */}
            <div className="rounded-3xl bg-[#173F30] text-white p-8 flex flex-col justify-between shadow-xl relative scale-100 md:-translate-y-2">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#A9C2B2] text-[#173F30] text-[11px] font-black uppercase tracking-wider shadow-sm">
                Most Popular
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold">
                  Specialist Practice
                </span>
                <h3 className="text-2xl font-bold text-white mt-4 mb-2">Specialist Review</h3>
                <p className="text-xs text-white/80 mb-6">
                  For complex issues in cardiology, neurology, pediatrics, or refractory symptoms.
                </p>

                <div className="mb-6 pb-6 border-b border-white/20">
                  <span className="text-4xl font-extrabold text-white">$130</span>
                  <span className="text-xs font-medium text-white/70 ml-2">/ 45 min session</span>
                </div>

                <ul className="space-y-3 text-xs text-white/90 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#A9C2B2] shrink-0" />
                    <span>45-minute specialist consultation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#A9C2B2] shrink-0" />
                    <span>Prior medical chart & ECG review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#A9C2B2] shrink-0" />
                    <span>Personalized 60-day recovery roadmap</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#A9C2B2] shrink-0" />
                    <span>Priority on-site diagnostic scheduling</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openBookingModal({ service: "Specialist Clinical Consultation" })}
                className="w-full py-3.5 px-5 rounded-full bg-white text-[#173F30] hover:bg-[#FAFAF7] font-bold text-xs transition-all shadow-md active:scale-95"
              >
                Book Specialist Review
              </button>
            </div>

            {/* TIER 3 */}
            <div className="rounded-3xl bg-[#FAFAF7] border border-[#E0E4DF] p-8 flex flex-col justify-between hover:border-[#173F30]/40 transition-all shadow-xs">
              <div>
                <span className="px-3 py-1 rounded-full bg-white text-[#777D79] text-xs font-bold border border-[#E0E4DF]">
                  Executive Health
                </span>
                <h3 className="text-2xl font-bold text-[#101512] mt-4 mb-2">Executive Longevity</h3>
                <p className="text-xs text-[#777D79] mb-6">
                  Full head-to-toe preventive screening, metabolic panel, and longevity guidance.
                </p>

                <div className="mb-6 pb-6 border-b border-[#E0E4DF]">
                  <span className="text-4xl font-extrabold text-[#101512]">$195</span>
                  <span className="text-xs font-medium text-[#777D79] ml-2">/ 75 min session</span>
                </div>

                <ul className="space-y-3 text-xs text-[#777D79] mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#173F30] shrink-0" />
                    <span>75-minute dual physician review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#173F30] shrink-0" />
                    <span>12-Lead Resting Digital ECG included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#173F30] shrink-0" />
                    <span>Complete blood chemistry & lipid profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#173F30] shrink-0" />
                    <span>Doctor follow-up video call included</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => openBookingModal({ service: "Executive Longevity & Metabolic Review" })}
                className="w-full py-3 px-5 rounded-full border border-[#E0E4DF] text-[#173F30] font-bold text-xs hover:bg-[#E7EEE8] transition-colors"
              >
                Book Executive Longevity
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INSURANCE COVERAGE CHECKER */}
      <section className="py-20 md:py-28 bg-[#FAFAF7] border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#173F30] mb-2">
              Insurance Verification Tool
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight">
              Check Your Network Coverage
            </h3>
            <p className="text-sm text-[#777D79] mt-3">
              Select your health insurance carrier to view accepted plan status and estimated copays.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E0E4DF] shadow-sm">
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-[#101512] uppercase tracking-wider">
                Select Your Insurance Provider:
              </label>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-[#E0E4DF] bg-[#FAFAF7] text-sm font-semibold text-[#101512] focus:outline-none focus:ring-2 focus:ring-[#173F30]"
              >
                {INSURANCE_NETWORKS.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            {activeInsurance && (
              <div className="p-5 rounded-2xl bg-[#E7EEE8] border border-[#A9C2B2]/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#173F30] uppercase tracking-wider">
                    Network Status:
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#173F30] text-white text-xs font-bold">
                    {activeInsurance.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#A9C2B2]/40">
                  <span className="text-xs font-bold text-[#101512]">Typical In-Network Copay:</span>
                  <span className="text-sm font-extrabold text-[#173F30]">
                    {activeInsurance.typicalCopay}
                  </span>
                </div>

                <p className="text-xs text-[#173F30]/90 leading-relaxed pt-2">
                  {activeInsurance.notes}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-[11px] text-[#777D79]">
              <Info className="w-4 h-4 text-[#173F30] shrink-0" />
              <span>
                Demonstration pricing: Published rates are accurate self-pay rates. Insured patient out-of-pocket costs depend on deductibles.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BILLING FAQS */}
      <section className="py-20 md:py-28 bg-white border-b border-[#E0E4DF]/60">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#173F30] mb-2">
              Common Questions
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight">
              Frequently Asked Billing Questions
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-[#E0E4DF] bg-[#FAFAF7] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#101512] hover:text-[#173F30] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-[#173F30]" : "text-[#777D79]"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-xs text-[#777D79] leading-relaxed border-t border-[#E0E4DF] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
