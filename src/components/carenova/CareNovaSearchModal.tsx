"use client"

import React, { useState, useEffect } from "react"
import { Search, X, Stethoscope, User, HelpCircle, ArrowRight } from "lucide-react"

interface SearchItem {
  id: string
  title: string
  category: "Service" | "Doctor" | "Information"
  description: string
  actionUrl: string
  badge?: string
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: "gen-consult",
    title: "General Consultation",
    category: "Service",
    description: "Primary outpatient care, thorough examinations, and diagnostic assessments.",
    actionUrl: "#services",
    badge: "Primary Care"
  },
  {
    id: "prev-health",
    title: "Preventive Health",
    category: "Service",
    description: "Proactive screening, cardiovascular health, and preventative lifestyle guidance.",
    actionUrl: "#services",
    badge: "Wellness"
  },
  {
    id: "spec-consult",
    title: "Specialist Consultation",
    category: "Service",
    description: "Cardiology, internal medicine, and pediatrics clinical evaluations.",
    actionUrl: "#services",
    badge: "Specialist"
  },
  {
    id: "follow-up",
    title: "Follow-up Care",
    category: "Service",
    description: "Post-consultation monitoring, prescription adjustments, and treatment check-ins.",
    actionUrl: "#services",
    badge: "Care Continuity"
  },
  {
    id: "dr-sara",
    title: "Dr. Sara Khan",
    category: "Doctor",
    description: "Cardiologist focused on preventive cardiovascular health and clinical consultation.",
    actionUrl: "#doctors",
    badge: "Cardiologist"
  },
  {
    id: "dr-marcus",
    title: "Dr. Marcus Vance",
    category: "Doctor",
    description: "Family Medicine physician providing patient-centred primary and preventive care.",
    actionUrl: "#doctors",
    badge: "Family Medicine"
  },
  {
    id: "dr-elena",
    title: "Dr. Elena Rostova",
    category: "Doctor",
    description: "Internal Medicine specialist in diagnostic assessments and adult health.",
    actionUrl: "#doctors",
    badge: "Internal Medicine"
  },
  {
    id: "dr-anita",
    title: "Dr. Anita Chen",
    category: "Doctor",
    description: "Pediatric physician dedicated to infant and child wellness guidance.",
    actionUrl: "#doctors",
    badge: "Pediatrics"
  },
  {
    id: "faq-booking",
    title: "How do I book an appointment?",
    category: "Information",
    description: "Select your preferred doctor, time slot, and confirm in just a few steps.",
    actionUrl: "#faq",
    badge: "FAQ"
  },
  {
    id: "faq-reschedule",
    title: "Can I reschedule my appointment?",
    category: "Information",
    description: "Flexible rescheduling guidelines and policy overview.",
    actionUrl: "#faq",
    badge: "FAQ"
  },
  {
    id: "faq-visit",
    title: "What should I bring to my clinic visit?",
    category: "Information",
    description: "Photo ID, previous medical records, and current medication list.",
    actionUrl: "#faq",
    badge: "FAQ"
  }
]

interface CareNovaSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectBooking?: (serviceOrDoctor?: string) => void
}

export function CareNovaSearchModal({
  isOpen,
  onClose,
  onSelectBooking,
}: CareNovaSearchModalProps) {
  const [query, setQuery] = useState("")
  const [filteredResults, setFilteredResults] = useState(SEARCH_ITEMS)

  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults(SEARCH_ITEMS.slice(0, 6))
    } else {
      const q = query.toLowerCase()
      setFilteredResults(
        SEARCH_ITEMS.filter(
          item =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            (item.badge && item.badge.toLowerCase().includes(q))
        )
      )
    }
  }, [query])

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

  if (!isOpen) return null

  const handleItemClick = (item: SearchItem) => {
    onClose()
    if (item.category === "Doctor" || item.category === "Service") {
      if (onSelectBooking) {
        onSelectBooking(item.title)
        return
      }
    }
    const target = document.querySelector(item.actionUrl)
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 bg-[#101512]/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Search CarePoint Clinic"
    >
      <div
        className="w-full max-w-2xl bg-[#FAFAF7] rounded-3xl border border-[#E0E4DF] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E0E4DF] bg-white">
          <Search className="w-5 h-5 text-[#173F30] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search services, doctors, or patient questions..."
            className="w-full bg-transparent text-[#101512] placeholder:text-[#777D79] text-base focus:outline-hidden"
            aria-label="Search query"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#777D79] hover:text-[#101512] p-1 rounded-full hover:bg-[#E7EEE8] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E7EEE8] text-[#173F30] hover:bg-[#A9C2B2]/30 transition-colors"
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 px-4 text-[#777D79]">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#173F30]" />
              <p className="font-medium text-[#101512]">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1">Try searching for &ldquo;Cardiology&rdquo;, &ldquo;Preventive&rdquo;, or &ldquo;Appointment&rdquo;.</p>
            </div>
          ) : (
            filteredResults.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-[#E7EEE8]/60 border border-[#E0E4DF] hover:border-[#A9C2B2] transition-all flex items-start gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#173F30] group-hover:text-white transition-colors">
                  {item.category === "Service" && <Stethoscope className="w-4 h-4" />}
                  {item.category === "Doctor" && <User className="w-4 h-4" />}
                  {item.category === "Information" && <HelpCircle className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-[#101512] group-hover:text-[#173F30] transition-colors">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#E7EEE8] text-[#173F30]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#777D79] line-clamp-1">
                    {item.description}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-[#777D79] group-hover:text-[#173F30] group-hover:translate-x-0.5 transition-all self-center shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#E7EEE8]/50 border-t border-[#E0E4DF] flex items-center justify-between text-xs text-[#777D79]">
          <span>CarePoint Clinic Instant Search</span>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded-md border border-[#E0E4DF] font-sans">Esc</kbd> to exit</span>
        </div>
      </div>
    </div>
  )
}
