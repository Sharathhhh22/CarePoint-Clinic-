import type { Metadata } from "next"
import { PricingClient } from "./PricingClient"

export const metadata: Metadata = {
  title: "Consultation Fees & Insurance Plans | CarePoint Clinic",
  description:
    "Review transparent outpatient consultation fees at CarePoint Clinic. Compare primary care, specialist, and executive health tiers, and check your health insurance network coverage.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Consultation Fees & Insurance Plans | CarePoint Clinic",
    description:
      "Review transparent outpatient consultation fees at CarePoint Clinic. Compare primary care, specialist, and executive health tiers, and check your health insurance network coverage.",
    url: "/pricing",
  },
}

export default function PricingPage() {
  return <PricingClient />
}
