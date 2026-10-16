"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Shield, Key, Loader2, CheckCircle2, Smartphone, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/app/actions/profile"
import { createClient } from "@/utils/supabase/client"
import { MfaSetupModal } from "@/components/auth/MfaSetupModal"

export function SecuritySection({ userEmail }: { userEmail: string }) {
  const supabase = createClient()

  // Password state
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // MFA state
  const [mfaFactors, setMfaFactors] = useState<any[]>([])
  const [mfaLoading, setMfaLoading] = useState(true)
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false)

  const loadMfaFactors = useCallback(async () => {
    try {
      const { data, error: factorsErr } = await supabase.auth.mfa.listFactors()
      if (!factorsErr && data) {
        const verified = data.totp.filter((f) => f.status === "verified")
        setMfaFactors(verified)
      }
    } catch (err) {
      console.warn("MFA check failed:", err)
    } finally {
      setMfaLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadMfaFactors()
  }, [loadMfaFactors])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await updatePassword(formData)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setIsEditing(false)
      ;(e.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  const hasMfa = mfaFactors.length > 0
  const activeFactor = mfaFactors[0]

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border bg-surface pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <Shield className="w-5 h-5 text-muted-foreground" />
          Account Security & Multi-Factor Auth
        </CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="min-h-[36px]">
            Change Password
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Password updated successfully</p>
              <p className="text-sm mt-1 opacity-90">
                Your account is secure. Please use your new password next time you log in.
              </p>
            </div>
          </div>
        )}

        {/* PASSWORD EDIT FORM */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                placeholder="Re-enter password"
                className="h-11"
              />
            </div>

            {error && <p className="text-sm text-destructive font-medium">{error}</p>}

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold min-h-[44px]"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                Update Password
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false)
                  setError("")
                }}
                className="min-h-[44px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between py-1">
            <div className="space-y-1">
              <p className="font-medium text-foreground text-sm">Primary Authentication</p>
              <p className="text-xs text-muted-foreground">You log in using the email address: {userEmail}</p>
            </div>
          </div>
        )}

        {/* TWO-FACTOR AUTHENTICATION (MFA / 2FA) PANEL */}
        <div className="pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-surface/30">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  hasMfa
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                {hasMfa ? <Smartphone className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-foreground">Two-Factor Authentication (TOTP)</h4>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      hasMfa
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {mfaLoading ? "Checking..." : hasMfa ? "Active" : "Recommended"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground max-w-md">
                  {hasMfa
                    ? "Your account requires a 6-digit TOTP security code from your authenticator app on every login."
                    : "Add an extra layer of defense for patient records and doctor consultations with Google Authenticator or 1Password."}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant={hasMfa ? "outline" : "default"}
              size="sm"
              onClick={() => setIsMfaModalOpen(true)}
              disabled={mfaLoading}
              className={`shrink-0 min-h-[44px] ${
                !hasMfa ? "bg-primary hover:bg-primary-hover text-primary-foreground font-semibold" : ""
              }`}
            >
              {hasMfa ? "Manage 2FA" : "Enable 2FA"}
            </Button>
          </div>
        </div>
      </CardContent>

      <MfaSetupModal
        isOpen={isMfaModalOpen}
        onClose={() => setIsMfaModalOpen(false)}
        currentFactorId={activeFactor?.id || null}
        onStatusChange={loadMfaFactors}
      />
    </Card>
  )
}
