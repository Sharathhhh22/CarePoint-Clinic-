"use client"

import React from "react"
import Link from "next/link"
import { Mail, Phone, Clock, MapPin, Heart, Shield } from "lucide-react"
import { CareNovaLogo } from "./CareNovaLogo"
import { Container } from "@/components/ui/Container"

export function CareNovaFooter() {
  return (
    <>
      <footer className="bg-white border-t border-[#E0E4DF] text-[#777D79] pt-16 pb-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#E0E4DF]/70">
            {/* BRAND SUMMARY */}
            <div className="lg:col-span-4 space-y-4">
              <CareNovaLogo href="/" />
              <p className="text-sm text-[#777D79] leading-relaxed max-w-sm">
                CarePoint Clinic provides modern, human-centred outpatient care. Unrushed consultations, transparent guidance, and dedicated healthcare specialists.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#173F30] font-medium pt-1">
                <Heart className="w-4 h-4 fill-[#173F30]/20" />
                <span>Compassionate healthcare for you and your family.</span>
              </div>
            </div>

            {/* NAVIGATION LINKS */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#101512]">
                Explore Clinic
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/" className="hover:text-[#173F30] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#173F30] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-[#173F30] transition-colors">
                    Clinical Services
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-[#173F30] transition-colors">
                    Facilities & Labs
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-[#173F30] transition-colors">
                    Pricing & Insurance
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#173F30] transition-colors">
                    Contact & Location
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-[#173F30] transition-colors font-medium">
                    Patient Profile &amp; Records
                  </Link>
                </li>
              </ul>
            </div>

            {/* SERVICES */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#101512]">
                Key Specialties
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/services" className="hover:text-[#173F30] transition-colors">
                    Primary Care & Family Medicine
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-[#173F30] transition-colors">
                    Cardiovascular Health
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-[#173F30] transition-colors">
                    Pediatric & Child Care
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-[#173F30] transition-colors">
                    Neurology & Migraine Clinic
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-[#173F30] transition-colors">
                    Diagnostic Ultrasound & Labs
                  </Link>
                </li>
              </ul>
            </div>

            {/* CONTACT & CLINIC HOURS */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#101512]">
                Clinic Contact
              </h4>
              <div className="space-y-2.5 text-sm text-[#777D79]">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#173F30] shrink-0" />
                  <a href="mailto:care@carepointclinic.com" className="hover:text-[#101512] transition-colors">
                    care@carepointclinic.com
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#173F30] shrink-0" />
                  <a href="tel:+18002892273" className="hover:text-[#101512] transition-colors">
                    +1 (800) 289-2273
                  </a>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#173F30] shrink-0 mt-0.5" />
                  <span className="text-xs">
                    450 Medical Heights Blvd, Suite 300, Boston, MA 02115
                  </span>
                </div>
                <div className="flex items-start gap-2.5 pt-1">
                  <Clock className="w-4 h-4 text-[#173F30] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-semibold text-[#101512]">Hours:</p>
                    <p>Mon – Sat: 8:00 AM – 7:00 PM</p>
                    <p>Sun: Urgent Care & Telehealth Only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT & LEGAL MODAL TRIGGERS */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777D79]">
            <p>&copy; {new Date().getFullYear()} CarePoint Clinic. All rights reserved.</p>

            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-[#101512] underline-offset-4 hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
              <span>&bull;</span>
              <Link
                href="/terms"
                className="hover:text-[#101512] underline-offset-4 hover:underline transition-colors"
              >
                Terms of Use
              </Link>
              <span>&bull;</span>
              <Link
                href="/security"
                className="flex items-center gap-1.5 text-[#173F30] font-medium hover:underline transition-colors"
              >
                <Shield className="w-3.5 h-3.5" /> Security Checklist &bull; HIPAA Compliant
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </>
  )
}
