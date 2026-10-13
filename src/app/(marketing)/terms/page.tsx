import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"

export const metadata: Metadata = {
  title: "Terms of Service | SlotUrSelf",
  description: "Read the SlotUrSelf Terms of Service, medical disclaimers, cancellation rules, and clinical platform usage terms.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | SlotUrSelf",
    description: "Read the SlotUrSelf Terms of Service, medical disclaimers, cancellation rules, and clinical platform usage terms.",
    url: "/terms",
  },
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-3xl pt-28 md:pt-36 pb-24 px-6 text-foreground">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} className="mb-8" />

      <h1 className="text-4xl font-bold mb-4 text-foreground">Terms of Service</h1>
      <p className="text-muted-foreground mb-8 text-sm">Last updated: October 12, 2026</p>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground/90">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and utilizing the SlotUrSelf booking network, you accept and agree to be bound by the terms and provisions of this agreement and applicable healthcare regulations.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Medical Disclaimer</h2>
          <p>
            SlotUrSelf is an appointment management and scheduling infrastructure. We facilitate patient-provider booking but do not practice medicine or directly diagnose conditions. Always seek the advice of your physician or dial emergency services (108) for acute medical emergencies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Appointment Policies</h2>
          <p>
            Patients agree to arrive promptly for locked appointment slots. If you must cancel or reschedule, please provide notice at least 2 hours in advance through your patient portal.
          </p>
        </section>
      </div>
    </div>
  )
}
