import React from "react"
import { AppointmentStatus } from "@/types/appointment"

interface StatusBadgeProps {
  status: AppointmentStatus | string
  type?: "appointment" | "payment"
  className?: string
}

export function StatusBadge({ status, type = "appointment", className = "" }: StatusBadgeProps) {
  const normalized = status.toLowerCase()

  if (type === "payment") {
    if (normalized === "online" || normalized === "paid" || normalized === "online_payment") {
      return (
        <span className={`inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 ${className}`}>
          Paid Online
        </span>
      )
    }
    return (
      <span className={`inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-600/20 ${className}`}>
        Pay at Clinic
      </span>
    )
  }

  // Appointment Statuses
  switch (normalized) {
    case "confirmed":
    case "upcoming":
      return (
        <span className={`inline-flex items-center rounded-md bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-400 ring-1 ring-inset ring-teal-600/20 ${className}`}>
          Upcoming
        </span>
      )
    case "held":
      return (
        <span className={`inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-600/20 ${className}`}>
          Slot Held (10m)
        </span>
      )
    case "completed":
      return (
        <span className={`inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20 ${className}`}>
          Completed
        </span>
      )
    case "cancelled":
      return (
        <span className={`inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400 ring-1 ring-inset ring-rose-600/20 ${className}`}>
          Cancelled
        </span>
      )
    default:
      return (
        <span className={`inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-600/20 ${className}`}>
          {status}
        </span>
      )
  }
}
