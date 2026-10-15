import type { Metadata } from "next"
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
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
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
      </div>
    </div>
  )
}
