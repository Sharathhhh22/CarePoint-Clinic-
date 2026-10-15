"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { DoctorApplicationStatus } from "@/components/doctor/DoctorApplicationStatus"
import { DoctorOnboardingForm } from "@/components/doctor/DoctorOnboardingForm"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react"

export default function DoctorApplicationStatusPage() {
  const router = useRouter()
  const supabase = createClient()

  const [doctor, setDoctor] = useState<any>(null)
  const [clinics, setClinics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const loadDoctorProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // Fetch clinics in case doctor needs to edit
      const { data: clinicList } = await supabase
        .from("clinics")
        .select("id, name, address")
        .eq("is_active", true)
      setClinics(clinicList || [])

      // Fetch doctor row
      const { data: doctorData, error: doctorErr } = await supabase
        .from("doctors")
        .select("*")
        .eq("profile_id", user.id)
        .maybeSingle()

      if (doctorErr) throw doctorErr
      setDoctor(doctorData || null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load application status."
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [supabase, router])

  useEffect(() => {
    loadDoctorProfile()
  }, [loadDoctorProfile])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-2xl">
        <Card className="border-destructive/20 bg-destructive/10">
          <CardContent className="p-6 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      </div>
    )
  }

  // If no doctor application exists yet or in edit mode
  if (!doctor || isEditing) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-3xl space-y-4">
        {isEditing && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditing(false)}
            className="text-xs -ml-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Application Status
          </Button>
        )}
        <DoctorOnboardingForm 
          initialDoctor={doctor}
          clinics={clinics}
          onSuccess={() => {
            setIsEditing(false)
            setLoading(true)
            loadDoctorProfile()
          }}
        />
      </div>
    )
  }

  // If doctor is already approved
  if (doctor.status === "approved") {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-2xl space-y-6 text-center animate-in fade-in duration-300">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Credentials Verified & Approved!</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Your professional doctor profile is verified and active. You can now manage your daily schedule, consultation fees, and patient visits.
            </p>
            <div className="pt-2">
              <Link href="/doctor/dashboard">
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold">
                  <span>Enter Doctor Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pending / Rejected / Suspended views
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      <DoctorApplicationStatus 
        doctor={doctor}
        onEdit={() => setIsEditing(true)}
      />
    </div>
  )
}
