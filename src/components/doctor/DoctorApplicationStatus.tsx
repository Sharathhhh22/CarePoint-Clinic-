"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Ban, 
  Edit3, 
  Building2, 
  Award, 
  Stethoscope, 
  ShieldAlert,
  ArrowRight
} from "lucide-react"
import { formatDoctorName } from "@/lib/utils"

interface DoctorApplicationStatusProps {
  doctor: any
  onEdit: () => void
}

export function DoctorApplicationStatus({ doctor, onEdit }: DoctorApplicationStatusProps) {
  const status = doctor?.status || 'pending'

  if (status === 'suspended') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
        <Card className="border-rose-400 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Ban className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Practicing Profile Suspended</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Your doctor profile on SlotUrSelf has been temporarily suspended by the clinical administrator.
            </p>
            {doctor?.rejection_reason && (
              <div className="p-4 bg-background/80 rounded-xl border border-rose-200 dark:border-rose-800 max-w-lg mx-auto text-left">
                <p className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-1">Reason for Suspension</p>
                <p className="text-sm text-foreground">{doctor.rejection_reason}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Please contact the clinic administration or medical board to resolve this status.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
        <Card className="border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 dark:border-amber-900">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">Application Requires Revision</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Your credentials were reviewed by our administration, but some information requires correction before your profile can be activated.
                </p>

                {doctor?.rejection_reason && (
                  <div className="mt-4 p-4 bg-background/90 rounded-xl border border-amber-200 dark:border-amber-800">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">
                      Administrator Feedback
                    </p>
                    <p className="text-sm text-foreground font-medium">{doctor.rejection_reason}</p>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <Button onClick={onEdit} className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit & Resubmit Application
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Pending Status View
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor Verification Portal</h1>
        <p className="text-muted-foreground mt-2">Welcome, {formatDoctorName(doctor?.name)}. Track your verification progress below.</p>
      </div>

      {/* Verification Status Card */}
      <Card className="border-primary/20 bg-card overflow-hidden shadow-sm">
        <div className="bg-primary/5 p-6 border-b border-border">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center animate-pulse">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-1">
                  Under Administrative Review
                </span>
                <h3 className="text-lg font-bold text-foreground">Credentials Pending Verification</h3>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={onEdit} className="text-xs font-medium">
              <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Details
            </Button>
          </div>
        </div>

        {/* Verification Timeline */}
        <CardContent className="p-6 space-y-8">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {/* Step 1: Submission */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-background">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Profile & Credentials Submitted</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Your licensing information has been saved into our system.</p>
            </div>

            {/* Step 2: Under Review */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center ring-4 ring-background animate-pulse">
                <Clock className="w-3 h-3" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Medical Council Verification in Progress</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our administrative board is verifying registration #{doctor?.medical_registration_no} with {doctor?.registration_authority || 'the Medical Council'}.
              </p>
            </div>

            {/* Step 3: Activation */}
            <div className="relative opacity-60">
              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center ring-4 ring-background">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Public Directory Activation</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Once approved, patients can discover you and book appointments.</p>
            </div>
          </div>

          {/* Submitted Summary Info */}
          <div className="border border-border rounded-xl p-5 bg-surface/50 space-y-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Submitted Application Summary</h4>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs block">Physician Name</span>
                <span className="font-semibold text-foreground">{formatDoctorName(doctor?.name)}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">Specialty & Degrees</span>
                <span className="font-semibold text-foreground">{doctor?.specialty} {doctor?.qualifications ? `(${doctor.qualifications})` : ''}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">Council Reg Number</span>
                <span className="font-mono text-xs font-bold text-foreground">{doctor?.medical_registration_no || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs block">Consultation Fee</span>
                <span className="font-semibold text-foreground">₹{doctor?.consultation_fee || 500}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
