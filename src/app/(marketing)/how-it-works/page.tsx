import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { HowItWorksClient } from "./HowItWorksClient"

export const metadata: Metadata = {
  title: "How It Works | SlotUrSelf",
  description: "Learn how easy it is to search for verified doctors, lock real-time appointment slots, and bypass clinic waiting rooms with SlotUrSelf.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How It Works | SlotUrSelf",
    description: "Learn how easy it is to search for verified doctors, lock real-time appointment slots, and bypass clinic waiting rooms with SlotUrSelf.",
    url: "/how-it-works",
  },
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <div className="max-w-[800px] mx-auto px-6 md:px-12">
        <Breadcrumbs items={[{ label: "How It Works" }]} className="mb-8" />

        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            How It Works
          </h1>
          <p className="text-xl text-muted-foreground">
            Booking a doctor should be as easy as booking a table at a restaurant.
          </p>
        </div>

        <HowItWorksClient />
      </div>
    </div>
  )
}
