import Link from "next/link"
import { Building2, ShieldCheck, Clock, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "About Us",
  description: "Learn how APPOINTLY is modernizing healthcare access by eliminating the waiting room through real-time verified clinical scheduling.",
}

export default function AboutPage() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Verified Practitioners Only",
      desc: "Every clinic and physician on our platform undergoes strict medical licensing verification and credential reviews."
    },
    {
      icon: Clock,
      title: "Real-Time Slot Locking",
      desc: "Slots sync directly with clinical scheduling systems. When you lock a slot, it is reserved atomically to eliminate double-bookings."
    },
    {
      icon: Building2,
      title: "Zero Waiting Rooms",
      desc: "Digital passes and live countdown notifications ensure you arrive precisely when your physician is ready to consult."
    }
  ]

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-white dark:bg-slate-950">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            About APPOINTLY
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            We are on a mission to eliminate the traditional medical waiting room through real-time, verified clinical scheduling.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 mb-16 leading-relaxed">
          <p className="mb-6">
            The traditional process of booking a medical visit is frustrating. It involves repetitive phone calls, unconfirmed schedules, and showing up at a clinic only to wait an hour in a crowded room.
          </p>
          <p>
            APPOINTLY connects patients directly to verified healthcare providers. Through intelligent symptom analysis, spatial clinic matching, and atomic slot holds, patients receive seamless access to the care they need without delays.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((v, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center mb-6">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-teal-600 text-white rounded-2xl p-10 md:p-12 text-center shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to experience frictionless care?</h2>
          <p className="text-teal-50 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Find the right clinical specialist near you and book your consultation in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-teal-900 hover:bg-slate-100 font-semibold h-11 px-6">
              <Link href="/appointments/new">
                Book an Appointment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-teal-400 text-white hover:bg-teal-700 font-medium h-11 px-6">
              <Link href="/departments">
                Browse Specialists
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
