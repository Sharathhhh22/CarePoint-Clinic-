"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft } from "lucide-react"
import { ErrorMessage } from "@/components/ui/ErrorMessage"

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // MFA Challenge State
  const [isMfaRequired, setIsMfaRequired] = useState(false)
  const [mfaCode, setMfaCode] = useState("")
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null)

  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const redirectUrl = searchParams.get("redirect") || searchParams.get("next")

  const routeUserAfterAuth = async (userId: string) => {
    // If user came from a specific page (e.g. /appointments/new), return them there immediately
    if (redirectUrl && redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")) {
      router.push(redirectUrl)
      router.refresh()
      return
    }

    // Check role in profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle()

    if (profile?.role === "admin" || profile?.role === "staff") {
      router.push("/admin/dashboard")
    } else if (profile?.role === "doctor") {
      // Query doctor status
      const { data: doctor } = await supabase
        .from("doctors")
        .select("status")
        .eq("profile_id", userId)
        .maybeSingle()

      if (doctor?.status === "approved") {
        router.push("/doctor/dashboard")
      } else {
        router.push("/doctor/application-status")
      }
    } else {
      // Default to patient dashboard
      router.push("/patient/dashboard")
    }

    router.refresh()
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      })

      if (error) {
        if (error.message.includes("Invalid login")) {
          throw new Error("Incorrect email or password. Please verify your credentials.")
        }
        throw error
      }

      const user = authData.user
      if (!user) {
        throw new Error("Login failed. Please try again.")
      }

      // Check if user has active TOTP Multi-Factor Authentication enrolled
      const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (!aalError && aalData && aalData.nextLevel === "aal2" && aalData.currentLevel !== "aal2") {
        setAuthenticatedUser(user)
        setIsMfaRequired(true)
        setIsLoading(false)
        return
      }

      // No MFA required; complete navigation
      await routeUserAfterAuth(user.id)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to authenticate. Please try again."
      setErrorMsg(msg)
      setIsLoading(false)
    }
  }

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mfaCode.trim() || !authenticatedUser) return

    setIsLoading(true)
    setErrorMsg("")

    try {
      const { data: factors, error: factorsErr } = await supabase.auth.mfa.listFactors()
      if (factorsErr) throw factorsErr

      const verifiedFactor = factors?.totp?.find((f) => f.status === "verified")
      if (!verifiedFactor) {
        throw new Error("Verified TOTP authenticator factor not found.")
      }

      const { error: verifyErr } = await supabase.auth.mfa.challengeAndVerify({
        factorId: verifiedFactor.id,
        code: mfaCode.trim(),
      })

      if (verifyErr) {
        throw new Error("Invalid security code. Please check your authenticator app and try again.")
      }

      await routeUserAfterAuth(authenticatedUser.id)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Two-factor verification failed."
      setErrorMsg(msg)
      setIsLoading(false)
    }
  }

  const signupLink = redirectUrl
    ? `/signup?redirect=${encodeURIComponent(redirectUrl)}`
    : "/signup"

  return (
    <Card className="border-border shadow-sm rounded-2xl bg-card">
      {isMfaRequired ? (
        /* MFA CHALLENGE STEP */
        <form onSubmit={handleMfaVerify}>
          <CardHeader className="pb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl text-foreground font-bold">Two-Factor Authentication</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Enter the 6-digit verification code from your authenticator app to confirm your identity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {errorMsg && (
              <ErrorMessage
                title="Verification failed"
                message={errorMsg}
                onRetry={() => setErrorMsg("")}
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="mfa-code" className="text-foreground font-medium">Security Code</Label>
              <Input
                id="mfa-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                required
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ""))}
                className="h-12 bg-input-bg border-border text-foreground text-center tracking-widest text-xl font-mono font-bold"
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                Open Google Authenticator, Microsoft Authenticator, or 1Password.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3 pb-8">
            <Button
              type="submit"
              disabled={isLoading || mfaCode.length !== 6}
              className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-sm transition-colors min-h-[44px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Sign In"
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsMfaRequired(false)
                setMfaCode("")
                setErrorMsg("")
              }}
              className="w-full text-xs text-muted-foreground hover:text-foreground min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to email login
            </Button>
          </CardFooter>
        </form>
      ) : (
        /* STANDARD EMAIL & PASSWORD STEP */
        <form onSubmit={handleLogin}>
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-foreground font-bold">Log In</CardTitle>
            <CardDescription className="text-muted-foreground">
              {redirectUrl?.includes("appointments")
                ? "Please log in to continue booking your appointment."
                : "Enter your credentials to access your healthcare portal."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {errorMsg && (
              <ErrorMessage
                title="Login failed"
                message={errorMsg}
                onRetry={() => setErrorMsg("")}
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-foreground font-medium">Email Address</Label>
              <Input
                id="login-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="patient@gmail.com"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="h-11 bg-input-bg border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-foreground font-medium">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium min-h-[32px] flex items-center">
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Input
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="h-11 pr-12 bg-input-bg border-border text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-4 pb-8">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-sm transition-colors min-h-[44px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Log In"
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href={signupLink} className="font-semibold text-primary hover:underline">
                Create Account
              </Link>
            </div>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
