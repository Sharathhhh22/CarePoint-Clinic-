"use client"

import React from "react"
import Link from "next/link"

interface CareNovaLogoProps {
  className?: string
  showText?: boolean
  iconSize?: string
  textClassName?: string
  href?: string
}

/**
 * Original Botanical + Healthcare Emblem for CareNova Clinic.
 * Features an organic sprouting leaf harmoniously entwined with a clinical cross.
 * Styled in CareNova's signature Deep Forest Green (#173F30) and Muted Sage (#A9C2B2).
 */
export function CareNovaMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
        aria-hidden="true"
      >
        {/* Soft pale green squircle background */}
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="11"
          fill="#E7EEE8"
          stroke="#E0E4DF"
          strokeWidth="1"
        />

        {/* Botanical stem and leaf curve */}
        <path
          d="M12 28C13.5 21 18 15 26 12C26 18 22 24 15 27"
          stroke="#A9C2B2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Clinical cross harmonious nodes */}
        {/* Vertical beam */}
        <rect
          x="18"
          y="11"
          width="4"
          height="18"
          rx="2"
          fill="#173F30"
        />
        {/* Horizontal beam */}
        <rect
          x="11"
          y="18"
          width="18"
          height="4"
          rx="2"
          fill="#173F30"
        />

        {/* Botanical sprout tip */}
        <circle
          cx="26"
          cy="12"
          r="2.5"
          fill="#A9C2B2"
        />
      </svg>
    </div>
  )
}

export function CareNovaLogo({
  className = "",
  showText = true,
  iconSize = "w-9 h-9",
  textClassName = "text-xl font-bold tracking-tight text-[#101512]",
  href = "/",
}: CareNovaLogoProps) {
  const content = (
    <div className={`inline-flex items-center gap-2.5 group focus:outline-hidden focus:ring-2 focus:ring-[#173F30]/40 rounded-lg p-0.5 transition-transform duration-200 ${className}`}>
      <div className={`${iconSize} transition-transform duration-200 group-hover:scale-105 shrink-0`}>
        <CareNovaMark className="w-full h-full" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={textClassName}>
            CarePoint <span className="font-medium text-[#777D79] text-sm ml-0.5">Clinic</span>
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label="CarePoint Clinic Homepage">
        {content}
      </Link>
    )
  }

  return content
}
