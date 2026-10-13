"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Search, CalendarCheck, CreditCard, Stethoscope } from "lucide-react"

export function HowItWorksClient() {
  const steps = [
    { 
      title: "Find Your Specialist", 
      desc: "Use our intelligent search to find clinics, doctors, or specific specialties near your location. Filter by availability, rating, or gender.",
      icon: Search
    },
    { 
      title: "Select a Time Slot", 
      desc: "View the doctor's actual calendar in real-time. Pick a slot that works for your schedule. No guessing, no waiting on hold.",
      icon: CalendarCheck
    },
    { 
      title: "Secure Your Booking", 
      desc: "Confirm your appointment instantly. Choose whether you want to pay securely online right now, or pay later when you arrive at the clinic.",
      icon: CreditCard
    },
    { 
      title: "Get Better", 
      desc: "Show up at your scheduled time, show your digital pass to skip the registration line, and get the care you need.",
      icon: Stethoscope
    }
  ]

  return (
    <>
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2" />
        
        <div className="space-y-16">
          {steps.map((step, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              key={idx} 
              className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Content Side */}
              <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${idx % 2 === 0 ? 'md:text-right md:pr-16' : 'md:pl-16'}`}>
                <h2 className="text-2xl font-bold text-foreground mb-3">{step.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{step.desc}</p>
              </div>

              {/* Center Icon */}
              <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-16 h-16 bg-primary text-primary-foreground rounded-full border-4 border-background flex items-center justify-center z-10 shadow-sm">
                <step.icon className="w-7 h-7" />
              </div>
              
              {/* Empty Side for balancing */}
              <div className="hidden md:block w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-32 text-center bg-card border border-border p-12 rounded-3xl shadow-sm">
        <h2 className="text-3xl font-bold text-foreground mb-6">Ready to skip the waiting room?</h2>
        <Link 
          href="/signup" 
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-sm"
        >
          Create Your Account
        </Link>
      </div>
    </>
  )
}
