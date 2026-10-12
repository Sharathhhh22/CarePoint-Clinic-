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

export default function SignupPage() {
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
    
    if (regPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.")
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
    <div className="container mx-auto flex min-h-[85vh] flex-col items-center justify-center p-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="section-title text-slate-900 dark:text-white">Create an Account</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Join APPOINTLY to manage your appointments and digital health records</p>
      </div>

      <div className="w-full max-w-md">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
          <form onSubmit={handleRegister}>
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-slate-900 dark:text-white">Sign Up</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
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
                <Label htmlFor="reg-name" className="text-slate-700 dark:text-slate-300">Full Name</Label>
                <Input 
                  id="reg-name" 
                  placeholder="Jane Doe" 
                  required 
                  value={regName} 
                  onChange={e => setRegName(e.target.value)} 
                  className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-email" className="text-slate-700 dark:text-slate-300">Email Address</Label>
                <Input 
                  id="reg-email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={regEmail} 
                  onChange={e => setRegEmail(e.target.value)} 
                  className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-password" className="text-slate-700 dark:text-slate-300">Password</Label>
                <div className="relative">
                  <Input 
                    id="reg-password" 
                    type={showRegPassword ? "text" : "password"} 
                    required 
                    value={regPassword} 
                    onChange={e => setRegPassword(e.target.value)} 
                    className="h-11 pr-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="reg-confirm-password" className="text-slate-700 dark:text-slate-300">Confirm Password</Label>
                <Input 
                  id="reg-confirm-password" 
                  type={showRegPassword ? "text" : "password"} 
                  required 
                  value={regConfirmPassword} 
                  onChange={e => setRegConfirmPassword(e.target.value)} 
                  className="h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <p className="text-xs text-slate-500">Minimum 6 characters.</p>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  required 
                  className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-600 focus:ring-teal-600" 
                />
                <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  I agree to the <Link href="/terms" className="text-teal-600 dark:text-teal-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-teal-600 dark:text-teal-400 hover:underline">Privacy Policy</Link>.
                </label>
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
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center w-full">
                Already have an account?{" "}
                <Link href="/login" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">
                  Log In
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
