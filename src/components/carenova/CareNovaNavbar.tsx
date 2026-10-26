"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ArrowRight, Menu, X, Phone, Mail, Shield, User } from "lucide-react"
import { CareNovaLogo } from "./CareNovaLogo"
import { CareNovaSearchModal } from "./CareNovaSearchModal"
import { CareNovaBookingModal } from "./CareNovaBookingModal"
import { CarePointThemeToggle } from "./CarePointThemeToggle"
import { CarePointUserNav } from "./CarePointUserNav"
import { CarePointUserProfileModal } from "./CarePointUserProfileModal"
import { Button } from "@/components/ui/Button"
import { Container } from "@/components/ui/Container"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "Security", href: "/security" },
  { label: "Contact", href: "/contact" },
]

export function CareNovaNavbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [preselectedBooking, setPreselectedBooking] = useState<string | undefined>()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))
        setScrollProgress(progress)
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Listen for custom open-carenova-booking events from any page
  useEffect(() => {
    const handleOpenBooking = (e: any) => {
      const detail = e.detail || {}
      setPreselectedBooking(detail.service || detail.doctor)
      setIsBookingOpen(true)
    }

    window.addEventListener("open-carenova-booking", handleOpenBooking)
    return () => window.removeEventListener("open-carenova-booking", handleOpenBooking)
  }, [])

  const openBookingWithItem = (item?: string) => {
    setPreselectedBooking(item)
    setIsBookingOpen(true)
  }

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Top Status Announcement Bar */}
      <div className="w-full bg-[#101512] py-2 px-4 text-center border-b border-[#252c27] relative z-40 hidden sm:block">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A9C2B2]" aria-hidden="true" />
          <span className="text-xs font-medium tracking-wide text-white/90">
            CarePoint Clinic &bull; Same-Day Telehealth &amp; In-Person Appointments Available
          </span>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#FAFAF7]/85 dark:bg-[#0D1511]/85 backdrop-blur-md border-[#E0E4DF] dark:border-[#4E6C5D] shadow-xs"
            : "bg-[#FAFAF7] dark:bg-[#0D1511] border-[#E0E4DF]/70 dark:border-[#4E6C5D]/70"
        }`}
      >
        <Container className="flex h-20 items-center justify-between">
          {/* LEFT: Logo & Wordmark */}
          <div className="flex items-center shrink-0">
            <CareNovaLogo href="/" />
          </div>

          {/* CENTRE: Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-6 lg:gap-8"
            aria-label="CarePoint Main Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const active = isLinkActive(item.href)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative text-sm tracking-tight font-medium transition-colors py-1 ${
                    active
                      ? "text-[#173F30] font-semibold"
                      : "text-[#777D79] hover:text-[#101512]"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#173F30] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* RIGHT: Search, Log In & Book Appointment Button */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-11 h-11 min-h-11 min-w-11 rounded-full flex items-center justify-center text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8] dark:hover:bg-[#1E2E25] border border-transparent hover:border-[#E0E4DF] dark:hover:border-[#2D4235] transition-all cursor-pointer"
              aria-label="Search CarePoint services, specialists, and FAQs"
            >
              <Search className="size-4 text-[#101512] dark:text-[#EAEFEA]" aria-hidden="true" />
            </button>

            {/* Theme Toggle */}
            <CarePointThemeToggle />

            {/* User Profile / Auth Nav */}
            <CarePointUserNav />

            {/* Primary Dark-Green Button */}
            <Button
              onClick={() => openBookingWithItem()}
              variant="primary"
              size="sm"
              className="rounded-full shadow-xs hover:shadow-sm active:scale-[0.98] group"
            >
              <span>Book an Appointment</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
          </div>

          {/* MOBILE CONTROLS: Search + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-11 h-11 min-h-11 min-w-11 rounded-full flex items-center justify-center text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8] dark:hover:bg-[#1E2E25] transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="size-5 text-[#101512] dark:text-[#EAEFEA]" aria-hidden="true" />
            </button>

            <CarePointThemeToggle />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-11 h-11 min-h-11 min-w-11 rounded-full flex items-center justify-center text-[#101512] hover:bg-[#E7EEE8] transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </Container>

        {/* Scroll Reading Progress Bar */}
        <div
          role="progressbar"
          aria-label="Page reading progress"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E0E4DF]/40 dark:bg-[#4E6C5D]/30 pointer-events-none"
        >
          <div
            className="h-full bg-[#173F30] dark:bg-[#A9C2B2] transition-[width] duration-75 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40 animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            className="md:hidden fixed inset-x-0 top-20 z-40 bg-[#FAFAF7] dark:bg-[#0D1511] border-b border-[#E0E4DF] dark:border-[#4E6C5D] shadow-2xl p-6 animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-5rem)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <nav className="flex flex-col space-y-3">
              {NAV_ITEMS.map((item) => {
                const active = isLinkActive(item.href)
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-base font-semibold py-2.5 border-b border-[#E0E4DF]/60 transition-colors flex items-center justify-between ${
                      active ? "text-[#173F30] font-bold" : "text-[#101512] hover:text-[#173F30]"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#173F30]" />}
                  </Link>
                )
              })}

              {/* Clickable Mobile Direct Contacts */}
              <div className="pt-2 grid grid-cols-2 gap-2.5">
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="rounded-full text-xs font-bold text-[#173F30] shadow-2xs"
                >
                  <a
                    href="tel:+18002892273"
                    aria-label="Call CarePoint Clinic directly"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    <span>Call Clinic</span>
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  className="rounded-full text-xs font-semibold text-[#101512] shadow-2xs"
                >
                  <a
                    href="mailto:care@carepointclinic.com"
                    aria-label="Email CarePoint Clinic care team"
                  >
                    <Mail className="size-4 text-[#173F30]" aria-hidden="true" />
                    <span>Email Care</span>
                  </a>
                </Button>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <Button
                  asChild
                  variant="outline"
                  size="md"
                  fullWidth
                  className="rounded-full border-[#173F30]/30 text-[#173F30] dark:text-[#A9C2B2] hover:bg-[#E7EEE8]"
                >
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="size-4 mr-2" aria-hidden="true" />
                    <span>My Profile &amp; Records</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  size="md"
                  fullWidth
                  className="rounded-full"
                >
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Patient &amp; Staff Login</span>
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    openBookingWithItem()
                  }}
                  variant="primary"
                  size="md"
                  fullWidth
                  className="rounded-full shadow-xs"
                >
                  <span>Book an Appointment</span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </nav>
          </div>
        </>
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

      <CarePointUserProfileModal />
    </>
  )
}
