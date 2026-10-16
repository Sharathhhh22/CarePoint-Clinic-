"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { motion } from "framer-motion"
import { formatDoctorName } from "@/lib/utils"

interface Step3Props {
  data: any
  updateData: (key: string, value: any) => void
  onNext: () => void
  onPrev: () => void
}

export function Step3DateTime({ data, updateData, onNext, onPrev }: Step3Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(data.date || null)
  const [selectedTime, setSelectedTime] = useState<string | null>(data.time || null)
  const [takenSlots, setTakenSlots] = useState<string[]>([])
  const [availabilityList, setAvailabilityList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()
  const doctorId = data.doctorId

  // Fetch doctor custom availability schedule if configured with realtime sync
  useEffect(() => {
    if (!doctorId) return
    async function loadAvailability() {
      try {
        const { data: avail } = await supabase
          .from('doctor_availability')
          .select('*')
          .eq('doctor_id', doctorId)
          .eq('is_active', true)

        if (avail && avail.length > 0) {
          setAvailabilityList(avail)
        }
      } catch (e) {
        console.warn("Could not load custom availability:", e)
      }
    }
    loadAvailability()

    // Realtime listener for doctor schedule updates
    const availChannel = supabase.channel(`doctor_avail_${doctorId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'doctor_availability',
        filter: `doctor_id=eq.${doctorId}`,
      }, () => {
        loadAvailability()
      })
      .on('broadcast', { event: 'schedule_updated' }, () => {
        loadAvailability()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(availChannel)
    }
  }, [doctorId, supabase])

  // Generate next 14 days
  const dates = useMemo(() => {
    const arr = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      // Skip Sundays (0) if doctor doesn't have custom Sunday availability
      if (d.getDay() !== 0 || availabilityList.some(a => a.day_of_week === 0)) {
        arr.push(d)
      }
    }
    return arr
  }, [availabilityList])

  // Generate slots dynamically based on doctor's schedule or standard 9-5 clinic hours
  const timeSlots = useMemo(() => {
    if (!selectedDate) return []
    
    // Parse selected date day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Make sure we parse in local date context to avoid UTC shifts
    const [y, m, d] = selectedDate.split('-').map(Number)
    const dayOfWeek = new Date(y, m - 1, d).getDay()

    if (availabilityList.length > 0) {
      const schedule = availabilityList.find(a => a.day_of_week === dayOfWeek)
      if (!schedule) {
        // Doctor does not work on this day
        return []
      }
      const startHour = parseInt(schedule.start_time.split(':')[0], 10)
      const endHour = parseInt(schedule.end_time.split(':')[0], 10)
      const slots = []
      for (let h = startHour; h < endHour; h++) {
        slots.push(`${h.toString().padStart(2, '0')}:00:00`)
        slots.push(`${h.toString().padStart(2, '0')}:30:00`)
      }
      return slots
    }

    // Default standard clinic hours: 9 AM to 5 PM (30 min increments)
    const slots = []
    for (let h = 9; h < 17; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00:00`)
      slots.push(`${h.toString().padStart(2, '0')}:30:00`)
    }
    return slots
  }, [selectedDate, availabilityList])

  // Format helper
  const formatDateForDB = (d: Date) => d.toISOString().split('T')[0]
  const formatTimeForDisplay = (t: string) => {
    const [h, m] = t.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${displayHour}:${m} ${ampm}`
  }

  // 1. Fetch taken slots securely when date changes
  useEffect(() => {
    if (!selectedDate || !doctorId) return
    let isMounted = true

    const fetchSlots = async () => {
      setIsLoading(true)
      try {
        const { data: slots, error } = await supabase.rpc('get_taken_slots', {
          p_doctor_id: doctorId,
          p_date: selectedDate
        })
        
        if (error) throw error
        if (isMounted && slots) {
          setTakenSlots(slots.map((s: any) => s.time))
        }
      } catch (err: any) {
        console.error("Error fetching slots:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchSlots()

    // 2. Realtime Broadcast & Postgres Changes subscription for instantaneous updates
    const channel = supabase.channel(`doctor_slots_${doctorId}`)
      .on('broadcast', { event: 'slot_held' }, (payload) => {
        if (payload.payload.date === selectedDate) {
          setTakenSlots(prev => [...prev, payload.payload.time])
        }
      })
      .on('broadcast', { event: 'slot_released' }, (payload) => {
        if (payload.payload.date === selectedDate) {
          setTakenSlots(prev => prev.filter(t => t !== payload.payload.time))
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `doctor_id=eq.${doctorId}`,
      }, () => {
        fetchSlots()
      })
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [selectedDate, doctorId, supabase])

  const handleTimeSelect = async (time: string) => {
    if (takenSlots.includes(time)) return
    
    setSelectedTime(time)
    setError("")
  }

  const handleHoldSlot = async () => {
    const clinicId = data.clinicId || data.clinic_id
    if (!selectedDate || !selectedTime || !doctorId || !clinicId) {
      setError("Please ensure clinic and doctor are selected. Click Back to reselect if needed.")
      return
    }
    
    setIsHolding(true)
    setError("")

    // Optimistic broadcast to other users viewing this doctor
    await supabase.channel(`doctor_slots_${doctorId}`).send({
      type: 'broadcast',
      event: 'slot_held',
      payload: { date: selectedDate, time: selectedTime }
    })

    try {
      const res = await fetch('/api/appointments/hold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicId,
          doctorId,
          date: selectedDate,
          time: selectedTime
        })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to hold slot")
      }

      // Success! Update global state and move to next step
      updateData("clinicId", clinicId)
      updateData("doctorId", doctorId)
      updateData("date", selectedDate)
      updateData("time", selectedTime)
      updateData("appointmentId", result.appointmentId)
      updateData("heldUntil", result.heldUntil) // Pass to next step for countdown
      
      onNext()

    } catch (err: any) {
      setError(err.message)
      setSelectedTime(null) // Unselect
      
      // Rollback broadcast
      await supabase.channel(`doctor_slots_${doctorId}`).send({
        type: 'broadcast',
        event: 'slot_released',
        payload: { date: selectedDate, time: selectedTime }
      })
    } finally {
      setIsHolding(false)
    }
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose Date & Time</h2>
        <p className="text-muted-foreground mb-8">
          Booking with <strong className="text-foreground">{formatDoctorName(data.doctorName)}</strong> at {data.clinicName}.
        </p>

        {/* Date Selector */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
            Select Date
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
            {dates.map((date, i) => {
              const dateStr = formatDateForDB(date)
              const isSelected = selectedDate === dateStr
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedDate(dateStr)
                    setSelectedTime(null)
                  }}
                  className={`snap-start shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20' 
                      : 'bg-card border-border text-foreground hover:border-primary/50 hover:bg-surface-elevated'
                  }`}
                >
                  <span className={`text-xs font-medium uppercase ${isSelected ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className={`text-2xl font-bold mt-1 ${isSelected ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {date.getDate()}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Time Selector */}
        {selectedDate && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              Available Slots
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-xl p-4 bg-surface/50">
                <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium text-foreground">No clinic slots on this date</p>
                <p className="text-xs text-muted-foreground mt-1">The physician does not have scheduled hours on this day. Please pick another date above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {timeSlots.map((time, i) => {
                  const isTaken = takenSlots.includes(time)
                  const isSelected = selectedTime === time
                  
                  return (
                    <button
                      key={i}
                      disabled={isTaken || isHolding}
                      onClick={() => handleTimeSelect(time)}
                      className={`min-h-[44px] py-2.5 px-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center ${
                        isTaken 
                          ? 'bg-surface border-border text-muted-foreground/40 cursor-not-allowed line-through' 
                          : isSelected
                            ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold'
                            : 'bg-card border-border text-foreground hover:border-primary/50 hover:bg-surface-elevated active:scale-[0.98]'
                      }`}
                    >
                      {formatTimeForDisplay(time)}
                    </button>
                  )
                })}
              </div>
            )}
            
            {error && (
              <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm font-medium">
                {error}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Button variant="outline" onClick={onPrev} className="font-semibold min-h-[44px] w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button 
          onClick={handleHoldSlot}
          disabled={!selectedDate || !selectedTime || isHolding}
          className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold px-6 sm:px-8 min-h-[44px] w-full sm:w-auto relative overflow-hidden"
        >
          {isHolding ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Securing Slot...
            </>
          ) : (
            <>
              Hold Slot & Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
