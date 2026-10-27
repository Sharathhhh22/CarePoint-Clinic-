import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { ContactClient } from "./ContactClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the SlotUrSelf medical operations team. Reach out for clinic onboarding, appointment assistance, or platform inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us",
    description: "Get in touch with the SlotUrSelf medical operations team. Reach out for clinic onboarding, appointment assistance, or platform inquiries.",
    url: "/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-8 sm:pt-12 pb-16 sm:pb-24 bg-background text-foreground">
      <div className="site-container">
        <Breadcrumbs items={[{ label: "Contact Us" }]} className="mb-6 sm:mb-8" />
        
        <div className="max-w-3xl mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3 sm:mb-4">
            We&apos;re here to help.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Have questions about your appointment or interested in onboarding your clinic? Send us a message and our support team will respond promptly.
          </p>
        </div>

        <ContactClient />
      </div>
    </div>
  )
}
