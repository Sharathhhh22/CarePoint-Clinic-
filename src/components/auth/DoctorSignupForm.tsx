"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { validateFileUpload } from "@/lib/security/fileValidation"
import { saveDoctorProfile } from "@/app/actions/doctor"
import { 
  Stethoscope, 
  User, 
  Award, 
  FileText, 
  CheckCircle2, 
  Upload, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Building2,
  AlertCircle
} from "lucide-react"

const SPECIALTIES = [
  "General Medicine",
  "Cardiology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Neurology",
  "Dental Surgery",
  "Ophthalmology",
  "ENT Specialist",
  "Gynecology",
  "Psychiatry",
  "Pulmonology",
]

interface DoctorSignupFormProps {
  onBackToSelection?: () => void
}

export function DoctorSignupForm({ onBackToSelection }: DoctorSignupFormProps) {
  const router = useRouter()
  const supabase = createClient()

  // Multi-step progress (1: Account, 2: Professional, 3: Documents & Review, 4: Success)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1: Account fields
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Step 2: Professional details
  const [qualifications, setQualifications] = useState("")
  const [specialty, setSpecialty] = useState("General Medicine")
  const [medicalRegistrationNo, setMedicalRegistrationNo] = useState("")
  const [registrationAuthority, setRegistrationAuthority] = useState("National Medical Commission")
  const [experienceYears, setExperienceYears] = useState("5")
  const [hospitalName, setHospitalName] = useState("")
  const [practiceLocation, setPracticeLocation] = useState("")
  const [consultationFee, setConsultationFee] = useState("500")
  const [bio, setBio] = useState("")

  // Step 3: Verification documents & Review
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [documentFileName, setDocumentFileName] = useState("")
  const [certifyAuthentic, setCertifyAuthentic] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Form states
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Validate Step 1
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!fullName.trim()) {
      setErrorMsg("Please enter your full professional name.")
      return
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please provide a valid email address.")
      return
    }
    if (!phone.trim()) {
      setErrorMsg("Please provide your contact phone number.")
      return
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long for security.")
      return
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter matching passwords.")
      return
    }

    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Validate Step 2
  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!qualifications.trim()) {
      setErrorMsg("Medical qualifications (e.g. MBBS, MD) are required for verification.")
      return
    }
    if (!specialty.trim()) {
      setErrorMsg("Please select your medical specialization.")
      return
    }
    if (!medicalRegistrationNo.trim()) {
      setErrorMsg("Medical Council registration/license number is required.")
      return
    }

    setCurrentStep(3)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle document file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateFileUpload({
      name: file.name,
      size: file.size,
      type: file.type,
    })

    if (!validation.valid) {
      setErrorMsg(validation.error || "Invalid file uploaded.")
      return
    }

    setErrorMsg("")
    setDocumentFile(file)
    setDocumentFileName(file.name)
  }

  // Final Registration & Application Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!documentFile) {
      setErrorMsg("Please upload your medical council registration certificate or degree document.")
      return
    }
    if (!certifyAuthentic) {
      setErrorMsg("Please certify that your submitted credentials are authentic.")
      return
    }
    if (!acceptTerms) {
      setErrorMsg("Please accept the Terms of Service and Privacy Policy.")
      return
    }

    setIsLoading(true)

    try {
      // 1. Create the Auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            mobile: phone.trim(),
            role: "doctor",
          },
        },
      })

      if (authError) {
        throw authError
      }

      const user = authData.user
      if (!user) {
        throw new Error("Unable to create account. Please try again.")
      }

      // 2. Upload verification document to private bucket: doctor_verification_docs/{userId}/{filename}
      let docUrl = ""
      const cleanName = documentFile.name.replace(/[^a-zA-Z0-9._-]/g, "_")
      const filePath = `${user.id}/${Date.now()}_${cleanName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("doctor_verification_docs")
        .upload(filePath, documentFile, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadError) {
        console.warn("Storage upload warning (proceeding with application record):", uploadError)
        docUrl = filePath
      } else if (uploadData) {
        docUrl = uploadData.path
      }

      // 3. Update profiles table to ensure role is 'doctor' and contact info is saved
      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          role: "doctor",
          full_name: fullName.trim(),
          mobile: phone.trim(),
          phone: phone.trim(),
        })

      // 4. Submit Doctor Application via server action
      const profileResult = await saveDoctorProfile({
        name: fullName.trim(),
        specialty: specialty.trim(),
        qualifications: qualifications.trim(),
        medicalRegistrationNo: medicalRegistrationNo.trim(),
        registrationAuthority: registrationAuthority.trim(),
        experienceYears: Number(experienceYears) || 0,
        consultationFee: Number(consultationFee) || 500,
        hospitalName: hospitalName.trim() || undefined,
        practiceLocation: practiceLocation.trim() || undefined,
        bio: bio.trim() || undefined,
        verificationDocUrl: docUrl || undefined,
        submitForReview: true,
      })

      if (profileResult?.error) {
        throw new Error(profileResult.error)
      }

      // 5. Show success screen
      setCurrentStep(4)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: unknown) {
      console.error("Doctor registration error:", err)
      const msg = err instanceof Error ? err.message : "Failed to register doctor account. Please try again."
      setErrorMsg(msg)
      setIsLoading(false)
    }
  }

  // STEP 4: SUCCESS CONFIRMATION
  if (currentStep === 4) {
    return (
      <Card className="border-border shadow-sm rounded-2xl bg-card max-w-xl mx-auto">
        <CardContent className="p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-semibold px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
              Status: Pending Administrative Review
            </span>
            <h2 className="text-2xl font-bold text-foreground mt-3">Application Submitted</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>Dr. {fullName}</strong>. Your medical credentials and registration details have been submitted for verification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Specialization:</span>
              <span className="font-semibold text-foreground">{specialty}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border">
              <span className="text-muted-foreground">Medical Council Reg:</span>
              <span className="font-semibold text-foreground">{medicalRegistrationNo}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Review Timeline:</span>
              <span className="font-semibold text-foreground">24 – 48 Hours</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            You will receive notification once an administrator reviews your qualifications. You can sign in anytime to monitor your application progress.
          </p>

          <div className="pt-2">
            <Button
              onClick={() => router.push("/doctor/application-status")}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-11 rounded-xl"
            >
              Track Application Status
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border shadow-sm rounded-2xl bg-card max-w-2xl mx-auto">
      {/* Progress Header */}
      <CardHeader className="pb-4">
        {onBackToSelection && (
          <button
            type="button"
            onClick={onBackToSelection}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 mb-2 font-medium w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Choose a different account type
          </button>
        )}
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Doctor Registration</CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              {currentStep === 1 && "Step 1 of 3: Account & Contact Details"}
              {currentStep === 2 && "Step 2 of 3: Medical Credentials & Practice Details"}
              {currentStep === 3 && "Step 3 of 3: Verification Documents & Final Review"}
            </CardDescription>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        {/* Visual Step Indicator */}
        <div className="flex items-center gap-2 pt-4">
          <div className={`h-1.5 flex-1 rounded-full ${currentStep >= 1 ? "bg-primary" : "bg-border"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep >= 2 ? "bg-primary" : "bg-border"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${currentStep >= 3 ? "bg-primary" : "bg-border"}`} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {errorMsg && (
          <ErrorMessage 
            title="Registration notice"
            message={errorMsg}
            onRetry={() => setErrorMsg("")}
          />
        )}

        {/* ========================================================
            STEP 1: ACCOUNT DETAILS
        ======================================================== */}
        {currentStep === 1 && (
          <form onSubmit={handleProceedToStep2} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="doc-fullname" className="text-foreground">Full Name with Prefix</Label>
              <Input
                id="doc-fullname"
                placeholder="Dr. Sarah Jenkins"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="doc-email" className="text-foreground">Professional Email</Label>
                <Input
                  id="doc-email"
                  type="email"
                  autoComplete="email"
                  placeholder="doctor@clinic.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-phone" className="text-foreground">Phone Number</Label>
                <Input
                  id="doc-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="doc-pass" className="text-foreground">Password (min 8 characters)</Label>
                <div className="relative">
                  <Input
                    id="doc-pass"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-confirm-pass" className="text-foreground">Confirm Password</Label>
                <div className="relative flex items-center">
                  <Input
                    id="doc-confirm-pass"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-11 px-6 rounded-xl">
                Continue to Professional Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 2: PROFESSIONAL DETAILS
        ======================================================== */}
        {currentStep === 2 && (
          <form onSubmit={handleProceedToStep3} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="doc-qualifications" className="text-foreground">Medical Qualifications</Label>
                <Input
                  id="doc-qualifications"
                  placeholder="e.g. MBBS, MD (Cardiology)"
                  required
                  value={qualifications}
                  onChange={e => setQualifications(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-specialty" className="text-foreground">Primary Specialization</Label>
                <select
                  id="doc-specialty"
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full h-11 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  {SPECIALTIES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="doc-reg-no" className="text-foreground">Medical Council Reg. Number</Label>
                <Input
                  id="doc-reg-no"
                  placeholder="e.g. MCI-2019-84920"
                  required
                  value={medicalRegistrationNo}
                  onChange={e => setMedicalRegistrationNo(e.target.value)}
                  className="h-11 font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-reg-auth" className="text-foreground">Registration Authority</Label>
                <Input
                  id="doc-reg-auth"
                  placeholder="e.g. National Medical Commission"
                  required
                  value={registrationAuthority}
                  onChange={e => setRegistrationAuthority(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="doc-exp" className="text-foreground">Years of Experience</Label>
                <Input
                  id="doc-exp"
                  type="number"
                  min="0"
                  max="60"
                  placeholder="5"
                  value={experienceYears}
                  onChange={e => setExperienceYears(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-fee" className="text-foreground">Consultation Fee (₹)</Label>
                <Input
                  id="doc-fee"
                  type="number"
                  min="100"
                  step="50"
                  placeholder="500"
                  value={consultationFee}
                  onChange={e => setConsultationFee(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="doc-hospital" className="text-foreground">Clinic or Hospital Name</Label>
                <Input
                  id="doc-hospital"
                  placeholder="e.g. City Care Polyclinic"
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-location" className="text-foreground">Practice Location / City</Label>
                <Input
                  id="doc-location"
                  placeholder="e.g. Indiranagar, Bengaluru"
                  value={practiceLocation}
                  onChange={e => setPracticeLocation(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="doc-bio" className="text-foreground">Professional Biography</Label>
              <Textarea
                id="doc-bio"
                placeholder="Brief summary of your clinical background, areas of expertise, and patient care philosophy..."
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="resize-none"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="h-11 px-5 rounded-xl border-border text-foreground hover:bg-surface-elevated"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-11 px-6 rounded-xl">
                Continue to Verification
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        )}

        {/* ========================================================
            STEP 3: VERIFICATION DOCUMENTS & FINAL REVIEW
        ======================================================== */}
        {currentStep === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-5">
            {/* Document Upload Box */}
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Medical License / Certificate Document</Label>
              <p className="text-xs text-muted-foreground">
                Upload your Medical Council registration certificate, degree certificate, or state license. Stored in an encrypted private bucket. Max 5MB (PDF, PNG, JPG).
              </p>

              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors bg-surface/50">
                <input
                  type="file"
                  id="doc-file-upload"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="doc-file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  {documentFileName ? (
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-primary">{documentFileName}</span>
                      <span className="text-xs text-muted-foreground block">Click to select a different file</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-foreground">Click to upload document</span>
                      <span className="text-xs text-muted-foreground block">PDF, PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Application Summary Review Card */}
            <div className="rounded-xl border border-border p-4 bg-surface space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Application Review
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-muted-foreground block">Doctor Name</span>
                  <span className="font-semibold text-foreground">{fullName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Email & Phone</span>
                  <span className="font-semibold text-foreground">{email} • {phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Specialty & Degrees</span>
                  <span className="font-semibold text-foreground">{specialty} ({qualifications})</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Registration Authority & No</span>
                  <span className="font-semibold text-foreground font-mono">{registrationAuthority} • {medicalRegistrationNo}</span>
                </div>
                {hospitalName && (
                  <div>
                    <span className="text-muted-foreground block">Hospital / Clinic</span>
                    <span className="font-semibold text-foreground">{hospitalName} {practiceLocation ? `(${practiceLocation})` : ""}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground block">Consultation Fee</span>
                  <span className="font-semibold text-foreground">₹{consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 text-xs text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={certifyAuthentic}
                  onChange={e => setCertifyAuthentic(e.target.checked)}
                  className="mt-0.5 rounded border-input text-primary focus:ring-primary w-4 h-4"
                />
                <span>
                  I certify that all medical qualifications, registration numbers, and uploaded credentials are valid and legally registered with the medical council.
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-input text-primary focus:ring-primary w-4 h-4"
                />
                <span>
                  I accept the{" "}
                  <Link href="/terms" className="text-primary hover:underline font-medium" target="_blank">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline font-medium" target="_blank">
                    Privacy Policy
                  </Link>.
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => setCurrentStep(2)}
                className="h-11 px-5 rounded-xl border-border text-foreground hover:bg-surface-elevated"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-11 px-6 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Submit Application for Verification
                    <ShieldCheck className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>

      <CardFooter className="border-t border-border pt-4 flex items-center justify-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline font-semibold ml-1">
          Log In
        </Link>
      </CardFooter>
    </Card>
  )
}
