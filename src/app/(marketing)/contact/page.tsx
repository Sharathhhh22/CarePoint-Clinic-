import type { Metadata } from "next"
import { ContactClient } from "./ContactClient"

export const metadata: Metadata = {
  title: "Contact & Clinic Location | CarePoint Clinic",
  description:
    "Contact CarePoint Clinic in Boston, MA. View clinic hours, telephone contacts, validated parking directions, and send an online consultation enquiry.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & Clinic Location | CarePoint Clinic",
    description:
      "Contact CarePoint Clinic in Boston, MA. View clinic hours, telephone contacts, validated parking directions, and send an online consultation enquiry.",
    url: "/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-12 pb-24 bg-[#FAFAF7] text-[#101512]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7EEE8] text-[#173F30] text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-[#173F30]"></span>
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101512] tracking-tight leading-[1.1] mb-4">
            Contact & Location
          </h1>
          <p className="text-lg text-[#777D79] leading-relaxed">
            Reach our patient care desk for appointment enquiries, clinic directions, or WhatsApp consultation assistance.
          </p>
        </div>

        <ContactClient />
      </div>
    </div>
  )
}
