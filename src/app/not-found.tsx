import Link from "next/link"
import { ArrowLeft, Stethoscope, Home, Mail, ShieldAlert, Calendar } from "lucide-react"
import { CareNovaLogo } from "@/components/carenova/CareNovaLogo"

export const metadata = {
  title: "404 - Page Not Found | CarePoint Clinic",
  description: "The requested healthcare page or clinical record could not be located. Browse CarePoint Clinic outpatient services or return to our homepage.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] text-[#101512] p-6">
      <div className="max-w-lg w-full bg-white border border-[#E0E4DF] rounded-3xl p-8 sm:p-12 shadow-md text-center">
        
        {/* CarePoint Brand Logo */}
        <div className="flex justify-center mb-6">
          <CareNovaLogo href="/" />
        </div>

        {/* Typographic Kicker */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#E25C3D]" aria-hidden="true" />
          <span className="text-xs uppercase tracking-[0.16em] font-bold text-[#E25C3D]">
            Error 404 &bull; Page Not Found
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight mb-3">
          We couldn&apos;t find that page.
        </h1>
        
        <p className="text-sm text-[#777D79] leading-relaxed mb-8 max-w-sm mx-auto">
          The healthcare resource, clinic page, or appointment pass you requested may have been relocated or updated.
        </p>

        {/* Helpful Clinic Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <Link
            href="/services"
            className="p-3.5 rounded-2xl border border-[#E0E4DF] bg-[#FAFAF7] hover:bg-white hover:border-[#173F30]/40 transition-colors flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0 group-hover:bg-[#173F30] group-hover:text-white transition-colors">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#101512]">Clinical Services</p>
              <p className="text-[11px] text-[#777D79]">Browse our specialties</p>
            </div>
          </Link>

          <Link
            href="/contact"
            className="p-3.5 rounded-2xl border border-[#E0E4DF] bg-[#FAFAF7] hover:bg-white hover:border-[#173F30]/40 transition-colors flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E7EEE8] text-[#173F30] flex items-center justify-center shrink-0 group-hover:bg-[#173F30] group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#101512]">Patient Care Desk</p>
              <p className="text-[11px] text-[#777D79]">Contact our team</p>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="h-11 px-6 rounded-full bg-[#173F30] hover:bg-[#123326] text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/pricing"
            className="h-11 px-6 rounded-full border border-[#E0E4DF] hover:bg-[#FAFAF7] text-[#101512] text-xs font-semibold inline-flex items-center justify-center transition-colors"
          >
            <span>View Pricing &amp; Fees</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
