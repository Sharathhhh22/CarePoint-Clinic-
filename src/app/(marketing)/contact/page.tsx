import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { ContactClient } from "./ContactClient"

export const metadata: Metadata = {
  title: "Contact Us | SlotUrSelf",
  description: "Get in touch with the SlotUrSelf medical operations and clinical integration team for support, questions, or partnerships.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | SlotUrSelf",
    description: "Get in touch with the SlotUrSelf medical operations and clinical integration team for support, questions, or partnerships.",
    url: "/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <Breadcrumbs items={[{ label: "Contact Us" }]} className="mb-8" />

        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Have questions about clinical integrations or booking on our platform? We are here to help.
          </p>
        </div>

        <ContactClient />
      </div>
    </div>
  )
}
