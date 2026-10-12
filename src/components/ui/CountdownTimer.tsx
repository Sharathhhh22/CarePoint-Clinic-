"use client"

import React, { useState } from "react"
import { Clock, BellRing, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCountdown } from "@/hooks/useCountdown"
import { formatDoctorName } from "@/lib/utils"

interface CountdownTimerProps {
  appointmentDate: string // YYYY-MM-DD
  appointmentTime: string // HH:MM AM/PM or HH:MM
  doctorName?: string
}

export function CountdownTimer({ appointmentDate, appointmentTime, doctorName }: CountdownTimerProps) {
  const { timeLeft, status } = useCountdown(appointmentDate, appointmentTime)
  const [isNotified, setIsNotified] = useState(true)

  // Trigger notification if within 5 minutes
  const isWithinFiveMinutes = timeLeft && timeLeft.totalMilliseconds <= 5 * 60 * 1000

  const renderNotification = () => (
    <AnimatePresence>
      {isNotified && (status === "happening_now" || isWithinFiveMinutes) && status !== "past" && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white p-4 rounded-xl shadow-2xl shadow-teal-900/20 border border-teal-500 flex gap-4 max-w-sm"
        >
          <div className="bg-white/20 p-2 rounded-full h-fit flex-shrink-0">
            <BellRing className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Appointment Starting Soon!</h4>
            <p className="text-teal-50 text-sm">
              Your appointment {doctorName ? `with ${formatDoctorName(doctorName)}` : ""} is happening {status === "happening_now" ? "right now" : "in less than 5 minutes"}. Please head to the clinic or prepare for your consultation.
            </p>
            <button 
              onClick={() => setIsNotified(false)} 
              className="mt-3 text-xs font-semibold bg-white text-teal-700 px-3 py-1.5 rounded hover:bg-teal-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (status === "past") return null

  if (status === "happening_now") {
    return (
      <div className="bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 p-4 rounded-xl flex items-center gap-3">
        {renderNotification()}
        <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <span className="font-medium text-teal-800 dark:text-teal-300">Your appointment is happening right now!</span>
      </div>
    )
  }

  if (!timeLeft) return null

  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      {renderNotification()}
      
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h3 className="font-semibold text-foreground">Time until appointment</h3>
      </div>
      
      <div className="flex gap-2 text-center">
        {timeLeft.days > 0 && (
          <div className="bg-surface-elevated border border-border rounded-lg px-3 py-2 w-16">
            <span className="block text-xl font-bold text-teal-600 dark:text-teal-400">{timeLeft.days}</span>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Days</span>
          </div>
        )}
        <div className="bg-surface-elevated border border-border rounded-lg px-3 py-2 w-16">
          <span className="block text-xl font-bold text-teal-600 dark:text-teal-400">{timeLeft.hours.toString().padStart(2, "0")}</span>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">Hrs</span>
        </div>
        <div className="bg-surface-elevated border border-border rounded-lg px-3 py-2 w-16">
          <span className="block text-xl font-bold text-teal-600 dark:text-teal-400">{timeLeft.minutes.toString().padStart(2, "0")}</span>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">Min</span>
        </div>
        <div className="bg-surface-elevated border border-border rounded-lg px-3 py-2 w-16">
          <span className="block text-xl font-bold text-teal-600 dark:text-teal-400">{timeLeft.seconds.toString().padStart(2, "0")}</span>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">Sec</span>
        </div>
      </div>
    </div>
  )
}
