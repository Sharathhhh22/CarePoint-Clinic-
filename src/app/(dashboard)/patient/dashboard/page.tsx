import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Activity, FileText, PlusCircle, ArrowRight, Stethoscope } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import EmergencyButton from "@/components/telephony/EmergencyButton"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { formatDoctorName } from "@/lib/utils"

export const revalidate = 0

export default async function PatientDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, mobile, email")
    .eq("id", user.id)
    .maybeSingle()

  // If user is doctor, redirect to doctor dashboard
  if (profile?.role === "doctor") {
    redirect("/doctor/dashboard")
  }

  // If user is admin/staff, redirect to admin dashboard
  if (profile?.role === "admin" || profile?.role === "staff") {
    redirect("/admin/dashboard")
  }

  // Fetch patient's appointments
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id, appointment_date, appointment_time, status, payment_mode, transaction_id, doctor_id, ticket_number,
      doctors(name, specialty),
      clinics(name, address)
    `)
    .eq("patient_id", user.id)
    .order("appointment_date", { ascending: true })

  // Stats
  const now = new Date()
  const allAppointments = appointments || []
  const upcomingAppointments = allAppointments.filter(a => 
    a.status === "confirmed" && new Date(`${a.appointment_date}T${a.appointment_time}`) >= now
  ).sort((a, b) => 
    new Date(`${a.appointment_date}T${a.appointment_time}`).getTime() - new Date(`${b.appointment_date}T${b.appointment_time}`).getTime()
  )

  const pastVisitsCount = allAppointments.filter(a => a.status === "completed" || new Date(`${a.appointment_date}T${a.appointment_time}`) < now).length

  // Count available active doctors
  const { count: doctorsCount } = await supabase
    .from("doctors")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Welcome, {profile?.full_name || "Patient"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Your patient portal for appointment management and digital passes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/appointments/new">
            <Button className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>Book Appointment</span>
            </Button>
          </Link>
          <Link href="/departments">
            <Button variant="outline" className="border-border hover:bg-surface flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span>Find Specialists</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Visits</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled clinic consultations</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Visits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pastVisitsCount}</div>
            <p className="text-xs text-muted-foreground">Total consultations attended</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Specialists</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{doctorsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Verified doctors on platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments List */}
      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Upcoming Consultations</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Your confirmed bookings and digital passes
            </CardDescription>
          </div>
          <Link href="/appointments" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center rounded-xl border border-dashed border-border bg-surface/50">
              <div className="text-center p-4">
                <Calendar className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-foreground">No upcoming visits</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                  You don&apos;t have any scheduled appointments. Book a consultation with our verified doctors.
                </p>
                <div className="mt-4">
                  <Link href="/appointments/new">
                    <Button size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold">
                      Book an Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((apt: any) => (
                <div 
                  key={apt.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 last:border-0 gap-3"
                >
                  <div>
                    <p className="font-semibold text-foreground text-base">
                      {formatDoctorName(apt.doctors?.name)}
                    </p>
                    <p className="text-xs text-primary font-medium">{apt.doctors?.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{apt.clinics?.name}</p>
                  </div>
                  <div className="sm:text-right flex flex-col sm:items-end gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{apt.appointment_date}</span>
                      <span className="text-xs text-muted-foreground">• {apt.appointment_time}</span>
                    </div>
                    {apt.ticket_number && (
                      <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold">
                        Token #{apt.ticket_number}
                      </span>
                    )}
                    <div className="flex flex-wrap gap-2 justify-start sm:justify-end mt-1 items-center">
                      <StatusBadge status={apt.payment_mode || "pay_at_clinic"} type="payment" />
                      <StatusBadge status="upcoming" />
                      <EmergencyButton 
                        doctorId={apt.doctor_id} 
                        doctorName={apt.doctors?.name} 
                        appointmentId={apt.id} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
