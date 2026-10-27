"use client"

import React, { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true })
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="back-to-top no-print fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 animate-in fade-in zoom-in-90 duration-200"
      aria-label="Back to top of page"
      title="Back to top"
    >
      <ArrowUp className="w-5 h-5 text-primary-foreground group-hover:-translate-y-0.5 transition-transform duration-200" />
    </button>
  )
}
