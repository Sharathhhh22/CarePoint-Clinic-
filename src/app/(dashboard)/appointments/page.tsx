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
          <h2 className="section-title text-slate-900 dark:text-white">Appointments History</h2>
          <p className="text-slate-500 dark:text-slate-400">
            {isAdminOrStaff ? "Manage all clinic appointments." : "View your past and upcoming appointments."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white font-medium">
            <Link href="/appointments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-8 space-y-8">
        
        {/* Upcoming Appointments */}
        <Card className="border-teal-100 dark:border-teal-900/40">
          <CardHeader className="bg-teal-50/50 dark:bg-teal-950/20 rounded-t-lg pb-4">
            <CardTitle className="text-teal-950 dark:text-teal-100">Upcoming Appointments</CardTitle>
            <CardDescription className="text-teal-700/80 dark:text-teal-300/80">
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
                      <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <Calendar className="mb-2 h-8 w-8 text-slate-400 dark:text-slate-500" />
                        <p>No upcoming appointments found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  upcoming.map((apt: any) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        {apt.appointment_date} <br/>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{apt.appointment_time}</span>
                      </TableCell>
                      {isAdminOrStaff && (
                        <TableCell>
                          <div className="font-medium text-slate-900 dark:text-white">{apt.profiles?.full_name || 'Anonymous'}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{apt.profiles?.mobile || 'No mobile'}</div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="font-medium text-slate-900 dark:text-white">Dr. {apt.doctors?.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{apt.departments?.name}</div>
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-slate-300">{apt.clinics?.name}</TableCell>
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
                      <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <Calendar className="mb-2 h-8 w-8 text-slate-400 dark:text-slate-500" />
                        <p>No past appointments found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  past.map((apt: any) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                        {apt.appointment_date} <br/>
                        <span className="text-xs text-slate-400">{apt.appointment_time}</span>
                      </TableCell>
                      {isAdminOrStaff && (
                        <TableCell>
                          <div className="font-medium text-slate-700 dark:text-slate-300">{apt.profiles?.full_name}</div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="font-medium text-slate-700 dark:text-slate-300">Dr. {apt.doctors?.name}</div>
                        <div className="text-xs text-slate-400">{apt.departments?.name}</div>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{apt.clinics?.name}</TableCell>
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
