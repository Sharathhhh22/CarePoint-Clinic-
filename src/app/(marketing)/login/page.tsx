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

export default function LoginPage() {
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
    <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center p-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="section-title text-slate-900 dark:text-white">Welcome Back</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Log in to access your appointments and health records</p>
      </div>

      <div className="w-full max-w-md">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
          <form onSubmit={handleLogin}>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-slate-900 dark:text-white">Log In</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
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
                <Label htmlFor="login-email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                <Input 
                  id="login-email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={loginEmail} 
                  onChange={e => setLoginEmail(e.target.value)} 
                  className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-slate-700 dark:text-slate-300">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    id="login-password" 
                    type={showLoginPassword ? "text" : "password"} 
                    required 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                    className="h-11 pr-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-4 pb-8">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm transition-colors"
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
              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                  Create Account
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
