"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import { HealthcareChatbot } from "@/components/chat/HealthcareChatbot"

const emptySubscribe = () => () => {}

export function FeaturesOverlay() {
  const [showCookie, setShowCookie] = useState(false)
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false)

  useEffect(() => {
    // Check cookie consent safely
    try {
      if (!localStorage.getItem("cookieConsent")) {
        const timer = setTimeout(() => setShowCookie(true), 1500)
        return () => clearTimeout(timer)
      }
    } catch {
      // Storage access blocked or restricted
    }
  }, [])

  const acceptCookies = () => {
    try {
      localStorage.setItem("cookieConsent", "true")
    } catch {}
    setShowCookie(false)
  }

  if (!isClient) return null

  return (
    <>
      {/* Global Healthcare AI Chatbot */}
      <HealthcareChatbot />

      {/* Clean, Non-intrusive Cookie Notice */}
      {showCookie && (
        <div className="fixed bottom-6 left-6 right-24 md:left-auto md:right-32 md:max-w-sm z-40 bg-surface text-foreground p-4 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-4 justify-between border border-border">
          <p className="text-sm text-muted-foreground leading-tight">
            We use strictly necessary cookies to keep you logged in. No advertising tracking.
          </p>
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={acceptCookies}
              className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  )
}
