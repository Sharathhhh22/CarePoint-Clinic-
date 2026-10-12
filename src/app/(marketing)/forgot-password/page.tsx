"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Mail, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@/components/ui/ErrorMessage"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/profile`,
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send reset link. Please try again."
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background text-foreground flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Login
        </Link>

        <h2 className="text-3xl font-bold tracking-tight text-foreground text-center">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Enter your email address and we will send you a secure link to reset your account password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-card py-8 px-6 shadow-sm border border-border rounded-2xl sm:px-10">
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Check your email</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We sent a password reset link to <strong className="text-foreground">{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <div className="pt-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <ErrorMessage 
                  title="Password reset failed"
                  message={errorMessage} 
                  onRetry={() => setErrorMessage("")}
                />
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
