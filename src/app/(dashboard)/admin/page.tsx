import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Stethoscope, Activity, Users } from "lucide-react"
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
  const { count: doctorsCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true })
  const { count: patientsCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).not('role', 'in', '("admin", "staff")')

  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Control Panel</h1>
          <p className="text-muted-foreground">Manage clinics, departments, and medical staff.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <Card className="transition-all hover:border-primary/50 hover:shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">Doctors</CardTitle>
              <Stethoscope className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{doctorsCount || 0}</div>
              <p className="text-sm text-muted-foreground">Practicing physicians</p>
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
