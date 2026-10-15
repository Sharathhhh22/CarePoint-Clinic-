import type { Metadata } from "next"
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
      </div>
    </div>
  )
}
