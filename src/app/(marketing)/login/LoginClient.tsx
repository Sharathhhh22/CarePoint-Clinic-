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

export function LoginClient() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      })

      if (error) {
        if (error.message.includes("Invalid login")) {
          throw new Error("Incorrect email or password. Please verify your credentials.")
        }
        throw error
      }
      
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to authenticate. Please try again."
      setErrorMsg(msg)
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border shadow-sm rounded-2xl bg-card">
      <form onSubmit={handleLogin}>
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl text-foreground font-bold">Log In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your patient portal.
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
              placeholder="name@example.com" 
              required 
              value={loginEmail} 
              onChange={e => setLoginEmail(e.target.value)} 
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
                onChange={e => setLoginPassword(e.target.value)} 
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
            className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-sm transition-colors"
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
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create Account
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
