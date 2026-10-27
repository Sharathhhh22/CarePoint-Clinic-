"use client"

import React, { useState, useEffect } from "react"

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 100
        setScrollProgress(Math.min(100, Math.max(0, progress)))
      } else {
        setScrollProgress(0)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (scrollProgress <= 0) return null

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="scroll-progress-bar no-print fixed top-0 left-0 right-0 h-[3px] z-[999] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-teal-700 via-primary to-teal-400 dark:from-teal-400 dark:via-primary dark:to-emerald-300 transition-[width] duration-100 ease-out shadow-[0_0_8px_rgba(13,148,136,0.4)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}
