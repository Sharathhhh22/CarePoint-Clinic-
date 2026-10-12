"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Shield, Key, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/app/actions/profile"

export function SecuritySection({ userEmail }: { userEmail: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

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

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="border-b border-border bg-surface pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <Shield className="w-5 h-5 text-muted-foreground" />
          Account Security
        </CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
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
              <p className="text-sm mt-1 opacity-90">Your account is secure. Please use your new password next time you log in.</p>
            </div>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input id="password" name="password" type="password" required minLength={6} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
            </div>
            
            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
            
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                Update Password
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setIsEditing(false); setError(""); }}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Email Login</p>
              <p className="text-sm text-muted-foreground">You log in using the email address: {userEmail}</p>
            </div>
          </div>
        )}
        
      </CardContent>
    </Card>
  )
}
