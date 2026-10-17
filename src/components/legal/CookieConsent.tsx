"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShieldCheck, Cookie, Settings, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { trackEvent } from "@/lib/analytics"

const STORAGE_KEY = "sloturself_cookie_consent_v1"

interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  functional: boolean
}

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
    functional: true,
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        // Show banner after brief delay
        const timer = setTimeout(() => setIsOpen(true), 1200)
        return () => clearTimeout(timer)
      } else {
        const parsed = JSON.parse(saved)
        setPreferences(parsed)
      }
    } catch {
      // Ignore storage errors in private browsing
    }
  }, [])

  const saveConsent = (prefs: ConsentPreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // Ignore
    }
    setPreferences(prefs)
    setIsOpen(false)
    setIsPreferencesOpen(false)
    trackEvent("cookie_consent_accepted", { analytics: prefs.analytics, functional: prefs.functional })
  }

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, functional: true })
  }

  const handleRejectNonEssential = () => {
    saveConsent({ essential: true, analytics: false, functional: false })
  }

  const handleSaveCustom = () => {
    saveConsent(preferences)
  }

  if (!isOpen && !isPreferencesOpen) return null

  return (
    <>
      {/* Floating Cookie Consent Banner */}
      {isOpen && !isPreferencesOpen && (
        <div
          role="region"
          aria-label="Cookie consent"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[9990] bg-surface border border-border p-5 rounded-2xl shadow-xl transition-all animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Your Privacy Choices</h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                We use strictly necessary cookies to keep your appointments secure, and optional cookies to improve performance and analytics.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Privacy Policy
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreferencesOpen(true)}
                className="text-xs h-8 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-3.5 h-3.5 mr-1" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectNonEssential}
                className="text-xs h-8 px-3 border-border text-foreground hover:bg-muted"
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="text-xs h-8 px-3 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Panel Dialog */}
      <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription className="text-xs">
              Manage which cookies you allow on SlotUrSelf. You can modify these settings anytime.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Essential Cookies */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-muted/40 border border-border">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold">Strictly Necessary</Label>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    Required
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Essential for Supabase Auth, secure sessions, appointment slot holding, and payment processing.
                </p>
              </div>
              <Switch checked={true} disabled aria-label="Strictly necessary cookies (always active)" />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-border">
              <div className="space-y-0.5">
                <Label htmlFor="analytics-cookies" className="text-sm font-semibold cursor-pointer">
                  Analytics & Performance
                </Label>
                <p className="text-xs text-muted-foreground">
                  Helps us understand booking flow traffic and system latency without storing identifying patient data.
                </p>
              </div>
              <Switch
                id="analytics-cookies"
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, analytics: checked }))
                }
              />
            </div>

            {/* Functional Preferences */}
            <div className="flex items-start justify-between gap-4 p-3 rounded-xl border border-border">
              <div className="space-y-0.5">
                <Label htmlFor="functional-cookies" className="text-sm font-semibold cursor-pointer">
                  Preferences & Functional
                </Label>
                <p className="text-xs text-muted-foreground">
                  Remembers your theme mode (Light/Dark) and clinic search radius preferences.
                </p>
              </div>
              <Switch
                id="functional-cookies"
                checked={preferences.functional}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, functional: checked }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreferencesOpen(false)}
              className="text-xs border-border"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveCustom}
              className="text-xs bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
