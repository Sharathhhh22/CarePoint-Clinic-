import type { Metadata } from "next"
import { Container } from "@/components/ui/Container"
import { DoctorsClient } from "./DoctorsClient"

export const metadata: Metadata = {
  title: "Our Doctors & Clinical Specialists | CarePoint Clinic",
  description:
    "Meet our board-certified physicians, cardiologists, neurologists, and pediatricians at CarePoint Clinic in Boston, MA. View credentials and book consultations.",
  alternates: {
    canonical: "/doctors",
  },
  openGraph: {
    title: "Our Doctors & Clinical Specialists | CarePoint Clinic",
    description:
      "Meet our board-certified physicians, cardiologists, neurologists, and pediatricians at CarePoint Clinic in Boston, MA.",
    url: "/doctors",
  },
}

export default function DoctorsPage() {
  return (
    <div className="min-h-screen pt-12 pb-24 bg-[#FAFAF7] text-[#101512]">
      <Container>
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#173F30]" />
            <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#173F30]">
              Medical Leadership
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101512] tracking-tight leading-[1.1] mb-4">
            Our Attending Physicians &amp; Specialists
          </h1>
          <p className="text-lg text-[#777D79] leading-relaxed">
            Every clinician at CarePoint Clinic combines extensive clinical training with compassionate, patient-first care.
          </p>
        </div>

        <DoctorsClient />
      </Container>
    </div>
  )
}
