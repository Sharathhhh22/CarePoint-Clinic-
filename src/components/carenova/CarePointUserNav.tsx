"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { 
  User, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard, 
  ShieldCheck,
  Stethoscope,
  LogIn,
  UserPlus
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"

interface UserProfile {
  id: string
  email: string
  fullName?: string
  role?: string
  avatarUrl?: string
}

export function CarePointUserNav() {
  const router = useRouter()
  const supabase = createClient()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, role, avatar_url")
            .eq("id", user.id)
            .maybeSingle()

          setUserProfile({
            id: user.id,
            email: user.email || "",
            fullName: profile?.full_name || user.user_metadata?.full_name || "Patient",
            role: profile?.role || "patient",
            avatarUrl: profile?.avatar_url,
          })
        } else {
          setUserProfile(null)
        }
      } catch (err) {
        console.error("Error fetching user profile:", err)
        setUserProfile(null)
      }
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUser()
      } else {
        setUserProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleSignOut = async () => {
    setIsOpen(false)
    await supabase.auth.signOut()
    setUserProfile(null)
    router.push("/")
    router.refresh()
  }

  const getDashboardHref = () => {
    if (!userProfile) return "/login"
    if (userProfile.role === "admin" || userProfile.role === "staff") return "/admin/dashboard"
    if (userProfile.role === "doctor") return "/doctor/dashboard"
    return "/patient/dashboard"
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  // 1. Authenticated User Dropdown
  if (userProfile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={`User menu for ${userProfile.fullName}`}
          className="flex items-center gap-2 py-1 px-2.5 rounded-full border border-[#E0E4DF] dark:border-[#2D4235] bg-white dark:bg-[#121B16] hover:bg-[#FAFAF7] dark:hover:bg-[#1B2921] transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173F30]"
        >
          {userProfile.avatarUrl ? (
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#A9C2B2] shrink-0">
              <Image
                src={userProfile.avatarUrl}
                alt={userProfile.fullName || "User avatar"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#173F30] text-[#E7EEE8] text-xs font-bold flex items-center justify-center shrink-0">
              {getInitials(userProfile.fullName)}
            </div>
          )}
          <span className="text-xs font-bold text-[#101512] dark:text-[#EAEFEA] max-w-[100px] truncate">
            {userProfile.fullName?.split(" ")[0] || "Profile"}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#777D79] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#121B16] border border-[#E0E4DF] dark:border-[#2D4235] shadow-xl p-2 z-50 text-xs animate-in fade-in-0 zoom-in-95 duration-150"
          >
            {/* Header: User identity */}
            <div className="p-3 border-b border-[#E0E4DF] dark:border-[#2D4235] mb-1">
              <p className="font-bold text-sm text-[#101512] dark:text-[#EAEFEA] truncate">
                {userProfile.fullName}
              </p>
              <p className="text-[11px] text-[#777D79] dark:text-[#9BAAA0] truncate mt-0.5">
                {userProfile.email}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E7EEE8] dark:bg-[#1B2921] text-[#173F30] dark:text-[#A9C2B2]">
                <ShieldCheck className="w-3 h-3" />
                <span>
                  {userProfile.role === "admin"
                    ? "Administrator"
                    : userProfile.role === "doctor"
                    ? "Attending Doctor"
                    : "Verified Patient"}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  window.dispatchEvent(new CustomEvent("open-carepoint-profile-modal"))
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors text-left cursor-pointer"
                role="menuitem"
              >
                <User className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
                <span>Quick Profile View</span>
              </button>

              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors"
                role="menuitem"
              >
                <Settings className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
                <span>Full Profile &amp; Security</span>
              </Link>

              <Link
                href={getDashboardHref()}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors"
                role="menuitem"
              >
                <LayoutDashboard className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
                <span>Patient Dashboard</span>
              </Link>

              <Link
                href="/appointments"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors"
                role="menuitem"
              >
                <Calendar className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
                <span>My Appointments</span>
              </Link>

              <Link
                href="/records"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors"
                role="menuitem"
              >
                <FileText className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
                <span>Medical Records</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors"
                role="menuitem"
              >
                <Settings className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
                <span>Account Settings</span>
              </Link>
            </div>

            {/* Sign Out Divider & Button */}
            <div className="pt-1 mt-1 border-t border-[#E0E4DF] dark:border-[#2D4235]">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors cursor-pointer"
                role="menuitem"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 2. Unauthenticated User Pill
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User account and profile options"
        className="flex items-center gap-1.5 py-1 px-2.5 rounded-full border border-[#E0E4DF] dark:border-[#2D4235] bg-white dark:bg-[#121B16] hover:bg-[#FAFAF7] dark:hover:bg-[#1B2921] text-xs font-semibold text-[#173F30] dark:text-[#A9C2B2] transition-all cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173F30]"
      >
        <User className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Profile</span>
        <ChevronDown className="w-3 h-3 text-[#777D79]" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#121B16] border border-[#E0E4DF] dark:border-[#2D4235] shadow-xl p-2 z-50 text-xs animate-in fade-in-0 zoom-in-95 duration-150"
        >
          <div className="p-2.5 border-b border-[#E0E4DF] dark:border-[#2D4235] mb-1">
            <p className="font-bold text-xs text-[#101512] dark:text-[#EAEFEA]">Patient &amp; Staff Access</p>
            <p className="text-[11px] text-[#777D79] dark:text-[#9BAAA0] mt-0.5">
              Access your appointments, consultations, and digital records.
            </p>
          </div>

          <div className="space-y-0.5">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-semibold transition-colors"
              role="menuitem"
            >
              <LogIn className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
              <span>Log In to Portal</span>
            </Link>

            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors"
              role="menuitem"
            >
              <UserPlus className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
              <span>Create Patient Account</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false)
                window.dispatchEvent(new CustomEvent("open-carepoint-profile-modal"))
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors text-left cursor-pointer"
              role="menuitem"
            >
              <User className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
              <span>Quick Profile Info</span>
            </button>

            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
              <span>Patient Profile Page</span>
            </Link>

            <Link
              href="/doctor"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8]/60 dark:hover:bg-[#1B2921] font-medium transition-colors"
              role="menuitem"
            >
              <Stethoscope className="w-4 h-4 text-[#173F30] dark:text-[#A9C2B2] shrink-0" />
              <span>Doctor Portal</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
