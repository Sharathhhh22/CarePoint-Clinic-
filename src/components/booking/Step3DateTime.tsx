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
  const [isLoading, setIsLoading] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [error, setError] = useState("")

  const supabase = createClient()
  const doctorId = data.doctorId

  // Generate next 14 days
  const dates = useMemo(() => {
    const arr = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      // Skip Sundays (0)
      if (d.getDay() !== 0) {
        arr.push(d)
      }
    }
    return arr
  }, [])

  // Generate 9 AM to 5 PM slots (30 mins)
  const timeSlots = useMemo(() => {
    const slots = []
    for (let h = 9; h < 17; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00:00`)
      slots.push(`${h.toString().padStart(2, '0')}:30:00`)
    }
    return slots
  }, [])

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

    // 2. Realtime Broadcast subscription for instantaneous updates
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
    if (!selectedDate || !selectedTime || !doctorId) return
    
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
          clinicId: data.clinicId,
          doctorId: doctorId,
          date: selectedDate,
          time: selectedTime
        })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to hold slot")
      }

      // Success! Update global state and move to next step
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
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((time, i) => {
                  const isTaken = takenSlots.includes(time)
                  const isSelected = selectedTime === time
                  
                  return (
                    <button
                      key={i}
                      disabled={isTaken || isHolding}
                      onClick={() => handleTimeSelect(time)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                        isTaken 
                          ? 'bg-surface border-border text-muted-foreground/40 cursor-not-allowed line-through' 
                          : isSelected
                            ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold'
                            : 'bg-card border-border text-foreground hover:border-primary/50 hover:bg-surface-elevated'
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

      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
        <Button variant="outline" onClick={onPrev} className="font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button 
          onClick={handleHoldSlot}
          disabled={!selectedDate || !selectedTime || isHolding}
          className="bg-primary text-primary-foreground hover:bg-primary-hover font-semibold px-8 h-11 relative overflow-hidden"
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
