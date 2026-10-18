"use client"

import React, { useState, useEffect } from "react"
import { Calendar, Phone, Sparkles } from "lucide-react"
import { CareNovaBookingModal } from "./CareNovaBookingModal"

interface CarePointMobileActionBarProps {
  onOpenBooking?: () => void
}

export function CarePointMobileActionBar({ onOpenBooking }: CarePointMobileActionBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show action bar once scrolled down past the hero CTAs (~260px)
      if (window.scrollY > 260) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleScrollToMatcher = () => {
    const el = document.getElementById("symptom-matcher")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!isVisible) return null

  return (
    <aside
      aria-label="CarePoint Quick Mobile Actions"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E0E4DF] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(16,21,18,0.08)] animate-in slide-in-from-bottom duration-300"
    >
      <div className="max-w-md mx-auto flex items-center gap-2.5">
        
        {/* Quick Call Clinic Button */}
        <a
          href="tel:+18002892273"
          className="w-12 h-12 rounded-full border border-[#E0E4DF] bg-[#FAFAF7] hover:bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0 transition-colors shadow-2xs active:scale-95"
          aria-label="Call CarePoint Clinic"
        >
          <Phone className="w-5 h-5 text-[#173F30]" />
        </a>

        {/* Quick Symptom Matcher Jump */}
        <button
          onClick={handleScrollToMatcher}
          className="h-12 px-3.5 rounded-full border border-[#E0E4DF] bg-[#FAFAF7] hover:bg-[#E7EEE8] text-[#101512] flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs active:scale-95 text-xs font-semibold"
          aria-label="Find Right Doctor with Symptom Matcher"
        >
          <Sparkles className="w-4 h-4 text-[#173F30]" />
          <span className="hidden sm:inline">Matcher</span>
        </button>

        {/* Primary Book Appointment Action Button */}
        <button
          onClick={() => {
            if (onOpenBooking) {
              onOpenBooking()
            } else {
              setIsBookingOpen(true)
            }
          }}
          className="flex-1 h-12 rounded-full bg-[#173F30] hover:bg-[#123326] active:scale-[0.98] text-white text-sm font-semibold flex items-center justify-center gap-2 px-5 transition-all shadow-md"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>

      </div>

      {/* Internal Self-Contained Booking Modal */}
      <CareNovaBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </aside>
  )
}
