"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ArrowRight, Menu, X, User } from "lucide-react"
import { CareNovaLogo } from "./CareNovaLogo"
import { CareNovaSearchModal } from "./CareNovaSearchModal"
import { CareNovaBookingModal } from "./CareNovaBookingModal"

const NAV_ITEMS = [
  { label: "Home", href: "/#hero", id: "hero" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Find Doctor", href: "/#symptom-matcher", id: "symptom-matcher" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Pricing", href: "/#pricing", id: "pricing" },
  { label: "Resources", href: "/#faq", id: "faq" },
]

export function CareNovaNavbar() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("hero")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [preselectedBooking, setPreselectedBooking] = useState<string | undefined>()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // Section spy
      const sections = ["hero", "services", "symptom-matcher", "about", "pricing", "faq"]
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === "/") {
      e.preventDefault()
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
        setActiveSection(targetId)
      }
      setIsMobileMenuOpen(false)
    }
  }

  const openBookingWithItem = (item?: string) => {
    setPreselectedBooking(item)
    setIsBookingOpen(true)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-[#FAFAF7]/95 backdrop-blur-md border-b ${
          isScrolled ? "border-[#E0E4DF] shadow-xs" : "border-[#E0E4DF]/70"
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex h-20 items-center justify-between">
          {/* LEFT: Logo & Wordmark */}
          <div className="flex items-center shrink-0">
            <CareNovaLogo href="/" />
          </div>

          {/* CENTRE: Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-7 lg:gap-9"
            aria-label="CarePoint Main Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative text-sm tracking-tight font-medium transition-colors py-1 ${
                    isActive
                      ? "text-[#173F30] font-semibold"
                      : "text-[#777D79] hover:text-[#101512]"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#173F30] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </a>
              )
            })}
          </nav>

          {/* RIGHT: Search, Log In & Book Appointment Button */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#101512] hover:bg-[#E7EEE8] border border-transparent hover:border-[#E0E4DF] transition-all"
              aria-label="Search CarePoint services, specialists, and FAQs"
            >
              <Search className="w-4 h-4 text-[#101512]" />
            </button>

            {/* Log In Link */}
            <Link
              href="/login"
              className="text-sm font-medium text-[#777D79] hover:text-[#101512] transition-colors px-2 py-1"
            >
              Log in
            </Link>

            {/* Primary Dark-Green Button */}
            <button
              onClick={() => openBookingWithItem()}
              className="inline-flex items-center gap-2 bg-[#173F30] hover:bg-[#123326] text-white text-sm font-semibold px-5 lg:px-6 py-2.5 rounded-full transition-all shadow-xs hover:shadow-sm active:scale-[0.98] group"
            >
              <span>Book an Appointment</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* MOBILE CONTROLS: Search + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#101512] hover:bg-[#E7EEE8] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#101512]" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#101512] hover:bg-[#E7EEE8] transition-colors"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-x-0 top-20 z-40 bg-[#FAFAF7] border-b border-[#E0E4DF] shadow-2xl p-6 animate-in slide-in-from-top-4 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col space-y-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-base font-semibold text-[#101512] hover:text-[#173F30] py-2 border-b border-[#E0E4DF]/60"
              >
                {item.label}
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full border border-[#E0E4DF] text-sm font-semibold text-[#101512] hover:bg-[#E7EEE8] transition-colors"
              >
                Log in
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openBookingWithItem()
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#173F30] text-white text-sm font-semibold py-3.5 rounded-full hover:bg-[#123326] transition-colors shadow-xs"
              >
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* MODALS */}
      <CareNovaSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectBooking={openBookingWithItem}
      />

      <CareNovaBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={preselectedBooking}
        initialDoctor={preselectedBooking?.startsWith("Dr.") ? preselectedBooking : undefined}
      />
    </>
  )
}
