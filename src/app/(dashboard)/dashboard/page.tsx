import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Clock, Activity } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import EmergencyButton from "@/components/telephony/EmergencyButton"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { formatDoctorName } from "@/lib/utils"

export const revalidate = 0

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile to check role
  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).maybeSingle()
  
  if (profile?.role === 'doctor') {
    redirect('/doctor/dashboard')
  }

  const isAdminOrStaff = profile?.role === 'admin' || profile?.role === 'staff'

  // Fetch appointments. 
  const query = supabase
    .from('appointments')
    .select(`
      id, appointment_date, appointment_time, status, payment_mode, transaction_id, doctor_id,
      doctors(name),
      clinics(name),
      profiles(full_name)
    `)
    .order('appointment_date', { ascending: true })
  
  const { data: appointments } = await query

  // Stats calculation
  const totalAppointments = appointments?.length || 0
  const now = new Date()
  const upcomingAppointments = appointments?.filter(a => a.status === 'confirmed' && new Date(a.appointment_date + 'T' + a.appointment_time) >= now).sort((a, b) => new Date(a.appointment_date + 'T' + a.appointment_time).getTime() - new Date(b.appointment_date + 'T' + b.appointment_time).getTime()) || []
  
  const uniquePatients = new Set(appointments?.map(a => (a.profiles as any)?.full_name)).size

  const { count: doctorsCount } = await supabase.from('doctors').select('*', { count: 'exact', head: true }).eq('is_active', true)

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[1200px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title text-foreground">
            Welcome, {profile?.full_name || 'User'}
          </h1>
          <p className="text-muted-foreground mt-1">{isAdminOrStaff ? 'Clinic Management Dashboard' : 'Your Patient Portal'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdminOrStaff && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Unique Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="card-title text-2xl text-foreground font-bold">{uniquePatients}</div>
              <p className="text-xs text-muted-foreground">Registered in system</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{isAdminOrStaff ? 'Total Appointments' : 'My Appointments'}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="card-title text-2xl text-foreground font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Doctors</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="card-title text-2xl text-foreground font-bold">{doctorsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Active specialists</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="card-title text-2xl text-foreground font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled appointments</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              {isAdminOrStaff ? "The most recent bookings across all clinics." : "Your upcoming scheduled visits."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-border bg-surface">
                <div className="text-center p-4">
                  <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-foreground">No upcoming appointments</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You have no scheduled visits at this time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 5).map((apt: any) => (
                  <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 last:border-0 gap-3">
                    <div>
                      {isAdminOrStaff && <p className="font-semibold text-primary">{apt.profiles?.full_name}</p>}
                      <p className="font-medium text-foreground">{formatDoctorName(apt.doctors?.name)}</p>
                      <p className="text-sm text-muted-foreground">{apt.clinics?.name}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="font-medium text-foreground text-sm">{apt.appointment_date}</p>
                      <p className="text-xs text-muted-foreground">{apt.appointment_time}</p>
                      <div className="flex flex-wrap gap-2 justify-start sm:justify-end mt-2 items-center">
                        <StatusBadge status={apt.payment_mode || "pay_at_clinic"} type="payment" />
                        <StatusBadge status="upcoming" />
                        {!isAdminOrStaff && (
                          <EmergencyButton 
                            doctorId={apt.doctor_id} 
                            doctorName={apt.doctors?.name} 
                            appointmentId={apt.id} 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
