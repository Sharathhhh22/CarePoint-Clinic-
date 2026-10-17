"use client"

export type ConversionEvent =
  | "appointment_hold"
  | "appointment_confirmed"
  | "doctor_application_submitted"
  | "symptom_triage_started"
  | "emergency_call_clicked"
  | "contact_form_submitted"
  | "cookie_consent_accepted"

interface EventProperties {
  [key: string]: string | number | boolean | undefined | null
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Privacy-safe conversion event tracker.
 * Dispatches to standard dataLayer (GTM / GA4) and custom DOM events without PII.
 */
export function trackEvent(eventName: ConversionEvent, properties: EventProperties = {}) {
  if (typeof window === "undefined") return

  const eventPayload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...properties,
  }

  // 1. Google Tag Manager / GA4 dataLayer integration
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventPayload)
  }

  // 2. Window gtag integration
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, properties)
  }

  // 3. Custom DOM Event for edge telemetry or local debugging
  try {
    const customEvent = new CustomEvent("sloturself:conversion", {
      detail: eventPayload,
    })
    window.dispatchEvent(customEvent)
  } catch {
    // Ignore environments where CustomEvent constructor is restricted
  }

  if (process.env.NODE_ENV === "development") {
    console.debug(`[Analytics Tracked]: ${eventName}`, properties)
  }
}
