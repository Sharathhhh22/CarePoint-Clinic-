"use client"

import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Stethoscope, 
  CalendarCheck, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Search,
  Building2,
  Lock,
  Layers,
  TrendingUp,
  History
} from "lucide-react"

interface AdminAllocationClientProps {
  initialDoctors: any[]
  initialAvailability: any[]
  initialAppointments: any[]
  departments: any[]
  auditLogs: any[]
  verificationHistory: any[]
  todayDate: string
}

export function AdminAllocationClient({
  initialDoctors,
  initialAvailability,
  initialAppointments,
  departments: _departments,
  auditLogs,
  verificationHistory,
  todayDate,
}: AdminAllocationClientProps) {
  const [doctors, setDoctors] = useState<any[]>(initialDoctors)
  const [availability, setAvailability] = useState<any[]>(initialAvailability)
  const [appointments, setAppointments] = useState<any[]>(initialAppointments)
  const [activeTab, setActiveTab] = useState<'roster' | 'appointments' | 'specialties' | 'audit'>('roster')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'on_duty' | 'off_duty'>('all')
  const [isRealtimeActive, setIsRealtimeActive] = useState(false)

  const supabase = createClient()
  const todayDayOfWeek = new Date(todayDate).getDay() // 0 = Sun, 1 = Mon ...

  // Real-Time Subscriptions for Appointments & Doctor Availability
  useEffect(() => {
    const channel = supabase.channel('admin_allocation_realtime')
      // 1. Listen for new or updated appointments
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments',
      }, async () => {
        // Refresh today's appointments
        const { data: updatedApts } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            appointment_time,
            status,
            held_until,
            patient_name,
            patient_phone,
            ticket_number,
            payment_mode,
            payment_status,
            doctor_id,
            clinic_id,
            doctors ( id, name, specialty ),
            clinics ( id, name ),
            profiles ( full_name, mobile )
          `)
          .eq('appointment_date', todayDate)
          .order('appointment_time', { ascending: true })

        if (updatedApts) setAppointments(updatedApts)
      })
      // 2. Listen for doctor availability schedule changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'doctor_availability',
      }, async () => {
        const { data: updatedAvail } = await supabase
          .from('doctor_availability')
          .select('*')
          .eq('is_active', true)

        if (updatedAvail) setAvailability(updatedAvail)
      })
      // 3. Listen for doctor profile changes
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'doctors',
      }, async () => {
        const { data: updatedDocs } = await supabase
          .from('doctors')
          .select(`
            id, name, specialty, experience_years, consultation_fee, is_active, status, photo_url, clinic_id,
            clinics ( id, name, address )
          `)
          .order('name', { ascending: true })

        if (updatedDocs) setDoctors(updatedDocs)
      })
      .subscribe((status) => {
        setIsRealtimeActive(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, todayDate])

  // Doctor Duty Mapping
  const doctorDutyMap = useMemo(() => {
    const map = new Map<string, { isOnDuty: boolean; shiftText: string; maxSlots: number }>()

    for (const doc of doctors) {
      const docSchedules = availability.filter(a => a.doctor_id === doc.id)
      const todaySched = docSchedules.find(a => a.day_of_week === todayDayOfWeek)

      if (todaySched && doc.is_active && doc.status === 'approved') {
        const startH = parseInt(todaySched.start_time.split(':')[0], 10)
        const endH = parseInt(todaySched.end_time.split(':')[0], 10)
        const slotsCount = Math.max(0, (endH - startH) * 2)

        map.set(doc.id, {
          isOnDuty: true,
          shiftText: `${todaySched.start_time.slice(0, 5)} - ${todaySched.end_time.slice(0, 5)}`,
          maxSlots: slotsCount,
        })
      } else {
        map.set(doc.id, {
          isOnDuty: false,
          shiftText: 'Off Duty Today',
          maxSlots: 0,
        })
      }
    }
    return map
  }, [doctors, availability, todayDayOfWeek])

  // Count active / confirmed / held appointments today
  const metrics = useMemo(() => {
    const totalApprovedDoctors = doctors.filter(d => d.status === 'approved').length
    const onDutyDoctors = Array.from(doctorDutyMap.values()).filter(d => d.isOnDuty).length

    const confirmedCount = appointments.filter(a => a.status === 'confirmed').length
    const heldCount = appointments.filter(
      a => a.status === 'held' && a.held_until && new Date(a.held_until) > new Date()
    ).length
    const completedCount = appointments.filter(a => a.status === 'completed').length

    let totalPossibleSlots = 0
    for (const duty of doctorDutyMap.values()) {
      if (duty.isOnDuty) totalPossibleSlots += duty.maxSlots
    }

    const totalBookedOrHeld = confirmedCount + heldCount
    const utilizationRate = totalPossibleSlots > 0 
      ? Math.round((totalBookedOrHeld / totalPossibleSlots) * 100) 
      : 0

    return {
      totalApprovedDoctors,
      onDutyDoctors,
      confirmedCount,
      heldCount,
      completedCount,
      totalPossibleSlots,
      totalBookedOrHeld,
      utilizationRate,
    }
  }, [doctors, appointments, doctorDutyMap])

  // Specialty statistics & shortage indicators
  const specialtyStats = useMemo(() => {
    const map = new Map<string, { totalDoctors: number; onDutyDoctors: number; bookedAppointments: number }>()

    for (const doc of doctors) {
      if (doc.status !== 'approved') continue
      const spec = doc.specialty || 'General Medicine'
      const cur = map.get(spec) || { totalDoctors: 0, onDutyDoctors: 0, bookedAppointments: 0 }
      cur.totalDoctors += 1
      if (doctorDutyMap.get(doc.id)?.isOnDuty) {
        cur.onDutyDoctors += 1
      }
      map.set(spec, cur)
    }

    for (const apt of appointments) {
      if (apt.status === 'cancelled') continue
      const doc = doctors.find(d => d.id === apt.doctor_id)
      const spec = doc?.specialty || 'General Medicine'
      const cur = map.get(spec)
      if (cur) {
        cur.bookedAppointments += 1
      }
    }

    return Array.from(map.entries()).map(([specialty, stat]) => {
      const estimatedCapacity = stat.onDutyDoctors * 16 // ~16 half-hour slots per doctor
      const utilization = estimatedCapacity > 0 
        ? Math.round((stat.bookedAppointments / estimatedCapacity) * 100) 
        : 0
      const isShortage = stat.onDutyDoctors === 0 || utilization >= 80

      return {
        specialty,
        ...stat,
        estimatedCapacity,
        utilization,
        isShortage,
      }
    }).sort((a, b) => b.utilization - a.utilization)
  }, [doctors, appointments, doctorDutyMap])

  // Filtered doctors list
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = 
        !searchQuery.trim() ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.specialty || '').toLowerCase().includes(searchQuery.toLowerCase())

      const duty = doctorDutyMap.get(doc.id)
      let matchesStatus = true
      if (statusFilter === 'on_duty') matchesStatus = duty?.isOnDuty === true
      if (statusFilter === 'off_duty') matchesStatus = duty?.isOnDuty === false

      return matchesSearch && matchesStatus
    })
  }, [doctors, searchQuery, statusFilter, doctorDutyMap])

  return (
    <div className="space-y-6">
      {/* Realtime Live Pulse Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-surface border border-border text-xs md:text-sm text-muted-foreground shadow-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRealtimeActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRealtimeActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </span>
          <span className="font-semibold text-foreground">
            {isRealtimeActive ? "Supabase Realtime Engine Active" : "Connecting Realtime Engine..."}
          </span>
          <span className="text-muted-foreground hidden sm:inline">• Live Postgres change streaming on bookings & availability</span>
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          Roster Date: {todayDate}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 md:gap-4">
        {/* Card 1: Verified Doctors */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Doctors</CardTitle>
            <Stethoscope className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-foreground">{metrics.totalApprovedDoctors}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Verified physicians</p>
          </CardContent>
        </Card>

        {/* Card 2: On Duty Today */}
        <Card className="shadow-xs border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">On Duty Today</CardTitle>
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {metrics.onDutyDoctors}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              of {metrics.totalApprovedDoctors} doctors scheduled
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Today's Confirmed */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirmed Slots</CardTitle>
            <CalendarCheck className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-foreground">{metrics.confirmedCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {metrics.completedCount} completed today
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Active Held Slots (Locking Engine) */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Held Locks</CardTitle>
            <Lock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{metrics.heldCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">5-min conflict guards</p>
          </CardContent>
        </Card>

        {/* Card 5: Overall Utilization Rate */}
        <Card className="shadow-xs col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Capacity Used</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-foreground">{metrics.utilizationRate}%</div>
            <div className="w-full bg-border rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  metrics.utilizationRate >= 80 
                    ? 'bg-danger' 
                    : metrics.utilizationRate >= 50 
                      ? 'bg-amber-500' 
                      : 'bg-primary'
                }`}
                style={{ width: `${Math.min(100, metrics.utilizationRate)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border">
        <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('roster')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'roster'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Doctor Capacity Roster
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'appointments'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            Live Bookings Flow
            {metrics.heldCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold">
                {metrics.heldCount} locked
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('specialties')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'specialties'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-4 h-4" />
            Specialty Load & Shortages
            {specialtyStats.some(s => s.isShortage) && (
              <span className="px-1.5 py-0.2 bg-danger/20 text-danger rounded-full text-xs font-bold">
                Alert
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'audit'
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-4 h-4" />
            Allocation Audit History
          </button>
        </div>
      </div>

      {/* TAB 1: DOCTORS CAPACITY ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name or specialty..."
                className="w-full h-10 pl-9 pr-3 text-sm rounded-lg border border-border bg-input-bg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({doctors.length})
              </button>
              <button
                onClick={() => setStatusFilter('on_duty')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === 'on_duty'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                On Duty ({metrics.onDutyDoctors})
              </button>
              <button
                onClick={() => setStatusFilter('off_duty')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === 'off_duty'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                Off Duty ({doctors.length - metrics.onDutyDoctors})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doc) => {
              const clinic = Array.isArray(doc.clinics) ? doc.clinics[0] : doc.clinics
              const duty = doctorDutyMap.get(doc.id) || { isOnDuty: false, shiftText: 'Off Duty', maxSlots: 0 }
              const docAppointments = appointments.filter(a => a.doctor_id === doc.id && a.status !== 'cancelled')
              const confirmedSlots = docAppointments.filter(a => a.status === 'confirmed').length
              const heldSlots = docAppointments.filter(a => a.status === 'held').length
              const bookedTotal = confirmedSlots + heldSlots
              const utilization = duty.maxSlots > 0 ? Math.round((bookedTotal / duty.maxSlots) * 100) : 0

              return (
                <Card key={doc.id} className="hover:border-primary/40 transition-colors shadow-xs">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base font-bold text-foreground">
                          {doc.name.startsWith("Dr.") ? doc.name : `Dr. ${doc.name}`}
                        </CardTitle>
                        <p className="text-xs text-primary font-medium mt-0.5">{doc.specialty}</p>
                      </div>

                      {duty.isOnDuty ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          On Duty
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                          Off Duty
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-2 text-xs space-y-2.5">
                    <div className="flex items-center text-muted-foreground gap-1.5">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{clinic?.name || "Main Medical Center"}</span>
                    </div>

                    <div className="flex items-center text-muted-foreground gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      <span>{duty.shiftText}</span>
                    </div>

                    {duty.isOnDuty && (
                      <div className="pt-2 border-t border-border/60">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-muted-foreground">Today&apos;s Load:</span>
                          <span className="font-semibold text-foreground">
                            {bookedTotal} / {duty.maxSlots} slots ({utilization}%)
                          </span>
                        </div>
                        <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              utilization >= 80 ? 'bg-danger' : utilization >= 50 ? 'bg-amber-500' : 'bg-primary'
                            }`}
                            style={{ width: `${Math.min(100, utilization)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TODAY'S APPOINTMENT STREAM */}
      {activeTab === 'appointments' && (
        <Card className="shadow-xs overflow-hidden">
          <CardHeader className="p-5 border-b border-border bg-surface-elevated/40">
            <CardTitle className="text-lg font-bold text-foreground">Today&apos;s Appointment Booking Flow</CardTitle>
            <CardDescription className="text-xs">
              Live chronological bookings for {todayDate} with atomic conflict-free slot holds.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {appointments.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No appointments booked for today yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-elevated/60 text-muted-foreground text-xs uppercase border-b border-border">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Time</th>
                      <th className="py-3 px-4 font-semibold">Token</th>
                      <th className="py-3 px-4 font-semibold">Patient</th>
                      <th className="py-3 px-4 font-semibold">Doctor</th>
                      <th className="py-3 px-4 font-semibold">Clinic</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-foreground text-xs md:text-sm">
                    {appointments.map((apt) => {
                      const doc = Array.isArray(apt.doctors) ? apt.doctors[0] : apt.doctors
                      const clinic = Array.isArray(apt.clinics) ? apt.clinics[0] : apt.clinics
                      const profile = Array.isArray(apt.profiles) ? apt.profiles[0] : apt.profiles
                      const patientName = apt.patient_name || profile?.full_name || "Patient"

                      return (
                        <tr key={apt.id} className="hover:bg-surface-elevated/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-primary">
                            {apt.appointment_time?.slice(0, 5) || "09:00"}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold">
                            #{apt.ticket_number || "—"}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {patientName}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{doc?.name || "Doctor"}</span>
                            <span className="block text-xs text-muted-foreground">{doc?.specialty}</span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">
                            {clinic?.name || "Main Clinic"}
                          </td>
                          <td className="py-3 px-4">
                            {apt.status === 'confirmed' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                                Confirmed
                              </span>
                            ) : apt.status === 'held' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                                <Lock className="w-3 h-3 mr-1" />
                                Locked (Held)
                              </span>
                            ) : apt.status === 'completed' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-700 dark:text-blue-400">
                                Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                                {apt.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground capitalize">
                            {apt.payment_mode || "At Clinic"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: SPECIALTY CAPACITY & SHORTAGES */}
      {activeTab === 'specialties' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialtyStats.map((item) => (
              <Card key={item.specialty} className="shadow-xs hover:border-primary/40 transition-colors">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold text-foreground">
                      {item.specialty}
                    </CardTitle>
                    {item.isShortage ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-danger/15 text-danger border border-danger/30">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Shortage Alert
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                        Optimal
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 text-xs space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>
                      <span className="block text-foreground font-semibold text-sm">{item.onDutyDoctors}</span>
                      <span>Doctors On Duty</span>
                    </div>
                    <div>
                      <span className="block text-foreground font-semibold text-sm">{item.bookedAppointments}</span>
                      <span>Slots Booked Today</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-muted-foreground">Department Load:</span>
                      <span className="font-semibold text-foreground">{item.utilization}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.utilization >= 80 ? 'bg-danger' : item.utilization >= 50 ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(100, item.utilization)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT HISTORY */}
      {activeTab === 'audit' && (
        <Card className="shadow-xs overflow-hidden">
          <CardHeader className="p-5 border-b border-border bg-surface-elevated/40">
            <CardTitle className="text-lg font-bold text-foreground">Resource Allocation & Security Audit Stream</CardTitle>
            <CardDescription className="text-xs">
              Immutable log of doctor credential verifications, schedule updates, and administrative resource events.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/60">
              {auditLogs.length === 0 && verificationHistory.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No allocation audit events recorded yet.
                </div>
              ) : (
                <>
                  {verificationHistory.map((item) => (
                    <div key={item.id} className="p-4 flex items-start justify-between gap-3 text-xs md:text-sm hover:bg-surface-elevated/30 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Doctor Verification: <span className="uppercase text-primary">{item.decision}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Target: {item.doctors?.name || "Doctor"} ({item.doctors?.specialty})
                            {item.reason && ` • Rationale: ${item.reason}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono shrink-0">
                        {new Date(item.reviewed_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}

                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4 flex items-start justify-between gap-3 text-xs md:text-sm hover:bg-surface-elevated/30 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-surface-elevated text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                          <History className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{log.action}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Resource: {log.target_resource} {log.target_id && `(${log.target_id.slice(0, 8)}...)`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono shrink-0">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
