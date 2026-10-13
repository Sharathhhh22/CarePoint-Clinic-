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
    <div className="container mx-auto p-4 md:p-6 max-w-[1200px]">
      <div className="mb-4">
        <Link href="/admin" className="text-[13px] font-medium tracking-wide text-muted-foreground hover:text-foreground flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor Management & Approvals</h1>
          <p className="text-muted-foreground mt-1">Review credential applications, verify medical licensing, and manage active practicing physicians.</p>
        </div>
        <Link
          href="/admin/doctors/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-[14px] font-medium tracking-wide text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm"
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
