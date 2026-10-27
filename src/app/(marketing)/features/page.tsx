import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { FeaturesClient } from "./FeaturesClient"

export const metadata: Metadata = {
  title: "Features",
  description: "Discover the real-time clinical booking engine, verified specialist matching, and digital clinic pass system on SlotUrSelf.",
  alternates: {
    canonical: "/features",
  },
  openGraph: {
    title: "Features",
    description: "Discover the real-time clinical booking engine, verified specialist matching, and digital clinic pass system on SlotUrSelf.",
    url: "/features",
  },
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <div className="site-container">
        <Breadcrumbs items={[{ label: "Features" }]} className="mb-8" />

        <div className="text-center max-w-3xl mx-auto mb-24">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            Powerful Features for Modern Healthcare
          </h1>
          <p className="text-xl text-muted-foreground">
            We built SlotUrSelf to solve the actual problems with booking medical appointments.
          </p>
        </div>

        <FeaturesClient />
      </div>
    </div>
  )
}
