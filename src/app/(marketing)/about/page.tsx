import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn how SlotUrSelf is modernizing healthcare access by eliminating the waiting room through real-time verified clinical scheduling.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us",
    description: "Learn how SlotUrSelf is modernizing healthcare access by eliminating the waiting room through real-time verified clinical scheduling.",
    url: "/about",
  },
}

export default function AboutPage() {
  const commitments = [
    {
      title: "Doctor Credential Screening",
      desc: "Every healthcare provider on our platform submits registration numbers and clinical credentials for review prior to account activation."
    },
    {
      title: "Reserved Slot Holding",
      desc: "Slots synchronize directly with clinic schedules. Selecting a slot reserves it for 10 minutes, eliminating duplicate bookings and awkward waiting room reschedules."
    },
    {
      title: "Reduced Waiting Times",
      desc: "Digital queue tokens and real-time appointment confirmations let you arrive on time and proceed smoothly to your consultation."
    },
    {
      title: "Strict Patient Data Privacy",
      desc: "Your consultations, medical notes, and personal details are safeguarded with role-based access control, accessible only to you and your attending healthcare provider."
    }
  ]

  return (
    <div className="min-h-screen pt-8 sm:pt-12 pb-16 sm:pb-24 bg-background text-foreground">
      <div className="site-container">
        <Breadcrumbs items={[{ label: "About Us" }]} className="mb-6 sm:mb-8" />

        <div className="max-w-3xl mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3 sm:mb-4">
            Direct clinic appointments. <br />
            Zero waiting rooms.
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            SlotUrSelf was built to replace unconfirmed phone calls, ambiguous doctor schedules, and crowded waiting rooms with verified, real-time medical scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 sm:mb-16">
          {commitments.map((item, i) => (
            <div key={i} className="p-6 sm:p-7 rounded-2xl bg-card border border-border flex flex-col justify-between h-full space-y-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Standard #{i + 1}</span>
                </div>
                <h2 className="text-lg font-bold text-foreground">{item.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Card */}
        <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Ready to consult a doctor?</h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Find verified clinics near you and reserve your time slot in seconds.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-11 px-6 rounded-xl">
              <Link href="/appointments/new">
                Book Appointment
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-border text-foreground hover:bg-surface-elevated font-semibold h-11 px-6 rounded-xl">
              <Link href="/departments">
                View Clinics
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
