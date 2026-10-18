import { Metadata } from "next"
import { CareNovaHero } from "@/components/carenova/CareNovaHero"
import { CareNovaSections } from "@/components/carenova/CareNovaSections"

export const metadata: Metadata = {
  title: "CarePoint Clinic | Healthcare Made Human",
  description: "Accessible, compassionate, personalised outpatient healthcare for you and your loved ones. Book your consultation with our verified clinical specialists.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CarePoint Clinic | Healthcare Made Human",
    description: "Accessible, compassionate, personalised outpatient healthcare for you and your loved ones. Book your consultation with our verified clinical specialists.",
    url: "/",
  },
}

export default function CarePointLandingPage() {
  return (
    <div className="w-full bg-[#FAFAF7] text-[#101512]">
      <main id="main-content" className="w-full">
        {/* HERO SECTION */}
        <CareNovaHero />

        {/* BELOW-THE-FOLD SECTIONS */}
        <CareNovaSections />
      </main>
    </div>
  )
}
