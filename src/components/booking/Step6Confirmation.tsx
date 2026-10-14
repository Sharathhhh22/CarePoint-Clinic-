"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, MapPin, FileText, CreditCard } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { QRCodeSVG } from 'qrcode.react'
import { formatDoctorName } from "@/lib/utils"

interface Step6Props {
  data: any
}

export function Step6Confirmation({ data }: Step6Props) {
  const formatTime = (t: string) => {
    if (!t) return ""
    const [h, m] = t.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour
    return `${displayHour}:${m} ${ampm}`
  }

  const isOnlinePayment = data.paymentMethod === "ONLINE_PAYMENT"

  const qrUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/receipt/${data.appointmentId}?scanned=true` 
    : `https://sloturself.com/receipt/${data.appointmentId}?scanned=true`

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-500">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, delay: 0.1 }}
        className="w-16 h-16 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mb-4"
      >
        <CheckCircle2 className="w-8 h-8" />
      </motion.div>
      
      <h2 className="text-2xl font-bold text-foreground mb-2">Appointment Booked</h2>
      <p className="text-muted-foreground max-w-md mb-6 text-sm">
        Your appointment with {formatDoctorName(data.doctorName)} has been successfully scheduled.
      </p>

      {/* QR Code Container */}
      <div className="bg-card p-3 rounded-2xl border border-border shadow-sm mx-auto mb-6 flex flex-col items-center justify-center">
        <p className="text-xs text-muted-foreground mb-2 font-medium tracking-wide uppercase">Digital Check-in Pass</p>
        <div className="bg-white p-2 rounded-xl">
          <QRCodeSVG 
            value={qrUrl} 
            size={140}
            level="M"
            includeMargin={true}
            className="mx-auto"
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 font-mono">Scan to view receipt on phone</p>
      </div>

      <div className="w-full max-w-sm bg-surface rounded-2xl border border-border p-5 text-left mb-8 space-y-4 shadow-sm">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">
              {data.date ? new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'N/A'}
            </p>
            <p className="text-muted-foreground text-sm mt-0.5">{formatTime(data.time)}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground">{data.clinicName}</p>
            <p className="text-muted-foreground text-sm mt-0.5">Please arrive 10 minutes early.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1.5"><CreditCard className="w-4 h-4"/> Payment Method</span>
              <span className="font-medium text-foreground">{isOnlinePayment ? "Online Payment" : "Pay at Clinic"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${isOnlinePayment ? "text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-800" : "text-foreground"}`}>
                {isOnlinePayment ? "Awaiting Verification" : "Pay at clinic"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Google Calendar Link */}
      {data.date && data.time && (
        <div className="mb-6 w-full max-w-sm">
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Doctor Appointment with ${formatDoctorName(data.doctorName)}`)}&dates=${data.date.replace(/-/g, '')}T${data.time.replace(/:/g, '').substring(0, 4)}00/${data.date.replace(/-/g, '')}T${(parseInt(data.time.substring(0, 2), 10) + 1).toString().padStart(2, '0')}${data.time.substring(3, 5)}00&details=${encodeURIComponent(`Clinical consultation with ${formatDoctorName(data.doctorName)} at ${data.clinicName}. Please bring your photo ID and arrive 10 minutes prior.`)}&location=${encodeURIComponent(data.clinicName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-border bg-card hover:bg-surface-elevated text-xs font-semibold text-foreground transition-colors shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-primary" />
            Add to Google Calendar
          </a>
        </div>
      )}

      <div className="flex gap-3 w-full max-w-sm">
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover font-semibold" asChild>
          <Link href={`/receipt/${data.appointmentId}`}>
            <FileText className="w-4 h-4 mr-2" />
            Full Receipt
          </Link>
        </Button>
      </div>

    </div>
  )
}
