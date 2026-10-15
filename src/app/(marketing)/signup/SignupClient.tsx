"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { ErrorMessage } from "@/components/ui/ErrorMessage"

export function SignupClient() {
  const router = useRouter()
  const supabase = createClient()
  
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regConfirmPassword, setRegConfirmPassword] = useState("")
  const [showRegPassword, setShowRegPassword] = useState(false)
  
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    
    if (regPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long for account security.")
      setIsLoading(false)
      return
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter identical passwords.")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: {
          data: {
            full_name: regName.trim(),
          }
        }
      })

      if (error) throw error
      
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again."
      setErrorMsg(msg)
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border shadow-sm rounded-2xl bg-card">
      <form onSubmit={handleRegister}>
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl text-foreground">Sign Up</CardTitle>
          <CardDescription className="text-muted-foreground">
            Registering allows you to book appointments and view digital passes securely.
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
            <Label htmlFor="reg-name" className="text-foreground">Full Name</Label>
            <Input 
              id="reg-name" 
              autoComplete="name"
              placeholder="Jane Doe" 
              required 
              value={regName} 
              onChange={e => setRegName(e.target.value)} 
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-email" className="text-foreground">Email Address</Label>
            <Input 
              id="reg-email" 
              type="email" 
              inputMode="email"
              autoComplete="email"
              placeholder="name@example.com" 
              required 
              value={regEmail} 
              onChange={e => setRegEmail(e.target.value)} 
              className="h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reg-password" className="text-foreground">Password</Label>
            <div className="relative flex items-center">
              <Input 
                id="reg-password" 
                type={showRegPassword ? "text" : "password"} 
                autoComplete="new-password"
                required 
                value={regPassword} 
                onChange={e => setRegPassword(e.target.value)} 
                className="h-11 pr-12"
              />
              <button 
                type="button" 
                className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowRegPassword(!showRegPassword)}
                aria-label={showRegPassword ? "Hide password" : "Show password"}
              >
                {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="reg-confirm-password" className="text-foreground">Confirm Password</Label>
            <Input 
              id="reg-confirm-password" 
              type={showRegPassword ? "text" : "password"} 
              autoComplete="new-password"
              required 
              value={regConfirmPassword} 
              onChange={e => setRegConfirmPassword(e.target.value)} 
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">Minimum 6 characters.</p>
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <input 
              type="checkbox" 
              id="terms" 
              required 
              className="mt-1 h-5 w-5 shrink-0 rounded border-border text-primary focus:ring-primary cursor-pointer" 
            />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
              I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </label>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4 pb-8">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
