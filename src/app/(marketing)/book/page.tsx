import type { Metadata } from "next"
import { Container } from "@/components/ui/Container"
import { BookingWizard } from "@/components/booking/BookingWizard"

export const metadata: Metadata = {
  title: "Book an Appointment | CarePoint Clinic",
  description:
    "Schedule an in-person clinical consultation or HD telehealth appointment at CarePoint Clinic in Boston, MA. Choose your doctor, specialty, and preferred time slot.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book an Appointment | CarePoint Clinic",
    description:
      "Schedule an in-person clinical consultation or HD telehealth appointment at CarePoint Clinic in Boston, MA.",
    url: "/book",
  },
}

export default function BookPage() {
  return (
    <div className="min-h-screen pt-12 pb-24 bg-[#FAFAF7] text-[#101512]">
      <Container>
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#173F30]" />
            <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#173F30]">
              Patient Scheduling
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#101512] tracking-tight leading-[1.1] mb-3">
            Book Your Clinical Consultation
          </h1>
          <p className="text-base text-[#777D79] leading-relaxed">
            Select your clinical concern, physician, and preferred appointment time. Receive immediate confirmation and SMS directions.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E0E4DF] p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
          <BookingWizard />
        </div>
      </Container>
    </div>
  )
}
