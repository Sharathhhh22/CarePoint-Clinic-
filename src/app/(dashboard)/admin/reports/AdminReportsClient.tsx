"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, Calendar, TrendingUp, Users, CheckCircle2, XCircle, Stethoscope } from "lucide-react"

interface AppointmentRecord {
  id: string
  appointment_date: string
  appointment_time: string
  status: string
  payment_mode: string
  ticket_number?: string
  patient_name?: string
  doctors?: {
    name?: string
    specialty?: string
    consultation_fee?: number
  }
  clinics?: {
    name?: string
  }
}

interface AdminReportsClientProps {
  appointments: AppointmentRecord[]
  totalDoctors: number
  totalClinics: number
  totalPatients: number
}

export function AdminReportsClient({
  appointments,
  totalDoctors,
  totalClinics,
  totalPatients,
}: AdminReportsClientProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Calculations
  const totalBookings = appointments.length
  const completed = appointments.filter(a => a.status === 'completed').length
  const confirmed = appointments.filter(a => a.status === 'confirmed').length
  const cancelled = appointments.filter(a => a.status === 'cancelled').length
  const completionRate = totalBookings > 0 ? Math.round(((completed + confirmed) / totalBookings) * 100) : 100
  const cancellationRate = totalBookings > 0 ? Math.round((cancelled / totalBookings) * 100) : 0

  // Specialty Breakdown
  const specialtyCounts: Record<string, number> = {}
  for (const a of appointments) {
    const spec = a.doctors?.specialty || "General Medicine"
    specialtyCounts[spec] = (specialtyCounts[spec] || 0) + 1
  }
  const topSpecialties = Object.entries(specialtyCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  // CSV Export Engine
  const exportToCSV = () => {
    setIsExporting(true)
    try {
      const headers = [
        "Ticket / ID",
        "Date",
        "Time",
        "Status",
        "Patient Name",
        "Physician",
        "Specialty",
        "Clinic Facility",
        "Payment Mode",
        "Consultation Fee (INR)",
      ]

      const rows = appointments.map(a => [
        `"${a.ticket_number || a.id.substring(0, 8)}"`,
        `"${a.appointment_date}"`,
        `"${a.appointment_time}"`,
        `"${a.status}"`,
        `"${a.patient_name || 'Self Patient'}"`,
        `"${a.doctors?.name || 'Unassigned'}"`,
        `"${a.doctors?.specialty || 'General Medicine'}"`,
        `"${a.clinics?.name || 'Main Clinic'}"`,
        `"${a.payment_mode || 'PAY_AT_CLINIC'}"`,
        `"${a.doctors?.consultation_fee || 500}"`,
      ])

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `sloturself-operational-report-${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-border shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-foreground">Operational Data Export</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Download complete raw audit ledgers for compliance, finance, or board presentations.
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          disabled={isExporting}
          className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-10 px-5 rounded-xl shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          {isExporting ? "Generating CSV..." : "Export Ledger to CSV"}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Volume</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Recorded consultations</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully fulfilled visits</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Cancellation Rate</CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{cancellationRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Patient or doctor cancellations</p>
          </CardContent>
        </Card>

        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Medical Network</CardTitle>
            <Users className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalDoctors} Doctors</div>
            <p className="text-xs text-muted-foreground mt-1">Across {totalClinics} clinic facilities</p>
          </CardContent>
        </Card>
      </div>

      {/* Specialty Demand Distribution */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Top Medical Specialties by Demand
          </CardTitle>
          <CardDescription>
            Relative patient appointment distribution across clinical departments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topSpecialties.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No specialty data recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {topSpecialties.map(([specialty, count]) => {
                const percentage = totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0
                return (
                  <div key={specialty} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-primary" />
                        {specialty}
                      </span>
                      <span className="text-muted-foreground font-mono text-xs">
                        {count} visits ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
