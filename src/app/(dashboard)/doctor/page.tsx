"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, User, FileText, CheckCircle2, Activity, XCircle, Bot, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmergencySettings } from "@/components/telephony/EmergencySettings"
import { formatDoctorName } from "@/lib/utils"
import { DoctorAiNoteModal } from "./DoctorAiNoteModal"

export default function DoctorPortal() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [doctorProfile, setDoctorProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedApptForAi, setSelectedApptForAi] = useState<any | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchDoctorData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError("Not authenticated")
          setLoading(false)
          return
        }

        // 1. Get the doctor record linked to this user
        const { data: doctorData, error: doctorError } = await supabase
          .from('doctors')
          .select('*')
          .eq('profile_id', user.id)
          .maybeSingle()

        if (doctorError || !doctorData) {
          setError("Doctor profile not found. Please contact administration to link your account.")
          setLoading(false)
          return
        }

        setDoctorProfile(doctorData)

        // 2. Get appointments for this doctor (today and future)
        const today = new Date().toISOString().split('T')[0]
        
        const { data: apptData, error: apptError } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:profiles!appointments_patient_id_fkey(full_name, mobile, email)
          `)
          .eq('doctor_id', doctorData.id)
          .gte('appointment_date', today)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true })

        if (apptError) throw apptError

        setAppointments(apptData || [])
      } catch (err: any) {
        console.error("Error fetching doctor data:", err)
        setError("Failed to load appointments.")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorData()
  }, [])

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error

      setAppointments(prev => prev.map(appt => 
        appt.id === id ? { ...appt, status: newStatus } : appt
      ))
    } catch (err) {
      console.error("Failed to update status", err)
      alert("Failed to update status")
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive/20 bg-destructive/10">
          <CardContent className="p-6 text-center text-destructive">
            {error}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor Portal</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {formatDoctorName(doctorProfile?.name)}. Here is your schedule.</p>
      </div>

      <EmergencySettings doctorId={doctorProfile?.id} initialEnabled={doctorProfile?.emergency_calls_enabled ?? true} />

      <div className="grid gap-6">
        {appointments.length === 0 ? (
          <Card className="bg-surface border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No appointments scheduled</p>
              <p className="text-muted-foreground">You have a clear schedule right now.</p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appt) => (
            <Card key={appt.id} className={`overflow-hidden ${appt.status === 'completed' ? 'opacity-60' : ''}`}>
              <div className="flex flex-col md:flex-row">
                {/* Time & Date Block */}
                <div className="bg-surface border-b md:border-b-0 md:border-r border-border p-6 flex md:flex-col items-center justify-between md:justify-center min-w-[200px]">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
                      {new Date(appt.appointment_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-3xl font-bold text-foreground">{appt.appointment_time.substring(0, 5)}</p>
                  </div>
                  {appt.ticket_number && (
                    <div className="mt-4 px-3 py-1 bg-surface-elevated text-foreground border border-border rounded text-xs font-mono font-bold tracking-wider">
                      TICKET-{appt.ticket_number.toString().padStart(3, '0')}
                    </div>
                  )}
                </div>

                {/* Patient Info Block */}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        {appt.patient?.full_name || 'Unknown Patient'}
                      </h3>
                      {appt.patient?.mobile && (
                        <p className="text-muted-foreground text-sm mt-1">{appt.patient.mobile}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      appt.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                      appt.status === 'cancelled' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800' :
                      'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                    }`}>
                      {appt.status}
                    </span>
                  </div>

                  {appt.reason && (
                    <div className="mb-6 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Reason / Symptoms
                      </p>
                      <p className="text-foreground text-sm">{appt.reason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 border-t border-border pt-4">
                    {appt.status === 'upcoming' && (
                      <>
                        <Button 
                          onClick={() => handleStatusUpdate(appt.id, 'completed')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          size="sm"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Completed
                        </Button>
                        <Button 
                          onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                          variant="outline"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                      </>
                    )}

                    {/* AI Clinical Documentation Button */}
                    <Button
                      onClick={() => setSelectedApptForAi({
                        id: appt.id,
                        patientName: appt.patient?.full_name || 'Patient',
                        reason: appt.reason,
                        appointmentDate: appt.appointment_date,
                        appointmentTime: appt.appointment_time
                      })}
                      variant="outline"
                      size="sm"
                      className="border-primary/40 text-primary hover:bg-primary/10 ml-auto"
                    >
                      <Sparkles className="w-4 h-4 mr-1.5" /> AI SOAP Notes
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* AI SOAP Note Modal */}
      {selectedApptForAi && (
        <DoctorAiNoteModal
          isOpen={Boolean(selectedApptForAi)}
          onClose={() => setSelectedApptForAi(null)}
          appointment={selectedApptForAi}
        />
      )}
    </div>
  )
}
