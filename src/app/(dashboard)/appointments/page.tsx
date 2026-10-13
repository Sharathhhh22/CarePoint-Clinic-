import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import CancelButton from "./CancelButton"
import EmergencyButton from "@/components/telephony/EmergencyButton"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { formatDoctorName } from "@/lib/utils"

export const revalidate = 0 // Always fetch latest data

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile to check role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  const isAdminOrStaff = profile?.role === 'admin' || profile?.role === 'staff'

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id, appointment_date, appointment_time, status, reason, payment_mode, doctor_id,
      doctors(name),
      clinics(name),
      departments(name),
      profiles(full_name, mobile)
    `)
    .order('appointment_date', { ascending: false })

  const now = new Date()
  const upcoming = appointments?.filter(a => ['confirmed', 'held'].includes(a.status) && new Date(a.appointment_date + 'T' + a.appointment_time) >= now) || []
  const past = appointments?.filter(a => !(['confirmed', 'held'].includes(a.status) && new Date(a.appointment_date + 'T' + a.appointment_time) >= now)) || []

  return (
    <div className="container mx-auto p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="section-title text-foreground">Appointments History</h1>
          <p className="text-muted-foreground">
            {isAdminOrStaff ? "Manage all clinic appointments." : "View your past and upcoming appointments."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium">
            <Link href="/appointments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-8 space-y-8">
        
        {/* Upcoming Appointments */}
        <Card className="border-border">
          <CardHeader className="bg-surface rounded-t-lg pb-4 border-b border-border">
            <CardTitle className="text-foreground">Upcoming Appointments</CardTitle>
            <CardDescription className="text-muted-foreground">
              Scheduled visits that have not yet occurred.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  {isAdminOrStaff && <TableHead>Patient</TableHead>}
                  <TableHead>Doctor & Specialty</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdminOrStaff ? 5 : 4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p>No upcoming appointments found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  upcoming.map((apt: any) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium text-foreground">
                        {apt.appointment_date} <br/>
                        <span className="text-xs text-muted-foreground">{apt.appointment_time}</span>
                      </TableCell>
                      {isAdminOrStaff && (
                        <TableCell>
                          <div className="font-medium text-foreground">{apt.profiles?.full_name || 'Anonymous'}</div>
                          <div className="text-xs text-muted-foreground">{apt.profiles?.mobile || 'No mobile'}</div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="font-medium text-foreground">{formatDoctorName(apt.doctors?.name)}</div>
                        <div className="text-xs text-muted-foreground">{apt.departments?.name}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{apt.clinics?.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <StatusBadge status={apt.payment_mode || "pay_at_clinic"} type="payment" />
                          <StatusBadge status="upcoming" />
                          {!isAdminOrStaff && (
                            <EmergencyButton 
                              doctorId={apt.doctor_id} 
                              doctorName={apt.doctors?.name} 
                              appointmentId={apt.id} 
                            />
                          )}
                          <CancelButton appointmentId={apt.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
            <CardDescription>
              History of completed or cancelled visits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  {isAdminOrStaff && <TableHead>Patient</TableHead>}
                  <TableHead>Doctor & Specialty</TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {past.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdminOrStaff ? 5 : 4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p>No past appointments found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  past.map((apt: any) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium text-foreground">
                        {apt.appointment_date} <br/>
                        <span className="text-xs text-muted-foreground">{apt.appointment_time}</span>
                      </TableCell>
                      {isAdminOrStaff && (
                        <TableCell>
                          <div className="font-medium text-foreground">{apt.profiles?.full_name}</div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="font-medium text-foreground">{formatDoctorName(apt.doctors?.name)}</div>
                        <div className="text-xs text-muted-foreground">{apt.departments?.name}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{apt.clinics?.name}</TableCell>
                      <TableCell className="text-right">
                        <StatusBadge status={apt.status || "completed"} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
