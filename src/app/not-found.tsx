import Link from "next/link"
import {
  Home,
  Stethoscope,
  Users,
  CreditCard,
  Building2,
  PhoneCall,
  Calendar,
  ArrowRight,
  Search,
} from "lucide-react"
import { CareNovaLogo } from "@/components/carenova/CareNovaLogo"

export const metadata = {
  title: "404 - Page Not Found | CarePoint Clinic",
  description:
    "The requested healthcare page or clinical record could not be located. Browse CarePoint Clinic outpatient services, meet our doctors, or return to our homepage.",
}

const MAIN_SECTIONS = [
  {
    href: "/",
    title: "Homepage & Overview",
    description: "CarePoint Clinic approach, clinical metrics, and patient portal access.",
    icon: Home,
  },
  {
    href: "/services",
    title: "Clinical Specialties",
    description: "Primary care, cardiology, pediatrics, neurology, and diagnostics.",
    icon: Stethoscope,
  },
  {
    href: "/#doctors",
    title: "Our Medical Team",
    description: "Meet board-certified specialists and check on-site clinical schedules.",
    icon: Users,
  },
  {
    href: "/pricing",
    title: "Transparent Pricing",
    description: "Published consultation fees, insurance verification, and care plans.",
    icon: CreditCard,
  },
  {
    href: "/gallery",
    title: "Facility & Suite Gallery",
    description: "Explore HEPA-filtered suites, pediatric lounges, and imaging bays.",
    icon: Building2,
  },
  {
    href: "/contact",
    title: "Contact & Directions",
    description: "Direct clinic phone line, email care team, and GPS directions.",
    icon: PhoneCall,
  },
]

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] dark:bg-[#0D1511] text-[#101512] dark:text-[#EAEFEA] p-4 sm:p-6 lg:p-12 transition-colors">
      <div className="max-w-3xl w-full bg-white dark:bg-[#121B16] border border-[#E0E4DF] dark:border-[#4E6C5D] rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 shadow-xl text-center">
        {/* CarePoint Brand Logo */}
        <div className="flex justify-center mb-6">
          <CareNovaLogo href="/" />
        </div>

        {/* Typographic Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E25C3D]/10 text-[#E25C3D] text-xs font-bold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-[#E25C3D]" aria-hidden="true" />
          <span>Error 404 &bull; Clinical Resource Not Found</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] dark:text-[#EAEFEA] tracking-tight mb-3">
          We couldn&apos;t find that page.
        </h1>

        <p className="text-sm sm:text-base text-[#777D79] dark:text-[#9BAAA0] leading-relaxed mb-8 max-w-xl mx-auto">
          The outpatient resource, doctor directory, or booking pass you were looking for may have been updated or moved. Use the links below to navigate back to our main sections.
        </p>

        {/* 6 Main Sections Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-8 text-left">
          {MAIN_SECTIONS.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group p-4 rounded-2xl border border-[#E0E4DF] dark:border-[#4E6C5D] bg-[#FAFAF7] dark:bg-[#1B2921] hover:bg-white dark:hover:bg-[#22352B] hover:border-[#173F30]/40 dark:hover:border-[#A9C2B2]/40 transition-all hover:shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl bg-[#E7EEE8] dark:bg-[#16213A] text-[#173F30] dark:text-[#A9C2B2] flex items-center justify-center mb-3 group-hover:bg-[#173F30] group-hover:text-white dark:group-hover:bg-[#173F30] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-bold text-[#101512] dark:text-[#EAEFEA] mb-1 group-hover:text-[#173F30] dark:group-hover:text-[#A9C2B2] transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-[11px] text-[#777D79] dark:text-[#9BAAA0] leading-relaxed line-clamp-2">
                    {section.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#173F30] dark:text-[#A9C2B2]">
                  <span>Explore section</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-6 border-t border-[#E0E4DF] dark:border-[#4E6C5D] flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#173F30] hover:bg-[#123326] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto h-11 px-6 rounded-full border border-[#E0E4DF] dark:border-[#4E6C5D] bg-white dark:bg-[#1B2921] hover:bg-[#FAFAF7] dark:hover:bg-[#22352B] text-[#101512] dark:text-[#EAEFEA] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#173F30] dark:text-[#A9C2B2]" />
            <span>Search All Services</span>
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto h-11 px-6 rounded-full border border-[#E0E4DF] dark:border-[#4E6C5D] bg-white dark:bg-[#1B2921] hover:bg-[#FAFAF7] dark:hover:bg-[#22352B] text-[#101512] dark:text-[#EAEFEA] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#173F30] dark:text-[#A9C2B2]" />
            <span>Patient Care Desk</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
