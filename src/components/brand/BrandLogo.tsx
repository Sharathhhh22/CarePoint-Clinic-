import React from "react"
import Link from "next/link"

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  size?: number
}

/**
 * Concept A: "The Precision Cross & Slot"
 * A modern geometric Swiss clinical cross with an interlocking time-slot contour.
 * Left half in surgical teal (medicine/care), right half in deep slate/navy (time slot & scheduling).
 */
export function BrandIcon({ className = "w-6 h-6", size, ...props }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      {/* Left Teal Clinic Segment */}
      <path
        d="M 18 6 
           H 8 
           C 6.895 6 6 6.895 6 8 
           V 18 
           H 8 
           M 6 18 
           H 2 
           C 0.895 18 0 18.895 0 20 
           V 28 
           C 0 29.105 0.895 30 2 30 
           H 14 
           C 15.105 30 16 30.895 16 32 
           V 44 
           C 16 45.105 16.895 46 18 46 
           H 26 
           C 27.105 46 28 45.105 28 44 
           V 34"
        style={{ display: "none" }}
      />
      {/* Precision Geometric Paths: Scaled 48x48 */}
      <g transform="translate(1, 1)">
        {/* Left / Upper Clinical Care Arm (Surgical Teal) */}
        <path
          d="M 17 4 
             H 10 
             C 7.79 4 6 5.79 6 8 
             V 17 
             H 2 
             C 0.895 17 0 17.895 0 19 
             V 27 
             C 0 28.105 0.895 29 2 29 
             H 9 
             C 10.657 29 12 30.343 12 32 
             V 34 
             C 12 35.657 12.8 38 14 40
             C 15.5 42.5 17.5 44 20 44
             H 22
             C 20 40 18 35 18 30
             C 18 24 22 20 22 14
             C 22 9 19.5 5.5 17 4 Z"
          className="fill-primary"
        />

        {/* Right / Calendar Slot Arm (Deep Slate / Navy / Adaptive Foreground) */}
        <path
          d="M 23 4
             C 25.5 5.5 28 9 28 14
             C 28 20 24 24 24 30
             C 24 35 26 40 28 44
             H 36
             C 38.21 44 40 42.21 40 40
             V 29
             H 44
             C 45.105 29 46 28.105 46 27
             V 19
             C 46 17.895 45.105 17 44 17
             H 37
             C 35.343 17 34 15.657 34 14
             V 8
             C 34 5.79 32.21 4 30 4
             H 23 Z"
          className="fill-foreground/90 dark:fill-foreground"
        />

        {/* Appointment Notch / Calendar Slot Pin */}
        <path
          d="M 37 8 H 40 C 41.1 8 42 8.9 42 10 V 13 C 42 14.1 41.1 15 40 15 H 37 V 8 Z"
          className="fill-primary"
        />
        <circle cx="39.5" cy="11.5" r="1.5" className="fill-background" />
      </g>
    </svg>
  )
}

/**
 * High-clarity Clean Vector Mark matching Concept A: "The Precision Cross & Slot"
 * Surgical Teal + Navy/Slate with interlocking calendar time-slot geometry.
 */
export function BrandMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background Squircle container with subtle healthcare border */}
      <rect 
        x="0.75" 
        y="0.75" 
        width="46.5" 
        height="46.5" 
        rx="12" 
        className="fill-primary/10 dark:fill-primary/20 stroke-primary/30" 
        strokeWidth="1.5" 
      />

      {/* CONCEPT A: Precision Clinical Cross with Time-Slot Notch */}
      <g transform="translate(6, 6)">
        {/* Left Clinical Care Arm (Surgical Teal) */}
        <path
          d="M 12 3
             H 6
             C 4.34 3 3 4.34 3 6
             V 12
             H 2
             C 0.9 12 0 12.9 0 14
             V 22
             C 0 23.1 0.9 24 2 24
             H 6
             C 7.66 24 9 25.34 9 27
             V 30
             C 9 31.66 10.34 33 12 33
             H 16
             C 14 27 12 21 14 15
             C 15 10 14 5 12 3 Z"
          className="fill-primary"
        />

        {/* Right Time-Slot Arm (Deep Slate in light mode / Crisp Slate in dark mode) */}
        <path
          d="M 17 3
             C 19 8 18 13 17 18
             C 16 23 18 28 20 33
             H 24
             C 25.66 33 27 31.66 27 30
             V 24
             H 34
             C 35.1 24 36 23.1 36 22
             V 14
             C 36 12.9 35.1 12 34 12
             H 27
             V 6
             C 27 4.34 25.66 3 24 3
             H 17 Z"
          className="fill-slate-900 dark:fill-slate-100"
        />

        {/* Central Interlocking Slot Groove */}
        <path
          d="M 14.5 3.5 C 16.5 8.5 15.5 13.5 14.5 18 C 13.5 23 15.5 28 17.5 32.5"
          className="stroke-background"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Calendar / Slot Reservation Pin on Upper-Right Cross Shoulder */}
        <path
          d="M 28 6 H 32 C 32.55 6 33 6.45 33 7 V 10 C 33 10.55 32.55 11 32 11 H 28 Z"
          className="fill-primary"
        />
        <circle cx="30.5" cy="8.5" r="1" className="fill-background" />
      </g>
    </svg>
  )
}

interface BrandLogoProps {
  className?: string
  showText?: boolean
  iconSize?: string
  textClassName?: string
  href?: string
}

export function BrandLogo({
  className = "",
  showText = true,
  iconSize = "w-8 h-8",
  textClassName = "text-xl font-bold tracking-tight text-foreground",
  href = "/",
}: BrandLogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-lg p-0.5 ${className}`}>
      <div className={`${iconSize} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}>
        <BrandMark className="w-full h-full" />
      </div>
      {showText && (
        <span className={textClassName}>
          Slot<span className="text-primary font-extrabold">Ur</span>Self
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label="SlotUrSelf Home">
        {content}
      </Link>
    )
  }

  return content
}
