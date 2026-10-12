"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { HealthcareChatbot } from "@/components/chat/HealthcareChatbot"

export function FeaturesOverlay() {
  const [showScroll, setShowScroll] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showCookie, setShowCookie] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check cookie consent safely
    try {
      if (!localStorage.getItem("cookieConsent")) {
        const timer = setTimeout(() => setShowCookie(true), 2000)
        return () => clearTimeout(timer)
      }
    } catch (e) {
      // Storage access blocked or restricted
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = ((totalScroll / windowHeight) * 100).toString()
      setScrollProgress(Number(scroll))

      if (totalScroll > 300) {
        setShowScroll(true)
      } else {
        setShowScroll(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const acceptCookies = () => {
    try {
      localStorage.setItem("cookieConsent", "true")
    } catch (e) {}
    setShowCookie(false)
  }

  if (!isClient) return null

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent">
        <div 
          className="h-full bg-primary transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button (Positioned above floating chat) */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-40 p-3 bg-card border border-border shadow-lg rounded-full text-foreground hover:text-primary hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Global Healthcare AI Chatbot */}
      <HealthcareChatbot />

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookie && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-24 md:left-auto md:right-32 md:max-w-sm z-40 bg-surface text-foreground p-4 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-4 justify-between border border-border"
          >
            <p className="text-sm text-muted-foreground leading-tight">
              We use strictly necessary cookies to keep you logged in. No tracking.
            </p>
            <div className="flex gap-2 shrink-0">
              <button 
                onClick={acceptCookies}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors whitespace-nowrap"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
