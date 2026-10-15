"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/utils/supabase/client"
import { Users, Clock, Bell, CheckCircle2, AlertCircle, RefreshCw, Volume2, VolumeX } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface LiveQueueTrackerProps {
  appointmentId: string
  doctorId?: string
  clinicId?: string
  ticketNumber: number
  appointmentDate: string
  appointmentTime: string
  doctorName?: string
  clinicName?: string
}

export function LiveQueueTracker({
  appointmentId,
  doctorId,
  clinicId,
  ticketNumber,
  appointmentDate,
  appointmentTime,
  doctorName,
  clinicName,
}: LiveQueueTrackerProps) {
  const [currentServingToken, setCurrentServingToken] = useState<number>(1)
  const [myStatus, setMyStatus] = useState<"scheduled" | "checked_in" | "in_consultation" | "completed">("scheduled")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const supabase = createClient()

  // Calculate patients ahead
  const patientsAhead = Math.max(0, ticketNumber - currentServingToken)
  // Assuming average 12 minutes per consultation
  const estimatedWaitMins = patientsAhead * 12

  const playChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime) // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15) // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.6)
    } catch {
      // Audio autoplay policy fallback
    }
  }, [soundEnabled])

  const fetchQueueState = useCallback(async () => {
    setIsRefreshing(true)
    try {
      // Fetch latest appointments for this doctor on this date
      const { data, error } = await supabase
        .from('appointments')
        .select('id, ticket_number, status')
        .eq('appointment_date', appointmentDate)
        .order('ticket_number', { ascending: true })

      if (!error && data && data.length > 0) {
        // Find current appointment status
        const currentAppt = data.find(a => a.id === appointmentId)
        if (currentAppt) {
          if (currentAppt.status === 'completed') setMyStatus('completed')
          else if (currentAppt.status === 'in_consultation') setMyStatus('in_consultation')
          else if (currentAppt.status === 'checked_in') setMyStatus('checked_in')
          else setMyStatus('scheduled')
        }

        // Determine currently serving token
        const inConsultation = data.find(a => a.status === 'in_consultation')
        if (inConsultation?.ticket_number) {
          setCurrentServingToken(inConsultation.ticket_number)
        } else {
          // Fallback to highest completed + 1
          const completed = data.filter(a => a.status === 'completed' && a.ticket_number)
          if (completed.length > 0) {
            const maxCompleted = Math.max(...completed.map(a => a.ticket_number!))
            setCurrentServingToken(Math.min(ticketNumber, maxCompleted + 1))
          } else {
            setCurrentServingToken(1)
          }
        }
      }
      setLastUpdated(new Date())
    } catch (err) {
      console.warn("Queue fetch error:", err)
    } finally {
      setIsRefreshing(false)
    }
  }, [appointmentId, appointmentDate, ticketNumber, supabase])

  useEffect(() => {
    fetchQueueState()
    const interval = setInterval(fetchQueueState, 15000) // Poll every 15s
    return () => clearInterval(interval)
  }, [fetchQueueState])

  // Alert when it's patient's turn
  useEffect(() => {
    if (currentServingToken === ticketNumber && myStatus !== 'completed') {
      playChime()
    }
  }, [currentServingToken, ticketNumber, myStatus, playChime])

  const isMyTurn = currentServingToken === ticketNumber
  const isPast = currentServingToken > ticketNumber || myStatus === 'completed'

  return (
    <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="bg-surface/60 border-b border-border pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <CardTitle className="text-sm font-semibold text-foreground">
            Live Clinic Queue Tracker
          </CardTitle>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface-elevated transition-colors"
            title={soundEnabled ? "Mute Turn Alerts" : "Enable Sound Alerts"}
            aria-label="Toggle turn sound notification"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={fetchQueueState}
            disabled={isRefreshing}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-surface-elevated transition-colors"
            title="Refresh Queue"
            aria-label="Refresh queue"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Top Split Numbers: Now Serving vs Your Token */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-4 rounded-xl bg-surface border border-border flex flex-col items-center justify-center">
            <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-1">
              Now Serving
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-foreground">
              #{currentServingToken.toString().padStart(2, '0')}
            </div>
            <span className="text-[11px] text-muted-foreground mt-1">In Doctor Cabin</span>
          </div>

          <div className={`p-4 rounded-xl border flex flex-col items-center justify-center ${
            isMyTurn 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
              : 'bg-primary/10 border-primary/30 text-primary'
          }`}>
            <span className="text-xs uppercase font-semibold tracking-wider mb-1">
              Your Token
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono">
              #{ticketNumber.toString().padStart(2, '0')}
            </div>
            <span className="text-[11px] mt-1 font-medium">
              {isMyTurn ? "🔔 Your Turn Now!" : isPast ? "Consultation Finished" : `${patientsAhead} in queue`}
            </span>
          </div>
        </div>

        {/* Status Callout Banner */}
        {isMyTurn ? (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3">
            <Bell className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 animate-bounce" />
            <div>
              <p className="font-bold text-sm text-emerald-950 dark:text-emerald-200">
                Token #{ticketNumber.toString().padStart(2, '0')} is called!
              </p>
              <p className="text-xs text-emerald-900 dark:text-emerald-300">
                Please proceed directly to the doctor&apos;s consultation room.
              </p>
            </div>
          </div>
        ) : isPast ? (
          <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center gap-3 text-xs text-muted-foreground">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>Consultation recorded. Thank you for visiting!</span>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-4 h-4 text-primary" /> Patients ahead:
              </span>
              <span className="font-bold text-foreground text-sm">{patientsAhead}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" /> Estimated wait:
              </span>
              <span className="font-bold text-foreground text-sm">~{estimatedWaitMins} mins</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/80 pt-3">
          <span>{clinicName || "Clinic Reception"}</span>
          <span>Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </CardContent>
    </Card>
  )
}
