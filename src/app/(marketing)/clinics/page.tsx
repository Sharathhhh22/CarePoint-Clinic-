import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Stethoscope, CalendarCheck } from "lucide-react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { ClinicMapExplorer } from "@/components/clinics/ClinicMapExplorer"

export const metadata: Metadata = {
  title: "Find Nearby Clinics & Doctors",
  description: "Locate verified outpatient clinics and physicians in your neighborhood with real-time slot availability on SlotUrSelf.",
  alternates: {
    canonical: "/clinics",
  },
  openGraph: {
    title: "Find Nearby Clinics & Doctors",
    description: "Locate verified outpatient clinics and physicians in your neighborhood with real-time slot availability on SlotUrSelf.",
    url: "/clinics",
  },
}

export default function ClinicsPage() {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <div className="site-container">
        <Breadcrumbs items={[{ label: "Find Clinics" }]} className="mb-8" />

        <div className="max-w-3xl mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Find verified clinics <br />
            in your neighborhood.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Locate partner healthcare centers, calculate real distance from your current location, and book verified consultation slots with zero queue delay.
          </p>
        </div>

        <ClinicMapExplorer />

        {/* Related Navigation & Internal Links */}
        <div className="mt-16 pt-10 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/departments"
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/50 transition-colors flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Browse by Medical Specialty
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cardiology, Pediatrics, Dermatology, Orthopedics & more
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          <Link
            href="/appointments/new"
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/50 transition-colors flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Direct Appointment Wizard
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Book an in-person or telemedicine slot in under 60 seconds
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}
