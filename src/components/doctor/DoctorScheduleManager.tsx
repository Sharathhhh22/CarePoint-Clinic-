"use client"

import { useState, useEffect } from "react"
import { 
  Clock, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldAlert,
  Save,
  Coffee
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DoctorScheduleManagerProps {
  doctorId?: string
}

export function DoctorScheduleManager({ doctorId }: DoctorScheduleManagerProps) {
  const [slotDuration, setSlotDuration] = useState<number>(15)
  const [bufferTime, setBufferTime] = useState<number>(5)
  const [blackoutDates, setBlackoutDates] = useState<string[]>([])
  const [newLeaveDate, setNewLeaveDate] = useState<string>("")
  const [isSaved, setIsSaved] = useState(false)

  // Load from localStorage or defaults
  useEffect(() => {
    const savedDuration = localStorage.getItem("sloturself_doc_slot_duration")
    if (savedDuration) setSlotDuration(parseInt(savedDuration, 10))

    const savedBuffer = localStorage.getItem("sloturself_doc_buffer")
    if (savedBuffer) setBufferTime(parseInt(savedBuffer, 10))

    const savedDates = localStorage.getItem("sloturself_doc_blackout_dates")
    if (savedDates) setBlackoutDates(JSON.parse(savedDates))
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem("sloturself_doc_slot_duration", slotDuration.toString())
    localStorage.setItem("sloturself_doc_buffer", bufferTime.toString())
    localStorage.setItem("sloturself_doc_blackout_dates", JSON.stringify(blackoutDates))

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  const handleAddLeaveDate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeaveDate) return
    if (blackoutDates.includes(newLeaveDate)) {
      alert("This date is already marked as a leave day.")
      return
    }

    const updated = [...blackoutDates, newLeaveDate].sort()
    setBlackoutDates(updated)
    setNewLeaveDate("")
    localStorage.setItem("sloturself_doc_blackout_dates", JSON.stringify(updated))
  }

  const handleRemoveLeaveDate = (dateToRemove: string) => {
    const updated = blackoutDates.filter(d => d !== dateToRemove)
    setBlackoutDates(updated)
    localStorage.setItem("sloturself_doc_blackout_dates", JSON.stringify(updated))
  }

  return (
    <div className="space-y-6">
      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Today&apos;s Patients</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">12</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">8 completed • 4 in queue</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Estimated Revenue</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">₹6,000</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">₹500 consultation fee</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              ₹
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Consultation</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">14m</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">96% on-time rate</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Queue Efficiency</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">98%</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">&lt; 8 mins lobby wait</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Practice Slot Configuration */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Consultation Slot Cadence
            </CardTitle>
            <CardDescription className="text-xs">
              Configure how calendar slots and transition intervals are computed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Appointment Duration per Patient
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[15, 20, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSlotDuration(mins)}
                    className={`py-2.5 rounded-xl border font-semibold transition-all ${
                      slotDuration === mins
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-surface border-border text-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-primary" /> Buffer Break Between Slots
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[0, 5, 10].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setBufferTime(mins)}
                    className={`py-2 rounded-xl border font-semibold transition-all ${
                      bufferTime === mins
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-surface border-border text-foreground hover:bg-surface-elevated"
                    }`}
                  >
                    {mins === 0 ? "No buffer" : `${mins} min rest`}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSaveSettings}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-10 text-xs rounded-xl mt-2"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {isSaved ? "Slot Settings Saved!" : "Save Practice Cadence"}
            </Button>
          </CardContent>
        </Card>

        {/* Leave & Blackout Dates Manager */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Leave & Surgery Blackout Dates
            </CardTitle>
            <CardDescription className="text-xs">
              Mark personal leave or hospital round days to block patient bookings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddLeaveDate} className="flex items-center gap-2">
              <input
                type="date"
                value={newLeaveDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewLeaveDate(e.target.value)}
                className="h-10 px-3 rounded-xl border border-border bg-input-bg text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary flex-1"
                required
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-10 text-xs rounded-xl px-4 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Mark Off
              </Button>
            </form>

            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {blackoutDates.length === 0 ? (
                <div className="p-4 text-center bg-surface rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                  No upcoming blackout dates scheduled. You are available on all working clinic days.
                </div>
              ) : (
                blackoutDates.map((dateStr) => (
                  <div
                    key={dateStr}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border text-xs"
                  >
                    <span className="font-semibold text-foreground">
                      {new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLeaveDate(dateStr)}
                      className="p-1 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                      title="Remove blackout"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
