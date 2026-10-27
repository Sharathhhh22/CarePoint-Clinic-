import Link from "next/link"
import {
  Home,
  Stethoscope,
  MapPin,
  CalendarCheck,
  PhoneCall,
  Bot,
  ArrowRight,
} from "lucide-react"
import { BrandLogo } from "@/components/brand/BrandLogo"

export const metadata = {
  title: "404 - Page Not Found | SlotUrSelf",
  description:
    "The requested page or clinic appointment could not be located. Browse SlotUrSelf verified clinical departments, find nearby clinics, or return to our homepage.",
}

const MAIN_SECTIONS = [
  {
    href: "/",
    title: "Homepage",
    description: "Instant clinic appointment booking, verified doctors, and 10-minute hold guarantee.",
    icon: Home,
  },
  {
    href: "/departments",
    title: "Specialists & Departments",
    description: "Cardiology, Pediatrics, Dermatology, Orthopedics, General Medicine & more.",
    icon: Stethoscope,
  },
  {
    href: "/clinics",
    title: "Nearby Clinics",
    description: "Locate verified partner clinics in Indiranagar, Koramangala, HSR Layout, and beyond.",
    icon: MapPin,
  },
  {
    href: "/appointments/new",
    title: "Book Appointment",
    description: "Select doctor, pick open calendar slot, and get your instant queue pass.",
    icon: CalendarCheck,
  },
  {
    href: "/assistant",
    title: "AI Symptom Guide",
    description: "Get preliminary clinical guidance to choose the right specialist.",
    icon: Bot,
  },
  {
    href: "/contact",
    title: "Contact Support",
    description: "Direct clinic helpline, support desk, and partner onboarding assistance.",
    icon: PhoneCall,
  },
]

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 sm:p-6 lg:p-12 transition-colors">
      <div className="max-w-3xl w-full bg-card border border-border rounded-2xl p-6 sm:p-10 lg:p-12 shadow-md text-center">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <BrandLogo href="/" />
        </div>

        {/* Typographic Kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-destructive" aria-hidden="true" />
          <span>Error 404 &bull; Page Not Found</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-3">
          We couldn&apos;t find that page.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
          The clinic resource, specialist directory, or appointment pass you were looking for may have moved or been updated. Choose from the quick links below to continue:
        </p>

        {/* 6 Main Sections Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-8 text-left">
          {MAIN_SECTIONS.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group p-4 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-xs font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {section.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-primary">
                  <span>Explore section</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/departments"
            className="w-full sm:w-auto h-11 px-6 rounded-xl border border-border bg-card hover:bg-surface-elevated text-foreground text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Stethoscope className="w-3.5 h-3.5 text-primary" />
            <span>Browse Specialists</span>
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto h-11 px-6 rounded-xl border border-border bg-card hover:bg-surface-elevated text-foreground text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-primary" />
            <span>Contact Support Desk</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
