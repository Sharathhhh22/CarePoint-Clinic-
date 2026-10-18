import type { Metadata } from "next"
import { AboutClient } from "./AboutClient"

export const metadata: Metadata = {
  title: "About CarePoint Clinic | Compassionate, Human-Centred Medicine",
  description:
    "Learn about CarePoint Clinic's founding story, accredited clinical standards, board-certified physicians, and our mission to provide unrushed, patient-first outpatient care.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About CarePoint Clinic | Healthcare Made Human",
    description:
      "Learn about CarePoint Clinic's founding story, accredited clinical standards, board-certified physicians, and our mission to provide unrushed, patient-first outpatient care.",
    url: "/about",
  },
}

export default function AboutPage() {
  return <AboutClient />
}
