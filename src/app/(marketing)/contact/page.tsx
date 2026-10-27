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
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <div className="site-container">
        <Breadcrumbs items={[{ label: "Contact Us" }]} className="mb-8" />
        
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            We&apos;re here to help.
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions about your appointment or interested in onboarding your clinic? Send us a message and our support team will respond promptly.
          </p>
        </div>

        <ContactClient />
      </div>
    </div>
  )
}
