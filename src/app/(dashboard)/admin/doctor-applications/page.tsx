import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { AdminDoctorsClient } from "../doctors/AdminDoctorsClient"

export const revalidate = 0

export default async function AdminDoctorApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin" && profile?.role !== "staff") {
    redirect("/dashboard")
  }

  // Fetch all doctor applications
  const { data: doctors } = await supabase
    .from("doctors")
    .select("*")
    .order("created_at", { ascending: false })

  // Fetch clinics
  const { data: clinics } = await supabase
    .from("clinics")
    .select("id, name, address")

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href="/admin/dashboard" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Admin Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Doctor Verification & Applications
          </h1>
          <p className="text-muted-foreground mt-1">
            Review submitted medical council credentials, inspect verification documents, and approve or reject practicing physicians.
          </p>
        </div>
      </div>

      <AdminDoctorsClient 
        initialDoctors={doctors || []} 
        clinics={clinics || []} 
      />
    </div>
  )
}
