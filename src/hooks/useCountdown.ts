"use client"

import { useState, useEffect } from "react"

export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMilliseconds: number
}

export type CountdownStatus = "upcoming" | "happening_now" | "past"

export function useCountdown(dateString: string, timeString: string) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining | null>(null)
  const [status, setStatus] = useState<CountdownStatus>("upcoming")

  useEffect(() => {
    if (!dateString || !timeString) return

    const calculate = () => {
      // Parse time string e.g. "10:30 AM" or "14:30"
      const trimmed = timeString.trim()
      const [time, modifier] = trimmed.split(" ")
      const [hoursPart, minutesPart] = time.split(":")
      let hoursNum = parseInt(hoursPart, 10)
      const minutesNum = parseInt(minutesPart, 10)

      if (modifier === "PM" && hoursNum < 12) hoursNum += 12
      if (modifier === "AM" && hoursNum === 12) hoursNum = 0

      const target = new Date(dateString)
      target.setHours(hoursNum, minutesNum, 0, 0)

      const diff = target.getTime() - Date.now()

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          totalMilliseconds: diff,
        })
        setStatus("upcoming")
      } else if (diff > -60 * 60 * 1000) {
        // Within 1 hour after start
        setTimeLeft(null)
        setStatus("happening_now")
      } else {
        setTimeLeft(null)
        setStatus("past")
      }
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [dateString, timeString])

  return { timeLeft, status }
}
