import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"

export const metadata: Metadata = {
  title: "Privacy Policy | SlotUrSelf",
  description: "Learn how SlotUrSelf collects, secures, and protects patient and medical data in compliance with digital healthcare privacy standards.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | SlotUrSelf",
    description: "Learn how SlotUrSelf collects, secures, and protects patient and medical data in compliance with digital healthcare privacy standards.",
    url: "/privacy",
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-3xl pt-28 md:pt-36 pb-24 px-6 text-foreground">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} className="mb-8" />

      <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8 text-sm">Last updated: October 12, 2026</p>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground/90">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Data Protection</h2>
          <p>
            Your privacy is critically important to us. This policy outlines how SlotUrSelf collects, processes, and protects your personal and medical information in accordance with modern digital health data privacy standards.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information Collection</h2>
          <p>
            We collect information you provide directly when creating an account, scheduling an appointment, or submitting a health questionnaire. This includes your name, contact information, appointment preferences, and reason for visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Sharing</h2>
          <p>
            We share your data exclusively with the verified medical professionals and clinics you explicitly choose to book consultations with. We never sell, lease, or monetize your healthcare data to third-party advertisers.
          </p>
        </section>
      </div>
    </div>
  )
}
