"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveDoctorProfile } from "@/app/actions/doctor"
import { 
  Stethoscope, 
  Award, 
  Building2, 
  Upload, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  CalendarDays,
  ShieldCheck,
  FileText
} from "lucide-react"

const SPECIALTIES = [
  "General Physician",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Ophthalmology",
  "Dentistry",
  "Pediatrics",
  "Dermatology",
  "ENT Specialist",
  "Gynecology",
  "Psychiatry",
  "Pulmonology",
]

const DAYS = [
  { day: 1, label: "Monday" },
  { day: 2, label: "Tuesday" },
  { day: 3, label: "Wednesday" },
  { day: 4, label: "Thursday" },
  { day: 5, label: "Friday" },
  { day: 6, label: "Saturday" },
  { day: 0, label: "Sunday" },
]

interface DoctorOnboardingFormProps {
  initialDoctor?: any
  clinics: Array<{ id: string; name: string; address?: string }>
  onSuccess: () => void
}

export function DoctorOnboardingForm({ initialDoctor, clinics, onSuccess }: DoctorOnboardingFormProps) {
  const [name, setName] = useState(initialDoctor?.name || "")
  const [specialty, setSpecialty] = useState(initialDoctor?.specialty || "General Physician")
  const [qualifications, setQualifications] = useState(initialDoctor?.qualifications || "")
  const [medicalRegistrationNo, setMedicalRegistrationNo] = useState(initialDoctor?.medical_registration_no || "")
  const [registrationAuthority, setRegistrationAuthority] = useState(initialDoctor?.registration_authority || "National Medical Commission")
  const [experienceYears, setExperienceYears] = useState(initialDoctor?.experience_years?.toString() || "5")
  const [consultationFee, setConsultationFee] = useState(initialDoctor?.consultation_fee?.toString() || "500")
  const [clinicId, setClinicId] = useState(initialDoctor?.clinic_id || (clinics[0]?.id || ""))
  const [bio, setBio] = useState(initialDoctor?.bio || "")
  const [photoUrl, setPhotoUrl] = useState(initialDoctor?.photo_url || "")
  const [verificationDocUrl, setVerificationDocUrl] = useState(initialDoctor?.verification_doc_url || "")

  // Schedule configuration (default Mon-Sat 9 AM - 5 PM)
  const [schedule, setSchedule] = useState(() => {
    return DAYS.map(d => ({
      dayOfWeek: d.day,
      label: d.label,
      isActive: d.day !== 0, // Inactive on Sunday by default
      startTime: "09:00:00",
      endTime: "17:00:00",
    }))
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleScheduleToggle = (index: number) => {
    setSchedule(prev => prev.map((s, i) => i === index ? { ...s, isActive: !s.isActive } : s))
  }

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const handleSubmit = async (submitForReview: boolean) => {
    setErrorMsg("")
    setSuccessMsg("")
    setIsLoading(true)

    try {
      const result = await saveDoctorProfile({
        name,
        specialty,
        qualifications,
        medicalRegistrationNo,
        registrationAuthority,
        experienceYears: parseInt(experienceYears, 10) || 0,
        consultationFee: parseFloat(consultationFee) || 500,
        clinicId,
        bio,
        photoUrl,
        verificationDocUrl,
        submitForReview,
        schedule: schedule.map(s => ({
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          isActive: s.isActive,
        })),
      })

      if (result.error) {
        setErrorMsg(result.error)
      } else {
        setSuccessMsg(
          submitForReview 
            ? "Your application has been submitted for admin verification!" 
            : "Profile draft saved successfully."
        )
        setTimeout(() => {
          onSuccess()
        }, 1200)
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Stethoscope className="w-8 h-8 text-primary" />
          Doctor Credential Registration & Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Register your medical credentials to join the SlotUrSelf verified clinical network.
        </p>
      </div>

      {initialDoctor?.rejection_reason && (
        <Card className="border-rose-300 bg-rose-50/70 dark:bg-rose-950/20 dark:border-rose-900">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-rose-800 dark:text-rose-300 text-sm">Feedback from Administrator</p>
              <p className="text-sm text-rose-700 dark:text-rose-400 mt-1">{initialDoctor.rejection_reason}</p>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-2">
                Please update the required information below and resubmit for verification.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {errorMsg && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* 1. Personal & Professional Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            1. Professional Credentials & Licensing
          </CardTitle>
          <CardDescription>
            Government medical registration and academic certifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc-name">Full Doctor Name *</Label>
              <Input
                id="doc-name"
                placeholder="e.g. Dr. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-specialty">Specialty *</Label>
              <select
                id="doc-specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc-qualifications">Degrees & Qualifications *</Label>
              <Input
                id="doc-qualifications"
                placeholder="e.g. MBBS, MD (General Medicine), DNB"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-experience">Years of Experience</Label>
              <Input
                id="doc-experience"
                type="number"
                min="0"
                max="60"
                placeholder="e.g. 10"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc-reg-no">Medical Registration Number *</Label>
              <Input
                id="doc-reg-no"
                placeholder="e.g. KMC-78942 / MCI-2015-12345"
                value={medicalRegistrationNo}
                onChange={(e) => setMedicalRegistrationNo(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-authority">Issuing Medical Council *</Label>
              <Input
                id="doc-authority"
                placeholder="e.g. Karnataka Medical Council / NMC"
                value={registrationAuthority}
                onChange={(e) => setRegistrationAuthority(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc-fee">Consultation Fee (₹ INR)</Label>
              <Input
                id="doc-fee"
                type="number"
                min="0"
                step="50"
                placeholder="e.g. 500"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-clinic">Affiliated Clinic Location *</Label>
              <select
                id="doc-clinic"
                value={clinicId}
                onChange={(e) => setClinicId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.address ? `(${c.address})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-bio">Professional Biography & Special Interests</Label>
            <Textarea
              id="doc-bio"
              rows={3}
              placeholder="Provide a brief clinical biography, areas of expertise, and patient care philosophy..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Photographs & Verification Proof */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            2. Photo & Verification Evidence
          </CardTitle>
          <CardDescription>
            Your profile image will be displayed publicly once verified. Verification evidence is stored privately for administrator review only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc-photo">Profile Photo URL</Label>
              <Input
                id="doc-photo"
                placeholder="https://example.com/photo.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Direct image link for your doctor card avatar.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-proof">Medical Certificate / License Proof URL</Label>
              <Input
                id="doc-proof"
                placeholder="https://example.com/council-registration-proof.pdf"
                value={verificationDocUrl}
                onChange={(e) => setVerificationDocUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Private link or scan of your Medical Council Registration.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Availability Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            3. Weekly Consultation Hours
          </CardTitle>
          <CardDescription>
            Configure the days and hours you practice at this clinic. Appointments will only be offered during these times.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-card">
            {schedule.map((item, idx) => (
              <div key={item.dayOfWeek} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-elevated/30 transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`day-${item.dayOfWeek}`}
                    checked={item.isActive}
                    onChange={() => handleScheduleToggle(idx)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`day-${item.dayOfWeek}`} className="font-semibold text-foreground cursor-pointer min-w-[100px]">
                    {item.label}
                  </Label>
                </div>

                {item.isActive ? (
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="time"
                      value={item.startTime.substring(0, 5)}
                      onChange={(e) => handleTimeChange(idx, 'startTime', `${e.target.value}:00`)}
                      className="h-9 px-2.5 rounded-md border border-border bg-input-bg text-foreground text-xs font-mono"
                    />
                    <span className="text-muted-foreground">to</span>
                    <input
                      type="time"
                      value={item.endTime.substring(0, 5)}
                      onChange={(e) => handleTimeChange(idx, 'endTime', `${e.target.value}:00`)}
                      className="h-9 px-2.5 rounded-md border border-border bg-input-bg text-foreground text-xs font-mono"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Off (No clinic hours)</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => handleSubmit(false)}
          className="font-medium"
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
          Save Draft
        </Button>

        <Button
          type="button"
          disabled={isLoading}
          onClick={() => handleSubmit(true)}
          className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 h-11 shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting Application...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 mr-2" />
              Submit for Verification
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
