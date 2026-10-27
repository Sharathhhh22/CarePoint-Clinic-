"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { Search, CalendarCheck, CreditCard, Stethoscope, ArrowRight } from "lucide-react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

export function HowItWorksClient() {
  const steps = [
    { 
      number: "01",
      title: "Find Your Specialist", 
      desc: "Search verified clinics and doctors by specialty, qualification, and location. See consultation fees and available dates immediately.",
      icon: Search
    },
    { 
      number: "02",
      title: "Select an Open Slot", 
      desc: "View actual consultation hours synchronized directly with the clinic calendar. Your selected slot is held exclusively for 10 minutes.",
      icon: CalendarCheck
    },
    { 
      number: "03",
      title: "Confirm with Flexible Payment", 
      desc: "Confirm your visit instantly. Pay securely online or choose to pay in cash or card directly at the clinic reception desk.",
      icon: CreditCard
    },
    { 
      number: "04",
      title: "Skip the Waiting Line", 
      desc: "Arrive 10 minutes prior to your time, display your digital pass or QR token at reception, and proceed directly to your consultation.",
      icon: Stethoscope
    }
  ]

  return (
    <div className="space-y-12 sm:space-y-16">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {steps.map((step) => (
          <motion.div 
            key={step.number}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 sm:p-7 rounded-2xl bg-card border border-border flex flex-col justify-between space-y-4 shadow-2xs hover:border-primary/50 hover:shadow-sm transition-colors min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-full">
                  STEP {step.number}
                </span>
                <div className="w-9 h-9 rounded-lg bg-surface text-foreground border border-border flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-foreground">{step.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-center bg-surface border border-border p-8 sm:p-12 rounded-2xl shadow-xs"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to skip the clinic waiting room?</h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-6">
          Create an account to book appointments, manage family medical records, and receive instant digital passes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link 
            href="/appointments/new" 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3.5 rounded-xl text-base font-semibold transition-colors shadow-xs"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/signup" 
            className="w-full sm:w-auto inline-flex items-center justify-center bg-card hover:bg-surface-elevated text-foreground border border-border px-8 py-3.5 rounded-xl text-base font-semibold transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
