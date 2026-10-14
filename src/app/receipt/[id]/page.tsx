"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, CalendarDays, CheckCircle2, User, Phone, Mail, MapPin, Activity, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { QRCodeSVG } from 'qrcode.react'
import { formatDoctorName, formatAiSummary } from "@/lib/utils"

export default function ReceiptPage() {
  const params = useParams()
  const [appointment, setAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isScanned, setIsScanned] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search)
      if (sp.get('scanned') === 'true') {
        setIsScanned(true)
      }
    }
  }, [])

  useEffect(() => {
    async function fetchAppointment() {
      try {
        if (!params.id) return
        
        // Use the secure RPC function to fetch the receipt without needing to be logged in
        const { data, error } = await supabase.rpc('get_receipt', { 
          receipt_id: params.id 
        })

        if (error) throw error
        if (!data) throw new Error("Not found")
        
        setAppointment(data)
      } catch (err: any) {
        console.error(err)
        setError("Could not find this appointment. It may have been deleted.")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointment()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-background">
        <div className="flex flex-col items-center">
          <CalendarDays className="h-8 w-8 animate-spin text-teal-600 dark:text-teal-400 mb-4" />
          <p className="text-muted-foreground font-medium">Loading appointment details...</p>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md text-center p-6 shadow-sm border-border bg-card">
          <p className="text-destructive font-medium">{error || "Appointment not found."}</p>
        </Card>
      </div>
    )
  }

  const handleDownloadPdf = () => { window.print() }

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 md:p-8 bg-background min-h-[calc(100dvh-3.5rem)]">
      <Card className="border-t-4 border-t-teal-600 shadow-lg bg-card border-border">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/40 mb-4 border border-teal-200 dark:border-teal-800">
            <CheckCircle2 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-2xl text-foreground font-bold">Digital Pass</h1>
          <p className="text-muted-foreground text-sm mb-4">
            {isScanned 
              ? "Your digital pass is active on this device. Please present your ticket number at the reception desk." 
              : "Please present this pass or ticket number at the reception desk."}
          </p>

          <div className="my-6">
            <CountdownTimer 
              appointmentDate={appointment.appointment_date} 
              appointmentTime={appointment.appointment_time} 
              doctorName={appointment.doctor_name}
            />
          </div>
          
          {/* QR Code Container: Only shown on desktop/laptop devices so patients can scan to their phone.
              Hidden completely on mobile devices and whenever scanned from another device */}
          {!isScanned && (
            <div className="hidden md:flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-border shadow-sm mx-auto mb-6">
              <QRCodeSVG 
                value={typeof window !== 'undefined' ? `${window.location.origin}/receipt/${appointment.id}?scanned=true` : `https://sloturself.com/receipt/${appointment.id}?scanned=true`} 
                size={120}
                level="M"
                includeMargin={true}
              />
              <p className="text-[10px] text-muted-foreground mt-2 font-mono">Scan with your mobile to take this pass</p>
            </div>
          )}

          {appointment.ticket_number && (
            <div className="mx-auto mt-2 max-w-[250px] bg-teal-900 dark:bg-teal-800 text-white rounded-xl py-3 text-2xl font-mono font-bold tracking-widest shadow-md">
              TICKET - {appointment.ticket_number.toString().padStart(3, '0')}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          
          <div className="rounded-xl bg-surface p-5 border border-border">
            <h3 className="font-semibold text-foreground mb-3 border-b border-border pb-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Visit Information
            </h3>
            <div className="grid grid-cols-1 gap-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Clinic</p>
                  <p className="font-medium text-foreground">{appointment.clinic_name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department & Doctor</p>
                  <p className="font-medium text-foreground">{appointment.department_name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{formatDoctorName(appointment.doctor_name || 'N/A')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date & Time</p>
                  <p className="font-medium text-foreground">{appointment.appointment_date}</p>
                  <p className="text-sm text-muted-foreground">{appointment.appointment_time}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-surface border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3 border-b border-border pb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-teal-600 dark:text-teal-400" /> Patient Details
            </h3>
            <div className="grid grid-cols-1 gap-y-3">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium text-foreground">{appointment.patient_name || 'N/A'}</p>
              </div>
              {appointment.patient_mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <a href={`tel:${appointment.patient_mobile}`} className="text-teal-600 dark:text-teal-400 hover:underline">{appointment.patient_mobile}</a>
                </div>
              )}
              {appointment.patient_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <a href={`mailto:${appointment.patient_email}`} className="text-teal-600 dark:text-teal-400 hover:underline">{appointment.patient_email}</a>
                </div>
              )}
              {appointment.patient_address && (
                <div className="flex items-start gap-3 mt-1">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <p className="text-muted-foreground text-sm">{appointment.patient_address}</p>
                </div>
              )}
            </div>
          </div>
          
          {appointment.reason && (
            <div className="rounded-xl border border-amber-300 dark:border-amber-700/50 p-5 bg-amber-50 dark:bg-amber-950/30">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">Stated Reason / Symptoms</p>
              <p className="text-amber-950 dark:text-amber-200 text-sm whitespace-pre-line">{formatAiSummary(appointment.reason)}</p>
            </div>
          )}

          <div className="rounded-xl bg-surface border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3 border-b border-border pb-2">Payment Details</h3>
            <div className="grid grid-cols-1 gap-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">Method</span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                  appointment.payment_mode === 'ONLINE_PAYMENT' 
                    ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800' 
                    : 'bg-surface-elevated text-foreground border-border'
                }`}>
                  {appointment.payment_mode === 'ONLINE_PAYMENT' ? 'ONLINE' : 'PAY AT CLINIC'}
                </span>
              </div>
              
              {appointment.payment_mode === 'ONLINE_PAYMENT' && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground font-medium">Status</span>
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-300 dark:border-amber-800">
                    Awaiting Verification
                  </span>
                </div>
              )}
            </div>
          </div>

          
          <div className="pt-6 text-center flex flex-col items-center gap-3 print:hidden">
            <p className="text-xs text-muted-foreground font-mono">ID: {appointment.id}</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Button onClick={handleDownloadPdf} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white h-11 text-sm rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Print / Save Pass
              </Button>
              {appointment.appointment_date && appointment.appointment_time && (
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Doctor Appointment with ${formatDoctorName(appointment.doctor_name)}`)}&dates=${appointment.appointment_date.replace(/-/g, '')}T${appointment.appointment_time.replace(/:/g, '').substring(0, 4)}00/${appointment.appointment_date.replace(/-/g, '')}T${(parseInt(appointment.appointment_time.substring(0, 2), 10) + 1).toString().padStart(2, '0')}${appointment.appointment_time.substring(3, 5)}00&details=${encodeURIComponent(`Appointment at ${appointment.clinic_name}. Please present your digital check-in pass at the reception.`)}&location=${encodeURIComponent(appointment.clinic_name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl border border-border bg-card hover:bg-surface-elevated text-xs font-semibold text-foreground transition-colors shadow-xs"
                >
                  <CalendarDays className="w-4 h-4 text-primary" />
                  Google Calendar
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
