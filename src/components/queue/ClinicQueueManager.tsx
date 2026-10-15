"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import { 
  Users, 
  Search, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Phone, 
  Video, 
  FileText, 
  AlertCircle,
  ArrowRight,
  RefreshCw,
  QrCode,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

interface QueuePatient {
  id: string
  ticket_number: number
  patient_name: string
  patient_phone?: string
  appointment_time: string
  status: string
  reason?: string
  payment_mode?: string
}

interface ClinicQueueManagerProps {
  doctorId?: string
  clinicId?: string
  doctorName?: string
  onWritePrescription?: (patient: { id: string, name: string, appointmentId: string }) => void
}

export function ClinicQueueManager({ 
  doctorId, 
  clinicId,
  doctorName,
  onWritePrescription 
}: ClinicQueueManagerProps) {
  const [patients, setPatients] = useState<QueuePatient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchToken, setSearchToken] = useState("")
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "waiting" | "completed">("all")

  const supabase = createClient()

  const fetchQueue = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('appointments')
        .select('id, ticket_number, patient_name, patient_phone, appointment_time, status, reason, payment_mode, doctor_id')
        .eq('appointment_date', selectedDate)
        .order('ticket_number', { ascending: true })

      if (doctorId) {
        query = query.eq('doctor_id', doctorId)
      }

      const { data, error } = await query

      if (error) throw error

      const formatted: QueuePatient[] = (data || []).map((item: any, idx: number) => ({
        id: item.id,
        ticket_number: item.ticket_number || idx + 1,
        patient_name: item.patient_name || "Patient",
        patient_phone: item.patient_phone,
        appointment_time: item.appointment_time,
        status: item.status || "confirmed",
        reason: item.reason,
        payment_mode: item.payment_mode
      }))

      setPatients(formatted)
    } catch (err) {
      console.warn("Queue fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [selectedDate, doctorId, supabase])

  useEffect(() => {
    fetchQueue()
  }, [fetchQueue])

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    setActionLoadingId(appointmentId)
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appointmentId)

      if (error) throw error

      setPatients(prev => prev.map(p => p.id === appointmentId ? { ...p, status: newStatus } : p))
    } catch (err) {
      console.error("Status update error:", err)
      alert("Failed to update status. Please try again.")
    } finally {
      setActionLoadingId(null)
    }
  }

  // Quick ticket search / check-in
  const handleQuickCheckin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchToken.trim()) return

    const parsedNum = parseInt(searchToken.replace(/[^0-9]/g, ''), 10)
    const match = patients.find(p => p.ticket_number === parsedNum)

    if (match) {
      handleUpdateStatus(match.id, 'checked_in')
      setSearchToken("")
      alert(`Token #${match.ticket_number} (${match.patient_name}) marked as Checked In!`)
    } else {
      alert(`No appointment found with Token #${searchToken} for today.`)
    }
  }

  // Find currently consulting patient
  const activePatient = patients.find(p => p.status === 'in_consultation')
  const waitingPatients = patients.filter(p => p.status !== 'completed' && p.status !== 'cancelled')

  // Filter list
  const filteredPatients = patients.filter(p => {
    if (filter === "waiting") return p.status !== 'completed' && p.status !== 'cancelled'
    if (filter === "completed") return p.status === 'completed'
    return true
  })

  const callNextPatient = () => {
    // If there is an active patient, complete them first or find the next checked_in / confirmed patient
    const nextInLine = patients.find(p => p.status === 'checked_in' || p.status === 'confirmed')
    if (nextInLine) {
      handleUpdateStatus(nextInLine.id, 'in_consultation')
    } else {
      alert("No waiting patients in queue.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Clinic Queue Console</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time lobby queue & patient intake management • {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button 
            onClick={callNextPatient}
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-10 px-4 rounded-xl flex items-center gap-2 shadow-sm"
          >
            <UserCheck className="w-4 h-4" /> Call Next Patient
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchQueue}
            disabled={loading}
            className="h-10 px-3 rounded-xl border-border"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Live Reception Quick Token Check-In */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <form onSubmit={handleQuickCheckin} className="md:col-span-2 bg-card p-4 rounded-xl border border-border flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary shrink-0 ml-1" />
          <input
            type="text"
            value={searchToken}
            onChange={(e) => setSearchToken(e.target.value)}
            placeholder="Scan QR or enter Token # to check in patient (e.g. 05)..."
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
          />
          <Button type="submit" size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground shrink-0 rounded-lg">
            Check In
          </Button>
        </form>

        <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border">
          <Calendar className="w-4 h-4 text-muted-foreground ml-2 shrink-0" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Currently In Cabin Banner */}
      {activePatient ? (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-mono font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md">
              #{activePatient.ticket_number.toString().padStart(2, '0')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                  CURRENTLY IN CONSULTATION
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="text-lg font-bold text-foreground">{activePatient.patient_name}</h3>
              <p className="text-xs text-muted-foreground">
                Time: {activePatient.appointment_time} • {activePatient.reason || "General Consultation"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Link 
              href={`/teleconsult/${activePatient.id}`}
              className="px-3.5 py-2 rounded-xl bg-card border border-border hover:border-primary text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Video className="w-4 h-4 text-primary" /> Video Call
            </Link>

            {onWritePrescription && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWritePrescription({
                  id: activePatient.id,
                  name: activePatient.patient_name,
                  appointmentId: activePatient.id
                })}
                className="text-xs font-semibold h-9 rounded-xl border-border"
              >
                <FileText className="w-4 h-4 mr-1 text-primary" /> Write Rx
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => handleUpdateStatus(activePatient.id, 'completed')}
              disabled={actionLoadingId === activePatient.id}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-9 px-4 rounded-xl text-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" /> Finish Consultation
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-surface border border-border text-center text-xs text-muted-foreground">
          No patient currently in consultation. Click <span className="font-semibold text-foreground">&ldquo;Call Next Patient&rdquo;</span> to start.
        </div>
      )}

      {/* Filter Tabs & Patient Queue Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filter === "all" ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All Today ({patients.length})
            </button>
            <button
              onClick={() => setFilter("waiting")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filter === "waiting" ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Waiting Queue ({waitingPatients.length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filter === "completed" ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Completed ({patients.filter(p => p.status === 'completed').length})
            </button>
          </div>

          <span className="text-xs text-muted-foreground">
            {filteredPatients.length} record{filteredPatients.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center bg-card rounded-2xl border border-dashed border-border text-muted-foreground text-sm">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No appointments found for this date.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPatients.map((patient) => {
              const isInCabin = patient.status === 'in_consultation'
              const isCheckedIn = patient.status === 'checked_in'
              const isCompleted = patient.status === 'completed'

              return (
                <div
                  key={patient.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isInCabin 
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xs' 
                      : isCheckedIn 
                        ? 'bg-primary/5 border-primary/30' 
                        : isCompleted
                          ? 'bg-surface/50 border-border opacity-70'
                          : 'bg-card border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-xl font-mono font-bold text-base flex items-center justify-center shrink-0 ${
                      isInCabin 
                        ? 'bg-emerald-600 text-white' 
                        : isCheckedIn 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-surface border border-border text-foreground'
                    }`}>
                      #{patient.ticket_number.toString().padStart(2, '0')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{patient.patient_name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isInCabin 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : isCheckedIn 
                              ? 'bg-primary/15 text-primary' 
                              : isCompleted 
                                ? 'bg-muted text-muted-foreground' 
                                : 'bg-surface-elevated text-muted-foreground border border-border'
                        }`}>
                          {patient.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Slot: {patient.appointment_time} • {patient.reason || "General Visit"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-border">
                    {patient.patient_phone && (
                      <a 
                        href={`tel:${patient.patient_phone}`}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
                        title="Call Patient"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}

                    <Link
                      href={`/teleconsult/${patient.id}`}
                      className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                      title="Start Teleconsultation Video Call"
                    >
                      <Video className="w-4 h-4" />
                    </Link>

                    {patient.status !== 'completed' && (
                      <>
                        {!isCheckedIn && !isInCabin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(patient.id, 'checked_in')}
                            disabled={actionLoadingId === patient.id}
                            className="h-8 text-xs font-semibold rounded-lg border-border"
                          >
                            Check In
                          </Button>
                        )}

                        {!isInCabin && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(patient.id, 'in_consultation')}
                            disabled={actionLoadingId === patient.id}
                            className="bg-primary hover:bg-primary-hover text-primary-foreground h-8 text-xs font-semibold rounded-lg"
                          >
                            Call to Cabin
                          </Button>
                        )}

                        {isInCabin && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(patient.id, 'completed')}
                            disabled={actionLoadingId === patient.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs font-semibold rounded-lg"
                          >
                            Complete
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
