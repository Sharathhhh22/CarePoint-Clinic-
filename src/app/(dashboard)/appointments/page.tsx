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
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-foreground text-2xl sm:text-3xl font-bold">Appointments History</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdminOrStaff ? "Manage all clinic appointments." : "View your past and upcoming appointments."}
          </p>
        </div>
        <div className="flex items-center">
          <Button asChild className="w-full sm:w-auto min-h-[44px] bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shadow-sm transition-all active:scale-[0.99]">
            <Link href="/appointments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
        
        {/* Upcoming Appointments */}
        <Card className="border-border">
          <CardHeader className="bg-surface rounded-t-lg pb-4 border-b border-border">
            <CardTitle className="text-foreground text-lg sm:text-xl">Upcoming Appointments</CardTitle>
            <CardDescription className="text-muted-foreground text-xs sm:text-sm">
              Scheduled visits that have not yet occurred.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
            </div>

            {/* Mobile Stacked Card View */}
            <div className="md:hidden space-y-3">
              {upcoming.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center text-muted-foreground">
                  <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm">No upcoming appointments found.</p>
                </div>
              ) : (
                upcoming.map((apt: any) => (
                  <div 
                    key={apt.id}
                    className="p-4 rounded-xl border border-border bg-surface-elevated/40 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2.5">
                      <div>
                        <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-primary shrink-0" />
                          <span>{apt.appointment_date}</span>
                        </div>
                        <span className="text-xs text-muted-foreground pl-5.5 font-medium">{apt.appointment_time}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 justify-end">
                        <StatusBadge status={apt.payment_mode || "pay_at_clinic"} type="payment" />
                        <StatusBadge status="upcoming" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-sm">
                      <div>
                        <span className="text-xs text-muted-foreground block">Doctor & Specialty</span>
                        <span className="font-medium text-foreground">{formatDoctorName(apt.doctors?.name)}</span>
                        {apt.departments?.name && (
                          <span className="text-xs text-muted-foreground ml-1">({apt.departments?.name})</span>
                        )}
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-muted-foreground block">Clinic</span>
                        <span className="text-foreground text-xs">{apt.clinics?.name || "Main Clinic"}</span>
                      </div>
                      {isAdminOrStaff && (
                        <div className="mt-1">
                          <span className="text-xs text-muted-foreground block">Patient</span>
                          <span className="text-foreground text-xs font-medium">{apt.profiles?.full_name || 'Anonymous'} ({apt.profiles?.mobile || 'No mobile'})</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                      <Link 
                        href={`/receipt/${apt.id}`}
                        className="text-xs font-semibold text-primary hover:underline min-h-[36px] flex items-center"
                      >
                        View Digital Pass &rarr;
                      </Link>
                      <div className="flex items-center gap-2">
                        {!isAdminOrStaff && (
                          <EmergencyButton 
                            doctorId={apt.doctor_id} 
                            doctorName={apt.doctors?.name} 
                            appointmentId={apt.id} 
                          />
                        )}
                        <CancelButton appointmentId={apt.id} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card className="border-border">
          <CardHeader className="bg-surface rounded-t-lg pb-4 border-b border-border">
            <CardTitle className="text-foreground text-lg sm:text-xl">Past Appointments</CardTitle>
            <CardDescription className="text-muted-foreground text-xs sm:text-sm">
              History of completed or cancelled visits.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
            </div>

            {/* Mobile Stacked Card View */}
            <div className="md:hidden space-y-3">
              {past.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center text-muted-foreground">
                  <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm">No past appointments found.</p>
                </div>
              ) : (
                past.map((apt: any) => (
                  <div 
                    key={apt.id}
                    className="p-4 rounded-xl border border-border bg-surface-elevated/40 space-y-2.5 opacity-90"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2">
                      <div>
                        <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>{apt.appointment_date}</span>
                        </div>
                        <span className="text-xs text-muted-foreground pl-5.5 font-medium">{apt.appointment_time}</span>
                      </div>
                      <StatusBadge status={apt.status || "completed"} />
                    </div>

                    <div className="text-sm space-y-1">
                      <div>
                        <span className="text-xs text-muted-foreground block">Doctor</span>
                        <span className="font-medium text-foreground">{formatDoctorName(apt.doctors?.name)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Clinic</span>
                        <span className="text-foreground text-xs">{apt.clinics?.name || "Main Clinic"}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
