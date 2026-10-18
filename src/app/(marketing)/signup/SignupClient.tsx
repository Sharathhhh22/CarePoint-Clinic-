"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, User, Stethoscope, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { DoctorSignupForm } from "@/components/auth/DoctorSignupForm"

interface SignupClientProps {
  initialType?: "patient" | "doctor" | null
  redirectTarget?: string
}

export function SignupClient({ initialType = null, redirectTarget }: SignupClientProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [selectedType, setSelectedType] = useState<"patient" | "doctor" | null>(initialType)
  
  // Patient Form States
  const [patientName, setPatientName] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [patientPassword, setPatientPassword] = useState("")
  const [patientConfirmPassword, setPatientConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const loginLink = redirectTarget 
    ? `/login?redirect=${encodeURIComponent(redirectTarget)}` 
    : "/login"

  const handlePatientRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    
    // Client-side validation
    if (!patientName.trim()) {
      setErrorMsg("Please enter your full name.")
      setIsLoading(false)
      return
    }

    if (!patientEmail.trim() || !patientEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    if (!patientPhone.trim() || patientPhone.trim().length < 10) {
      setErrorMsg("Please provide a valid 10-digit mobile number.")
      setIsLoading(false)
      return
    }

    if (patientPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long for account security.")
      setIsLoading(false)
      return
    }

    if (patientPassword !== patientConfirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter identical passwords.")
      setIsLoading(false)
      return
    }

    if (!agreedToTerms) {
      setErrorMsg("Please agree to the Terms of Service and Privacy Policy to proceed.")
      setIsLoading(false)
      return
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: patientEmail.trim(),
        password: patientPassword,
        options: {
          data: {
            full_name: patientName.trim(),
            mobile: patientPhone.trim(),
            role: "patient",
          }
        }
      })

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes("already registered")) {
          throw new Error("An account with this email address already exists. Please log in instead.")
        }
        throw signUpError
      }

      const user = authData.user
      if (user) {
        // Upsert into profiles to guarantee profile role is 'patient' and phone numbers are persisted
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            role: "patient",
            full_name: patientName.trim(),
            email: patientEmail.trim(),
            mobile: patientPhone.trim(),
            phone: patientPhone.trim(),
          })

        if (profileError) {
          console.warn("Profile sync warning:", profileError.message)
        }
      }
      
      // Redirect authenticated patients to redirectTarget or patient dashboard
      if (redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('//')) {
        router.push(redirectTarget)
      } else {
        router.push("/patient/dashboard")
      }
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again."
      setErrorMsg(msg)
      setIsLoading(false)
    }
  }

  // =========================================================================
  // VIEW 1: Doctor Registration Flow
  // =========================================================================
  if (selectedType === "doctor") {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <DoctorSignupForm onBackToSelection={() => setSelectedType(null)} />
      </div>
    )
  }

  // =========================================================================
  // VIEW 2: Patient Registration Form
  // =========================================================================
  if (selectedType === "patient") {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedType(null)}
          className="text-muted-foreground hover:text-foreground -ml-2 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Change account type
        </Button>

        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <form onSubmit={handlePatientRegister}>
            <CardHeader className="pb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <User className="w-5 h-5" />
              </div>
              <CardTitle className="text-2xl text-foreground font-bold">Patient Registration</CardTitle>
              <CardDescription className="text-muted-foreground">
                Create your account to book appointments, consult specialists, and access digital passes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMsg && (
                <ErrorMessage 
                  title="Registration failed"
                  message={errorMsg}
                  onRetry={() => setErrorMsg("")}
                />
              )}

              <div className="space-y-1.5">
                <Label htmlFor="patient-name" className="text-foreground">Full Name</Label>
                <Input 
                  id="patient-name" 
                  autoComplete="name"
                  placeholder="e.g. Eleanor Vance" 
                  required 
                  value={patientName} 
                  onChange={e => setPatientName(e.target.value)} 
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="patient-email" className="text-foreground">Email Address</Label>
                <Input 
                  id="patient-email" 
                  type="email" 
                  inputMode="email"
                  autoComplete="email"
                  placeholder="eleanor.vance@gmail.com" 
                  required 
                  value={patientEmail} 
                  onChange={e => setPatientEmail(e.target.value)} 
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="patient-phone" className="text-foreground">Mobile Phone Number</Label>
                <Input 
                  id="patient-phone" 
                  type="tel" 
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="e.g. +91 9876543210" 
                  required 
                  value={patientPhone} 
                  onChange={e => setPatientPhone(e.target.value)} 
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">Used for SMS appointment reminders and emergency contact.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="patient-password" className="text-foreground">Password</Label>
                <div className="relative flex items-center">
                  <Input 
                    id="patient-password" 
                    type={showPassword ? "text" : "password"} 
                    autoComplete="new-password"
                    required 
                    value={patientPassword} 
                    onChange={e => setPatientPassword(e.target.value)} 
                    className="h-11 pr-12"
                  />
                  <button 
                    type="button" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="patient-confirm-password" className="text-foreground">Confirm Password</Label>
                <Input 
                  id="patient-confirm-password" 
                  type={showPassword ? "text" : "password"} 
                  autoComplete="new-password"
                  required 
                  value={patientConfirmPassword} 
                  onChange={e => setPatientConfirmPassword(e.target.value)} 
                  className="h-11"
                />
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <input 
                  type="checkbox" 
                  id="patient-terms" 
                  required 
                  checked={agreedToTerms}
                  onChange={e => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 rounded border-border text-primary focus:ring-primary cursor-pointer" 
                />
                <label htmlFor="patient-terms" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
                  I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-4 pb-8">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-sm transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                    Creating Patient Account...
                  </>
                ) : (
                  "Create Patient Account"
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center w-full max-w-none">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Log In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  // =========================================================================
  // VIEW 3: Account-Type Selection Screen (Default)
  // =========================================================================
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          How would you like to join?
        </h1>
        <p className="text-muted-foreground text-base">
          Choose the account that best matches how you will use our healthcare platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* CARD ONE: PATIENT */}
        <Card className="border-border hover:border-primary/50 transition-all duration-200 flex flex-col justify-between rounded-2xl bg-card shadow-sm hover:shadow-md group focus-within:ring-2 focus-within:ring-primary/20">
          <div>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                <User className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl text-foreground font-bold">I&apos;m a Patient</CardTitle>
              <CardDescription className="text-muted-foreground text-sm leading-relaxed mt-2">
                Find trusted doctors, explore specialties, and manage your healthcare appointments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant appointment booking with verified doctors</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Digital queue passes and real-time waiting estimates</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Secure access to consultation summaries and tickets</span>
              </div>
            </CardContent>
          </div>
          <CardFooter className="pt-4 pb-6">
            <Button 
              type="button"
              onClick={() => setSelectedType("patient")}
              className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue as Patient</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* CARD TWO: DOCTOR */}
        <Card className="border-border hover:border-primary/50 transition-all duration-200 flex flex-col justify-between rounded-2xl bg-card shadow-sm hover:shadow-md group focus-within:ring-2 focus-within:ring-primary/20">
          <div>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                <Stethoscope className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl text-foreground font-bold">I&apos;m a Doctor</CardTitle>
              <CardDescription className="text-muted-foreground text-sm leading-relaxed mt-2">
                Create your professional profile, submit your credentials, and manage your practice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Manage clinical schedule and consultation fees</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Official medical council verification and badge</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>AI clinical notes and digital patient history records</span>
              </div>
            </CardContent>
          </div>
          <CardFooter className="pt-4 pb-6">
            <Button 
              type="button"
              onClick={() => setSelectedType("doctor")}
              variant="outline"
              className="w-full h-11 border-primary/30 hover:border-primary hover:bg-primary/5 text-foreground font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Register as Doctor</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Footer Navigation */}
      <div className="w-full flex flex-col items-center justify-center text-center space-y-2 pt-6">
        <p className="text-sm text-muted-foreground w-full max-w-none text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Log In
          </Link>
        </p>
        <p className="text-xs text-muted-foreground w-full max-w-none text-center">
          By joining, you agree to our{" "}
          <Link href="/terms" className="hover:underline text-foreground">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="hover:underline text-foreground">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
