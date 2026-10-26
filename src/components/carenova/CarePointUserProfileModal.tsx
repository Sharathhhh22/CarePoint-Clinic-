"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  ExternalLink, 
  Loader2, 
  Check, 
  Edit3 
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { updateProfile } from "@/app/actions/profile"

export function CarePointUserProfileModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  const loadUserData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()
        setProfile(prof)
      }
    } catch (err) {
      console.error("Failed to load user profile in modal:", err)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  // Listen for custom trigger to open the modal from any button in the app
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true)
      loadUserData()
    }
    window.addEventListener("open-carepoint-profile-modal", handleOpen)
    return () => window.removeEventListener("open-carepoint-profile-modal", handleOpen)
  }, [loadUserData])

  useEffect(() => {
    if (isOpen) {
      loadUserData()
    } else {
      setIsEditing(false)
      setSaveSuccess(false)
      setErrorMsg("")
    }
  }, [isOpen, loadUserData])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMsg("")
    setSaveSuccess(false)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await updateProfile(formData)

      if (res?.error) {
        setErrorMsg(res.error)
      } else {
        setSaveSuccess(true)
        setIsEditing(false)
        await loadUserData()
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden rounded-3xl bg-white dark:bg-[#121B16] border border-[#E0E4DF] dark:border-[#2D4235] shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>CarePoint Patient Profile</DialogTitle>
          <DialogDescription>View and manage personal patient information</DialogDescription>
        </DialogHeader>
        {/* Banner Header */}
        <div className="relative h-28 bg-gradient-to-tr from-[#173F30] via-[#1E4D3B] to-[#101512] p-6 text-white flex items-end">
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A9C2B2]" />
              <span>HIPAA Protected</span>
            </span>
          </div>

          <div className="flex items-center gap-4 translate-y-8">
            {profile?.avatar_url ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-[#121B16] shadow-md bg-white">
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || "User Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#E7EEE8] text-[#173F30] border-2 border-white dark:border-[#121B16] shadow-md flex items-center justify-center font-extrabold text-xl">
                {profile?.full_name ? profile.full_name.slice(0, 2).toUpperCase() : "U"}
              </div>
            )}
            <div className="pt-8">
              <h3 className="text-lg font-bold text-[#101512] dark:text-[#EAEFEA] leading-tight">
                {profile?.full_name || user?.email?.split("@")[0] || "Patient Profile"}
              </h3>
              <p className="text-xs text-[#777D79] dark:text-[#9BAAA0] capitalize">
                {profile?.role === "admin"
                  ? "System Administrator"
                  : profile?.role === "doctor"
                  ? "Attending Clinician"
                  : "Verified Patient Account"}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="pt-12 p-6 sm:p-8 space-y-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-sm text-[#777D79]">
              <Loader2 className="w-6 h-6 animate-spin text-[#173F30]" />
              <span>Loading patient profile...</span>
            </div>
          ) : !user ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#E7EEE8] text-[#173F30] mx-auto flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#101512] dark:text-[#EAEFEA]">
                  Patient Profile Sign In
                </h4>
                <p className="text-xs text-[#777D79] dark:text-[#9BAAA0] max-w-xs mx-auto mt-1 leading-relaxed">
                  Log in to view your upcoming appointments, medical summaries, and patient profile details.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Button
                  asChild
                  variant="primary"
                  size="sm"
                  className="rounded-full shadow-xs"
                >
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Log In to Portal
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    Create Account
                  </Link>
                </Button>
              </div>
            </div>
          ) : isEditing ? (
            /* EDIT FORM */
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="modal_full_name" className="text-xs font-semibold text-[#101512] dark:text-[#EAEFEA]">
                  Full Name
                </Label>
                <Input
                  id="modal_full_name"
                  name="full_name"
                  defaultValue={profile?.full_name || ""}
                  required
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="modal_mobile" className="text-xs font-semibold text-[#101512] dark:text-[#EAEFEA]">
                  Phone Number (for SMS reminders)
                </Label>
                <Input
                  id="modal_mobile"
                  name="mobile"
                  type="tel"
                  defaultValue={profile?.mobile || ""}
                  placeholder="+1 (555) 000-0000"
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="modal_address" className="text-xs font-semibold text-[#101512] dark:text-[#EAEFEA]">
                  Residential Address
                </Label>
                <Input
                  id="modal_address"
                  name="address"
                  defaultValue={profile?.address || ""}
                  placeholder="Street, City, State, ZIP"
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="modal_bio" className="text-xs font-semibold text-[#101512] dark:text-[#EAEFEA]">
                  Patient Medical Notes / Bio
                </Label>
                <Textarea
                  id="modal_bio"
                  name="bio"
                  rows={3}
                  defaultValue={profile?.bio || ""}
                  placeholder="Brief note on primary care focus, known allergies, or healthcare preferences..."
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSaving}
                  className="rounded-full text-xs shadow-xs"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* VIEW MODE */
            <div className="space-y-5">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-[#E7EEE8] text-[#173F30] text-xs font-semibold flex items-center gap-2 border border-[#A9C2B2]/60">
                  <Check className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-[#FAFAF7] dark:bg-[#1B2921]/60 border border-[#E0E4DF] dark:border-[#2D4235]">
                  <span className="text-[11px] font-semibold text-[#777D79] dark:text-[#9BAAA0] flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-[#173F30] dark:text-[#A9C2B2]" />
                    Email
                  </span>
                  <p className="text-xs font-bold text-[#101512] dark:text-[#EAEFEA] truncate">
                    {user?.email || "—"}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAF7] dark:bg-[#1B2921]/60 border border-[#E0E4DF] dark:border-[#2D4235]">
                  <span className="text-[11px] font-semibold text-[#777D79] dark:text-[#9BAAA0] flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#173F30] dark:text-[#A9C2B2]" />
                    Phone Number
                  </span>
                  <p className="text-xs font-bold text-[#101512] dark:text-[#EAEFEA] truncate">
                    {profile?.mobile || "Not specified"}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAFAF7] dark:bg-[#1B2921]/60 border border-[#E0E4DF] dark:border-[#2D4235] sm:col-span-2">
                  <span className="text-[11px] font-semibold text-[#777D79] dark:text-[#9BAAA0] flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#173F30] dark:text-[#A9C2B2]" />
                    Address
                  </span>
                  <p className="text-xs font-bold text-[#101512] dark:text-[#EAEFEA]">
                    {profile?.address || "No address on file"}
                  </p>
                </div>

                {profile?.bio && (
                  <div className="p-3.5 rounded-2xl bg-[#FAFAF7] dark:bg-[#1B2921]/60 border border-[#E0E4DF] dark:border-[#2D4235] sm:col-span-2">
                    <span className="text-[11px] font-semibold text-[#777D79] dark:text-[#9BAAA0] mb-1 block">
                      Care Notes &amp; Preferences
                    </span>
                    <p className="text-xs text-[#101512] dark:text-[#EAEFEA] leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E0E4DF] dark:border-[#2D4235]">
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs font-semibold"
                >
                  <Edit3 className="size-3.5 mr-1.5" aria-hidden="true" />
                  <span>Edit Details</span>
                </Button>

                <Button
                  asChild
                  variant="primary"
                  size="sm"
                  className="rounded-full text-xs shadow-xs"
                >
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <span>Open Full Profile &amp; Security</span>
                    <ExternalLink className="size-3.5 ml-1.5" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
