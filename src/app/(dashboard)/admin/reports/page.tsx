import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { AdminReportsClient } from "./AdminReportsClient"

export const revalidate = 0

export default async function AdminReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  // Fetch counts
  const { count: doctorsCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('is_active', true)
  const { count: clinicsCount } = await supabase.from('clinics').select('*', { count: 'exact', head: true })
  const { count: patientsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).not('role', 'in', '("admin", "staff")')

  // Fetch all recent appointments
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id,
      appointment_date,
      appointment_time,
      status,
      payment_mode,
      ticket_number,
      patient_name,
      doctors ( name, specialty, consultation_fee ),
      clinics ( name )
    `)
    .order('appointment_date', { ascending: false })
    .limit(500)

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Operational Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            System throughput, completion ratios, department demand distribution, and data exports.
          </p>
        </div>
      </div>

      <AdminReportsClient
        appointments={(appointments as any) || []}
        totalDoctors={doctorsCount || 0}
        totalClinics={clinicsCount || 0}
        totalPatients={patientsCount || 0}
      />
    </div>
  )
}
