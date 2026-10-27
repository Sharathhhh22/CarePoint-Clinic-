"use client"

import { useEffect } from "react"
import { useSearchParams, usePathname } from "next/navigation"

export interface CarePointUtmPayload {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid?: string
  fbclid?: string
  landing_page: string
  referrer: string
  captured_at: string
}

const STORAGE_KEY = "sloturself_utm_analytics"

export function getStoredUtmParams(): CarePointUtmPayload | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CarePointUtmPayload
  } catch {
    return null
  }
}

export function UtmTracker() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const source = searchParams.get("utm_source")
      const medium = searchParams.get("utm_medium")
      const campaign = searchParams.get("utm_campaign")
      const term = searchParams.get("utm_term")
      const content = searchParams.get("utm_content")
      const gclid = searchParams.get("gclid")
      const fbclid = searchParams.get("fbclid")

      const hasMarketingParams =
        source || medium || campaign || term || content || gclid || fbclid

      // If marketing parameters exist in current URL, record them
      if (hasMarketingParams) {
        const payload: CarePointUtmPayload = {
          utm_source: source || undefined,
          utm_medium: medium || undefined,
          utm_campaign: campaign || undefined,
          utm_term: term || undefined,
          utm_content: content || undefined,
          gclid: gclid || undefined,
          fbclid: fbclid || undefined,
          landing_page: `${pathname}${window.location.search}`,
          referrer: document.referrer || "direct",
          captured_at: new Date().toISOString(),
        }

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      } else {
        // If nothing in session yet, record organic / direct landing page for context
        const existing = sessionStorage.getItem(STORAGE_KEY)
        if (!existing) {
          const payload: CarePointUtmPayload = {
            landing_page: pathname,
            referrer: document.referrer || "direct",
            captured_at: new Date().toISOString(),
          }
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        }
      }
    } catch {
      // Ignore sessionStorage disabled or quota errors
    }
  }, [searchParams, pathname])

  return null
}
