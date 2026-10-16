import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { AdminAllocationClient } from "./AdminAllocationClient"

export const revalidate = 0

export default async function AdminAllocationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  const today = new Date().toISOString().split('T')[0]

  // 1. Fetch all doctors with clinic and department info
  const { data: doctors } = await supabase
    .from('doctors')
    .select(`
      id,
      name,
      specialty,
      experience_years,
      consultation_fee,
      is_active,
      status,
      photo_url,
      clinic_id,
      clinics (
        id,
        name,
        address
      )
    `)
    .order('name', { ascending: true })

  // 2. Fetch all recurring doctor availability schedules
  const { data: availability } = await supabase
    .from('doctor_availability')
    .select('*')
    .eq('is_active', true)

  // 3. Fetch today's appointments with patient and doctor details
  const { data: todayAppointments } = await supabase
    .from('appointments')
    .select(`
      id,
      appointment_date,
      appointment_time,
      status,
      held_until,
      patient_name,
      patient_phone,
      ticket_number,
      payment_mode,
      payment_status,
      doctor_id,
      clinic_id,
      doctors (
        id,
        name,
        specialty
      ),
      clinics (
        id,
        name
      ),
      profiles (
        full_name,
        mobile
      )
    `)
    .eq('appointment_date', today)
    .order('appointment_time', { ascending: true })

  // 4. Fetch all medical departments
  const { data: departments } = await supabase
    .from('departments')
    .select('id, name, description')
    .order('name', { ascending: true })

  // 5. Fetch recent audit logs for allocation actions
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  // 6. Fetch recent doctor verification decisions
  const { data: verificationHistory } = await supabase
    .from('doctor_verification_history')
    .select(`
      id,
      doctor_id,
      reviewer_id,
      decision,
      reason,
      reviewed_at,
      doctors ( name, specialty )
    `)
    .order('reviewed_at', { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor Resource Allocation</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Live capacity monitoring, real-time schedule rosters, specialty workload distribution, and conflict-free booking audits.
          </p>
        </div>
      </div>

      <AdminAllocationClient
        initialDoctors={doctors || []}
        initialAvailability={availability || []}
        initialAppointments={todayAppointments || []}
        departments={departments || []}
        auditLogs={auditLogs || []}
        verificationHistory={verificationHistory || []}
        todayDate={today}
      />
    </div>
  )
}
