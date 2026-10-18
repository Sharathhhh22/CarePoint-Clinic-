"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Smartphone, Loader2, CheckCircle2, Copy, AlertCircle, Trash2 } from "lucide-react"

interface MfaSetupModalProps {
  isOpen: boolean
  onClose: () => void
  currentFactorId?: string | null
  onStatusChange?: () => void
}

export function MfaSetupModal({
  isOpen,
  onClose,
  currentFactorId,
  onStatusChange,
}: MfaSetupModalProps) {
  const supabase = createClient()
  const [step, setStep] = useState<"initial" | "enrolling" | "verifying" | "success" | "disabling">("initial")
  const [factorId, setFactorId] = useState<string>(currentFactorId || "")
  const [qrCode, setQrCode] = useState<string>("")
  const [secretKey, setSecretKey] = useState<string>("")
  const [verifyCode, setVerifyCode] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)

  const handleStartEnrollment = async () => {
    setLoading(true)
    setError("")
    try {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "SlotUrSelf Authenticator",
      })

      if (enrollError) throw enrollError
      if (!data) throw new Error("Could not initialize authenticator factor.")

      setFactorId(data.id)
      setQrCode(data.totp.qr_code)
      setSecretKey(data.totp.secret)
      setStep("verifying")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initiate MFA setup."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifyCode.trim() || !factorId) return

    setLoading(true)
    setError("")
    try {
      const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode.trim(),
      })

      if (verifyError) throw verifyError

      setStep("success")
      if (onStatusChange) onStatusChange()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid code. Please check your authenticator app and try again."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleUnenroll = async () => {
    if (!currentFactorId) return
    setLoading(true)
    setError("")
    try {
      const { error: unenrollErr } = await supabase.auth.mfa.unenroll({
        factorId: currentFactorId,
      })
      if (unenrollErr) throw unenrollErr

      if (onStatusChange) onStatusChange()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove authenticator."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleCopySecret = () => {
    if (!secretKey) return
    navigator.clipboard.writeText(secretKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetModal = () => {
    setStep("initial")
    setVerifyCode("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-bold">Two-Factor Authentication (MFA)</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Protect your healthcare portal with time-based one-time password (TOTP) verification.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* CURRENTLY ENROLLED: OPTION TO DISABLE */}
        {currentFactorId && step === "initial" && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Authenticator App is Active</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Your account requires a 6-digit security code from Google Authenticator, Microsoft Authenticator, or 1Password at login.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={resetModal} className="min-h-[44px]">
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={handleUnenroll}
                disabled={loading}
                className="min-h-[44px]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Trash2 className="w-4 h-4 mr-1.5" />}
                Disable 2FA
              </Button>
            </div>
          </div>
        )}

        {/* NOT ENROLLED: INTRO STEP */}
        {!currentFactorId && step === "initial" && (
          <div className="space-y-4 py-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-surface/50 text-sm">
              <Smartphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-foreground">Recommended for Doctors & Admins</p>
                <p className="text-xs text-muted-foreground">
                  Works with any standard TOTP app (Google Authenticator, Microsoft Authenticator, Authy, Apple Keychain).
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button variant="ghost" onClick={resetModal} className="min-h-[44px]">
                Cancel
              </Button>
              <Button
                onClick={handleStartEnrollment}
                disabled={loading}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold min-h-[44px]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                Set Up Authenticator
              </Button>
            </div>
          </div>
        )}

        {/* VERIFYING STEP: SCAN QR CODE & ENTER 6-DIGIT CODE */}
        {step === "verifying" && (
          <form onSubmit={handleVerifyCode} className="space-y-4 py-2">
            <div className="text-center space-y-3">
              <p className="text-xs text-muted-foreground font-medium">
                1. Scan this QR code using your authenticator app:
              </p>
              {qrCode ? (
                <div className="inline-block p-3 bg-white rounded-2xl shadow-sm border border-border">
                  <img src={qrCode} alt="TOTP QR Code" className="w-48 h-48 mx-auto" />
                </div>
              ) : (
                <div className="w-48 h-48 bg-surface animate-pulse rounded-2xl mx-auto flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Secret key fallback */}
              <div className="space-y-1 pt-1">
                <p className="text-[11px] text-muted-foreground">Or enter key manually:</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-mono">
                  <span>{secretKey || "•••• •••• ••••"}</span>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="p-1 hover:text-primary transition-colors cursor-pointer"
                    title="Copy Key"
                    aria-label="Copy secret key"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && <span className="text-[10px] text-emerald-500 font-sans">Copied!</span>}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="mfa-verify-code" className="text-xs font-semibold">
                2. Enter 6-digit confirmation code from your app:
              </Label>
              <Input
                id="mfa-verify-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ""))}
                className="text-center tracking-widest text-lg font-mono font-bold h-11"
                required
              />
            </div>

            <DialogFooter className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={resetModal} className="min-h-[44px]">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || verifyCode.length !== 6}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold min-h-[44px]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                Verify & Activate
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* SUCCESS STEP */}
        {step === "success" && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-foreground">Two-Factor Authentication Active!</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Your account is now defended by multi-factor authentication. You will be prompted for a 6-digit code on future logins.
              </p>
            </div>
            <Button
              onClick={resetModal}
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold min-h-[44px] w-full"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
