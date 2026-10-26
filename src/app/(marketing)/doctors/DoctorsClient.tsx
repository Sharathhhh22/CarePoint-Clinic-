"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ArrowRight, User, Calendar, GraduationCap, CheckCircle2 } from "lucide-react"
import { Button, ButtonGroup } from "@/components/ui/Button"
import { CarePointDoctorBioModal } from "@/components/carenova/CarePointDoctorBioModal"
import { openBookingModal } from "@/lib/booking-events"

interface Doctor {
  name: string
  role: string
  specialty: string
  qualification: string
  focus: string
  image: string
  availability: string
}

const DOCTORS: Doctor[] = [
  {
    name: "Dr. Sara Khan, MD",
    role: "Lead Family Physician",
    specialty: "Family Medicine",
    qualification: "Harvard Medical School • 14 Yrs Experience",
    focus: "Preventive medicine, hypertension management, adult annual wellness",
    image: "/images/carenova/dr-sara-khan.jpg",
    availability: "Mon, Wed, Fri",
  },
  {
    name: "Dr. Marcus Vance, MD, FACC",
    role: "Senior Consultant Cardiologist",
    specialty: "Cardiology",
    qualification: "Johns Hopkins • Board Certified Cardiology",
    focus: "Echocardiography, lipid management, arrhythmia evaluations",
    image: "/images/carenova/dr-marcus-vance.jpg",
    availability: "Tue, Thu, Sat",
  },
  {
    name: "Dr. Elena Rostova, MD, FAAP",
    role: "Chief of Pediatric Medicine",
    specialty: "Pediatrics",
    qualification: "Stanford Medicine • Pediatric Fellow",
    focus: "Child development, adolescent medicine, pediatric asthma care",
    image: "/images/carenova/dr-elena-rostova.jpg",
    availability: "Mon, Tue, Thu",
  },
  {
    name: "Dr. Anita Chen, MD, PhD",
    role: "Consultant Neurologist",
    specialty: "Neurology",
    qualification: "Columbia University • Neurology Fellowship",
    focus: "Refractory migraines, peripheral neuropathy, cognitive health",
    image: "/images/carenova/dr-anita-chen.jpg",
    availability: "Wed, Thu, Fri",
  },
]

const SPECIALTIES = ["All Specialties", "Family Medicine", "Cardiology", "Pediatrics", "Neurology"]

export function DoctorsClient() {
  const [activeSpecialty, setActiveSpecialty] = useState("All Specialties")
  const [selectedBioDoctor, setSelectedBioDoctor] = useState<string | null>(null)

  const filtered =
    activeSpecialty === "All Specialties"
      ? DOCTORS
      : DOCTORS.filter((d) => d.specialty === activeSpecialty)

  return (
    <div>
      {/* Specialty Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[#E0E4DF]">
        {SPECIALTIES.map((spec) => (
          <button
            key={spec}
            onClick={() => setActiveSpecialty(spec)}
            className={`min-h-11 px-4 py-2.5 inline-flex items-center justify-center rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSpecialty === spec
                ? "bg-[#173F30] text-white shadow-xs"
                : "bg-white text-[#777D79] border border-[#E0E4DF] hover:text-[#101512] hover:bg-[#E7EEE8]"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((doc) => (
          <div
            key={doc.name}
            className="card-grid-item h-full bg-white rounded-3xl overflow-hidden border border-[#E0E4DF] hover:border-[#173F30]/40 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
          >
            <div>
              <div
                onClick={() => setSelectedBioDoctor(doc.name)}
                className="relative aspect-[4/4.5] w-full bg-[#E7EEE8] overflow-hidden cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`View clinical profile of ${doc.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedBioDoctor(doc.name)
                }}
              >
                <Image
                  src={doc.image}
                  alt={`${doc.name}, ${doc.role}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#173F30] border border-[#E0E4DF] shadow-xs">
                  {doc.availability}
                </div>
              </div>

              <div className="p-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#173F30] bg-[#E7EEE8] px-2.5 py-0.5 rounded-full inline-block mb-1">
                  {doc.specialty}
                </span>
                <h3
                  onClick={() => setSelectedBioDoctor(doc.name)}
                  className="text-lg font-bold text-[#101512] mt-1 mb-1 hover:text-[#173F30] cursor-pointer transition-colors"
                >
                  {doc.name}
                </h3>
                <p className="text-xs text-[#777D79] font-medium mb-2">{doc.qualification}</p>
                <p className="text-xs text-[#777D79] leading-relaxed">{doc.focus}</p>
              </div>
            </div>

            <div className="p-5 pt-0 space-y-2 mt-auto">
              <Button
                onClick={() => openBookingModal({ doctor: doc.name })}
                variant="primary"
                size="sm"
                fullWidth
                className="rounded-full shadow-xs hover:shadow-sm"
              >
                <span>Book Consultation</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                onClick={() => setSelectedBioDoctor(doc.name)}
                variant="ghost"
                size="sm"
                fullWidth
                className="text-xs font-medium text-[#777D79] hover:text-[#173F30] rounded-full"
              >
                <User className="size-3.5 text-[#173F30]" aria-hidden="true" />
                <span>View Credentials &amp; Bio</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Bio Modal */}
      {selectedBioDoctor && (
        <CarePointDoctorBioModal
          isOpen={true}
          onClose={() => setSelectedBioDoctor(null)}
          doctorName={selectedBioDoctor}
          onBookDoctor={(doc) => {
            setSelectedBioDoctor(null)
            openBookingModal({ doctor: doc })
          }}
        />
      )}
    </div>
  )
}
