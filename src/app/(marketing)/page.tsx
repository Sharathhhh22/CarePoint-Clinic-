"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, MapPin, Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main id="main-content" className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-background pt-16 pb-20 sm:pt-28 sm:pb-28 lg:pt-36 lg:pb-44 border-b border-border">
          {/* Subtle Enterprise Background Pattern */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" 
            style={{ backgroundImage: 'radial-gradient(#14b8a6 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
          />
          
          <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col items-center text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 max-w-4xl leading-[1.15]"
            >
              Skip the waiting room. <br />
              <span className="text-primary">
                Book doctors instantly.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl leading-relaxed px-2"
            >
              The enterprise healthcare platform connecting patients directly with verified specialists. Real-time availability, secure booking, and zero hold music.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center w-full sm:w-auto px-4 sm:px-0"
            >
              <Link 
                href="/signup" 
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-3.5 min-h-[48px] rounded-xl flex items-center justify-center transition-all text-base sm:text-lg shadow-sm active:scale-[0.99] w-full sm:w-auto"
              >
                Create Free Account
              </Link>
              <Link 
                href="/how-it-works" 
                className="bg-card hover:bg-surface-elevated text-foreground font-semibold px-8 py-3.5 min-h-[48px] rounded-xl flex items-center justify-center transition-all text-base sm:text-lg border border-border shadow-sm active:scale-[0.99] w-full sm:w-auto"
              >
                See How It Works
              </Link>
            </motion.div>
          </div>
        </section>

        {/* QUICK FEATURES PREVIEW */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3 sm:mb-6">Healthcare on your terms.</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">Everything you need to manage your health, seamlessly connected in one intelligent platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 sm:mb-6">
                  <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">Real-time scheduling</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">See exactly when doctors are available and book your slot instantly. No more waiting on hold.</p>
              </div>
              
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 sm:mb-6">
                  <Search className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">Verified specialists</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Every doctor on our platform is thoroughly vetted. See verified credentials and specialties.</p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 sm:mb-6">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">Location-based matching</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Find the best care near you. Filter by insurance, distance, and specific medical conditions.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
