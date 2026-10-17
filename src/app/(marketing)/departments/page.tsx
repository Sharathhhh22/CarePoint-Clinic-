import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, MapPin, Bot } from "lucide-react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { DepartmentsClient } from "./DepartmentsClient"

export const metadata: Metadata = {
  title: "Medical Departments & Specialists",
  description: "Explore verified clinical specialties across pediatrics, cardiology, dermatology, neurology, orthopedics, ophthalmology, dentistry, and general medicine on SlotUrSelf.",
  alternates: {
    canonical: "/departments",
  },
  openGraph: {
    title: "Medical Departments & Specialists",
    description: "Explore verified clinical specialties across pediatrics, cardiology, dermatology, neurology, orthopedics, ophthalmology, dentistry, and general medicine on SlotUrSelf.",
    url: "/departments",
  },
}

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <div className="site-container">
        <Breadcrumbs items={[{ label: "Departments" }]} className="mb-8" />

        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Medical Departments & Specialists
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Browse verified clinical departments across partner healthcare networks.
          </p>
        </div>

        <DepartmentsClient />

        {/* Related Navigation & Internal Links */}
        <div className="mt-16 pt-10 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/clinics"
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/50 transition-colors flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  Explore Clinics by Location
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Find partner facilities with live queue tracking in your city
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </Link>

          <Link
            href="/assistant"
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/50 transition-colors flex items-center justify-between group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  AI Symptom Triage Guide
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Answer a few questions to find the appropriate medical specialty
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
