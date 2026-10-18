import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Stethoscope, Activity, Users, CreditCard, FileSpreadsheet } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verify Admin Access
  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  // Fetch counts
  const { count: clinicsCount } = await supabase.from('clinics').select('*', { count: 'exact', head: true })
  const { count: deptsCount } = await supabase.from('departments').select('*', { count: 'exact', head: true })
  const { count: doctorsCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('is_active', true)
  const { count: pendingDoctorsCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  const today = new Date().toISOString().split('T')[0]
  const { count: todayBookingsCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', today).in('status', ['confirmed', 'held'])
  const { count: patientsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).not('role', 'in', '("admin", "staff")')
  const { count: totalAppointmentsCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true })

  // Quick revenue fetch for confirmed/completed appointments
  const { data: revenueData } = await supabase
    .from('appointments')
    .select('status, doctors(consultation_fee)')
    .in('status', ['confirmed', 'completed'])
    .limit(100)

  let totalRevenue = 0
  if (revenueData) {
    for (const apt of revenueData) {
      const fee = Number((apt.doctors as any)?.consultation_fee) || 500
      totalRevenue += fee
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Control Panel</h1>
          <p className="text-muted-foreground">Manage clinics, departments, real-time doctor allocations, payments, reports, and medical staff.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Resource Allocation Management */}
        <Link href="/admin/allocation" className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md h-full relative overflow-hidden border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Resource Allocation</CardTitle>
              <Activity className="h-5 w-5 text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{todayBookingsCount || 0}</div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">Today&apos;s active bookings</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Live Roster
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Payments & Revenue Settlements */}
        <Link href="/admin/payments" className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md h-full relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Payments & Settlements</CardTitle>
              <CreditCard className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">₹{totalRevenue.toLocaleString()}</div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">Gross consultation value</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                  Stripe + Cash
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Reports & Analytics */}
        <Link href="/admin/reports" className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md h-full relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Reports & Analytics</CardTitle>
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{totalAppointmentsCount || 0}</div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">Total booking throughput</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  CSV Export
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Clinics Management */}
        <Link href="/admin/clinics" className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Clinics</CardTitle>
              <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{clinicsCount || 0}</div>
              <p className="text-sm text-muted-foreground">Active locations</p>
            </CardContent>
          </Card>
        </Link>

        {/* Departments Management */}
        <Link href="/admin/departments" className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Departments</CardTitle>
              <Activity className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{deptsCount || 0}</div>
              <p className="text-sm text-muted-foreground">Medical specialties</p>
            </CardContent>
          </Card>
        </Link>

        {/* Doctors Management */}
        <Link href="/admin/doctors" className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md h-full relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Doctors</CardTitle>
              <Stethoscope className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{doctorsCount || 0}</div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-muted-foreground">Practicing physicians</p>
                {(pendingDoctorsCount || 0) > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                    {pendingDoctorsCount} pending review
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Patients Management */}
        <Link href="/admin/patients" className="block group">
          <Card className="transition-all hover:border-primary/50 hover:shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Patients</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{patientsCount || 0}</div>
              <p className="text-sm text-muted-foreground">Registered patients</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
