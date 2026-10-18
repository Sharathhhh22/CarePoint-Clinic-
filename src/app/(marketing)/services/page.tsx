import type { Metadata } from "next"
import { ServicesClient } from "./ServicesClient"

export const metadata: Metadata = {
  title: "Clinical Services & Medical Specialties | CarePoint Clinic",
  description:
    "Explore CarePoint Clinic's outpatient medical specialties: Primary Care, Cardiology, Pediatrics, Neurology, Ultrasound Diagnostics, and HIPAA-Compliant Telehealth.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Clinical Services & Medical Specialties | CarePoint Clinic",
    description:
      "Explore CarePoint Clinic's outpatient medical specialties: Primary Care, Cardiology, Pediatrics, Neurology, Ultrasound Diagnostics, and HIPAA-Compliant Telehealth.",
    url: "/services",
  },
}

export default function ServicesPage() {
  return <ServicesClient />
}
