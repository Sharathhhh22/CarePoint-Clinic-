import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { AdminDoctorsClient } from "./AdminDoctorsClient"

export const revalidate = 0

export default async function AdminDoctorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  // Fetch all doctors with credential fields
  const { data: doctors } = await supabase
    .from('doctors')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch clinics for clinic name mapping
  const { data: clinics } = await supabase
    .from('clinics')
    .select('id, name, address')

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor Management & Approvals</h1>
          <p className="text-muted-foreground mt-1">Review credential applications, verify medical licensing, and manage active practicing physicians.</p>
        </div>
        <Link
          href="/admin/doctors/new"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold tracking-wide text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Doctor Manually
        </Link>
      </div>

      <AdminDoctorsClient 
        initialDoctors={doctors || []} 
        clinics={clinics || []} 
      />
    </div>
  )
}
