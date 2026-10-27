"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, type Variants } from "framer-motion"
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  QrCode,
  Stethoscope,
  Baby,
  Heart,
  Sparkles,
  Bone,
  Smile
} from "lucide-react"
import { Button } from "@/components/ui/Button"

// Animation variant configurations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
}

const cardItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const specialties = [
    { name: "General Medicine", focus: "Primary Care & Checkups", icon: Stethoscope },
    { name: "Pediatrics", focus: "Child & Infant Care", icon: Baby },
    { name: "Cardiology", focus: "Heart & Vascular Health", icon: Heart },
    { name: "Dermatology", focus: "Skin & Allergy Care", icon: Sparkles },
    { name: "Orthopedics", focus: "Bones, Joints & Spine", icon: Bone },
    { name: "Dental Surgery", focus: "Oral Health & Care", icon: Smile },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/departments?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/departments')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main id="main-content" className="flex-1">
        
        {/* HERO SECTION - Crisp, High-Contrast, Instant Rendering with Entrance Animation */}
        <section className="bg-background pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border overflow-hidden">
          <div className="site-container flex flex-col items-center text-center">
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 max-w-4xl leading-[1.15]"
            >
              Skip the waiting room. <br />
              <span className="text-primary">
                Book your clinic appointment instantly.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed"
            >
              Find verified doctors in your neighborhood, view actual available time slots, and receive your digital queue pass with zero waiting on hold.
            </motion.p>

            {/* QUICK SEARCH CONSOLE */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onSubmit={handleSearch} 
              className="w-full max-w-2xl mb-8"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-card rounded-2xl border border-border shadow-xs hover:border-primary/40 transition-colors">
                <div className="flex items-center gap-3 w-full px-3 py-2 text-muted-foreground">
                  <Search className="w-5 h-5 shrink-0 text-primary" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor name, specialty, or clinic..."
                    className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-hidden"
                  />
                </div>
                <Button
                  type="submit"
                  size="default"
                  className="w-full sm:w-auto shrink-0 font-semibold"
                >
                  Find Doctors
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.form>

            {/* TRUST SIGNALS */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.3 }
                }
              }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-muted-foreground"
            >
              <motion.span variants={fadeInUp} className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                Verified Doctor Credentials
              </motion.span>
              <motion.span variants={fadeInUp} className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                10-Minute Hold Guarantee
              </motion.span>
              <motion.span variants={fadeInUp} className="flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-primary shrink-0" />
                Instant Digital Clinic Token
              </motion.span>
              <motion.span variants={fadeInUp} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                Transparent Clinic Pricing
              </motion.span>
            </motion.div>
          </div>
        </section>

        {/* SPECIALTIES DIRECTORY - Scroll Reveal Animation */}
        <section className="py-14 sm:py-20 bg-surface border-b border-border overflow-hidden">
          <div className="site-container">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Browse by Specialty
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Connect with vetted healthcare providers across major clinical fields.
                </p>
              </div>
              <Link 
                href="/departments" 
                className="text-primary hover:text-primary-hover font-semibold text-sm flex items-center gap-1 group"
              >
                <span>View all departments</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
            >
              {specialties.map((spec) => {
                const IconComponent = spec.icon
                return (
                  <motion.div
                    key={spec.name}
                    variants={cardItem}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Link
                      href={`/departments?specialty=${encodeURIComponent(spec.name)}`}
                      className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors flex flex-col items-center text-center group h-full justify-between shadow-2xs hover:shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {spec.name}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {spec.focus}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* HOW PATIENT VISITS WORK - Scroll Reveal with Staggered Steps */}
        <section className="py-14 sm:py-20 bg-background overflow-hidden">
          <div className="site-container">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
                How SlotUrSelf Works
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Three straightforward steps from booking to your consultation.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              
              <motion.div 
                variants={cardItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between h-full space-y-3 shadow-2xs hover:border-primary/50 hover:shadow-sm transition-colors"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-base shrink-0">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Select Doctor & Time</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Browse doctors by specialty, qualification, and distance. Check real calendar availability for today or upcoming days.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                variants={cardItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between h-full space-y-3 shadow-2xs hover:border-primary/50 hover:shadow-sm transition-colors"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-base shrink-0">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-foreground">10-Minute Slot Hold</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    When you pick a slot, it is reserved exclusively for 10 minutes so no one else can take it while you complete your details.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                variants={cardItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between h-full space-y-3 shadow-2xs hover:border-primary/50 hover:shadow-sm transition-colors"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-base shrink-0">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Instant Queue Pass</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Receive your confirmed token number and digital clinic pass immediately on screen. Arrive 10 minutes before your slot to check in smoothly.
                  </p>
                </div>
              </motion.div>

            </motion.div>

            {/* CALL TO ACTION - Scroll Reveal */}
            <motion.div 
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 p-8 sm:p-10 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Need to see a doctor today?</h3>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">Book directly without phone calls or unexpected wait times.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                <Button asChild className="w-full sm:w-auto font-semibold shadow-xs">
                  <Link href="/appointments/new">
                    Book Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto font-semibold">
                  <Link href="/signup">
                    Create Account
                  </Link>
                </Button>
              </div>
            </motion.div>

          </div>
        </section>

      </main>
    </div>
  )
}
