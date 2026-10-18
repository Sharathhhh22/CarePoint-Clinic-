import { Metadata } from "next"
import { SecurityClient } from "./SecurityClient"

export const metadata: Metadata = {
  title: "Security Checklist & HIPAA Compliance | CarePoint Clinic",
  description:
    "Comprehensive production security checklist for CarePoint Clinic covering Row Level Security, API authentication, IDOR mitigation, rate limiting, and encrypted healthcare data storage.",
  alternates: {
    canonical: "/security",
  },
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#101512]">
      <SecurityClient />
    </div>
  )
}
