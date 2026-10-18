"use client"

import React, { useState, useEffect, useRef } from "react"

interface AnimatedStatsCounterProps {
  target: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  label: string
  subtext?: string
  className?: string
}

export function AnimatedStatsCounter({
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1800,
  label,
  subtext,
  className = "",
}: AnimatedStatsCounterProps) {
  const [currentValue, setCurrentValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    // Reduced-motion check
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      setCurrentValue(target)
      setHasAnimated(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          observer.disconnect()

          let startTime: number | null = null
          const startVal = 0

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

            // Smooth easeOutCubic curve: 1 - pow(1 - progress, 3)
            const easeProgress = 1 - Math.pow(1 - progress, 3)
            const val = startVal + (target - startVal) * easeProgress

            setCurrentValue(val)

            if (progress < 1) {
              requestAnimationFrame(step)
            } else {
              setCurrentValue(target)
            }
          }

          requestAnimationFrame(step)
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)

    return () => observer.disconnect()
  }, [target, duration, hasAnimated])

  const formattedNumber = currentValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  const fullDisplay = `${prefix}${formattedNumber}${suffix}`
  const accessibleTarget = `${prefix}${target.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix} ${label}`

  return (
    <div
      ref={elementRef}
      className={`flex flex-col ${className}`}
      aria-label={accessibleTarget}
    >
      <div className="flex items-baseline gap-0.5">
        <span
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#173F30] dark:text-[#A9C2B2] font-tabular-nums"
          aria-hidden="true"
        >
          {prefix}
          {formattedNumber}
          {suffix}
        </span>
      </div>
      <p className="text-xs sm:text-sm font-semibold text-[#101512] dark:text-[#EAEFEA] mt-1">
        {label}
      </p>
      {subtext && (
        <p className="text-[11px] text-[#777D79] dark:text-[#9BAAA0] mt-0.5 leading-tight">
          {subtext}
        </p>
      )}
    </div>
  )
}
