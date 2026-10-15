"use client"

import { CalendarClock, ShieldCheck, HeartPulse, CheckCircle2, Clock, Check } from "lucide-react"

export function FeaturesClient() {
  const features = [
    { 
      icon: CalendarClock, 
      title: "Real-Time Slot Reservation", 
      desc: "Our platform synchronizes directly with clinical schedules. When you select an appointment slot, it is reserved exclusively for 10 minutes, eliminating double-bookings and ensuring your selected time is protected while you complete your intake.",
      bullets: ["Zero double bookings", "Live 10-minute hold countdown", "Instant appointment confirmation"],
      preview: (
        <div className="p-6 bg-card rounded-2xl border border-border space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-sm font-semibold text-foreground">Available Time Slots</span>
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> 09:48 Remaining
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-border bg-surface text-muted-foreground text-center">
              09:30 AM • Taken
            </div>
            <div className="p-2.5 rounded-lg border-2 border-primary bg-primary/10 text-primary font-bold text-center">
              10:00 AM • Selected
            </div>
            <div className="p-2.5 rounded-lg border border-border bg-card text-foreground text-center font-medium">
              10:30 AM • Available
            </div>
            <div className="p-2.5 rounded-lg border border-border bg-card text-foreground text-center font-medium">
              11:00 AM • Available
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Status: Slot reserved exclusively for patient session.
          </p>
        </div>
      )
    },
    { 
      icon: ShieldCheck, 
      title: "Doctor Credential Screening", 
      desc: "Practitioners on SlotUrSelf submit their medical registration numbers, medical degrees, and clinic affiliations for review prior to account approval and public booking.",
      bullets: ["Registration number verification", "Affiliated clinic confirmation", "Transparent consultation fees"],
      preview: (
        <div className="p-6 bg-card rounded-2xl border border-border space-y-4 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shrink-0">
              Dr
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-foreground">Dr. Sarah Jenkins</span>
                <span className="inline-flex items-center gap-0.5 text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-xs text-muted-foreground">MBBS, MD • General Medicine</p>
              <p className="text-xs text-muted-foreground">Reg No: MCI-2018-84920</p>
            </div>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Experience: 11 years</span>
            <span className="font-semibold text-foreground">Fee: ₹500</span>
          </div>
        </div>
      )
    },
    { 
      icon: HeartPulse, 
      title: "Clinical Intake & Department Routing", 
      desc: "Unsure which physician to consult? Our symptom analysis reviews patient concerns and maps them to the appropriate medical department without replacing professional diagnosis.",
      bullets: ["Intelligent symptom analysis", "Specialty classification", "Immediate emergency escalation"],
      preview: (
        <div className="p-6 bg-card rounded-2xl border border-border space-y-3 shadow-xs">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Patient Intake Triaged
          </div>
          <div className="p-3 bg-surface rounded-xl border border-border text-xs text-foreground italic">
            &ldquo;Sharp pain in lower right abdomen that started 4 hours ago.&rdquo;
          </div>
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 space-y-1">
            <div className="text-xs font-bold text-primary">Recommended: General Surgery / Gastroenterology</div>
            <p className="text-[11px] text-muted-foreground">
              Prioritized clinical intake with immediate doctor notification.
            </p>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-24">
      {features.map((feature, idx) => (
        <div 
          key={idx}
          className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Functional UI Preview */}
          <div className="flex-1 w-full max-w-lg">
            {feature.preview}
          </div>

          {/* Feature Description */}
          <div className="flex-1 w-full space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <feature.icon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{feature.title}</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              {feature.desc}
            </p>
            <ul className="space-y-2.5 pt-2">
              {feature.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-center gap-2.5 text-sm text-foreground font-medium">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
