"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  CheckCircle2, 
  XCircle, 
  Ban, 
  Search, 
  Clock, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Loader2, 
  Award, 
  Building2,
  Stethoscope,
  Eye,
  AlertTriangle,
  RotateCcw
} from "lucide-react"
import { formatDoctorName } from "@/lib/utils"
import { reviewDoctorApplication, getDoctorVerificationDocSignedUrl } from "@/app/actions/admin"

interface AdminDoctorsClientProps {
  initialDoctors: any[]
  clinics: any[]
}

export function AdminDoctorsClient({ initialDoctors, clinics }: AdminDoctorsClientProps) {
  const [doctors, setDoctors] = useState<any[]>(initialDoctors)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isDocLoading, setIsDocLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const handleOpenVerificationDoc = async (doctorId: string) => {
    setIsDocLoading(true)
    setActionError('')
    try {
      const res = await getDoctorVerificationDocSignedUrl(doctorId)
      if (res.error) {
        setActionError(res.error)
      } else if (res.signedUrl) {
        window.open(res.signedUrl, '_blank', 'noopener,noreferrer')
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to open document.')
    } finally {
      setIsDocLoading(false)
    }
  }

  // Filter doctors by tab and search
  const pendingDoctors = doctors.filter(d => d.status === 'pending' || (!d.status && !d.is_active))
  const approvedDoctors = doctors.filter(d => d.status === 'approved')
  const rejectedDoctors = doctors.filter(d => d.status === 'rejected' || d.status === 'suspended')

  const currentList = activeTab === 'pending' 
    ? pendingDoctors 
    : activeTab === 'approved' 
      ? approvedDoctors 
      : rejectedDoctors

  const filteredList = currentList.filter(d => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      (d.name || '').toLowerCase().includes(q) ||
      (d.specialty || '').toLowerCase().includes(q) ||
      (d.medical_registration_no || '').toLowerCase().includes(q)
    )
  })

  const openReviewModal = (doctor: any) => {
    setSelectedDoctor(doctor)
    setRejectionReason('')
    setShowRejectForm(false)
    setActionError('')
    setIsReviewOpen(true)
  }

  const handleDecision = async (decision: 'approved' | 'rejected' | 'suspended' | 'reactivated') => {
    if (!selectedDoctor) return

    if (decision === 'rejected' && !rejectionReason.trim()) {
      setActionError("Please provide a reason for rejection so the doctor can make corrections.")
      return
    }

    setIsActionLoading(true)
    setActionError('')

    try {
      const res = await reviewDoctorApplication(selectedDoctor.id, decision, rejectionReason.trim())

      if (res.error) {
        setActionError(res.error)
      } else {
        // Update local state smoothly
        const newStatus = (decision === 'approved' || decision === 'reactivated') ? 'approved' : decision
        const newIsActive = (decision === 'approved' || decision === 'reactivated')
        setDoctors(prev => prev.map(d => 
          d.id === selectedDoctor.id 
            ? { ...d, status: newStatus, is_active: newIsActive, rejection_reason: rejectionReason || null }
            : d
        ))
        setIsReviewOpen(false)
        setSelectedDoctor(null)
      }
    } catch (err: any) {
      setActionError(err.message || "Action failed")
    } finally {
      setIsActionLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card 
          onClick={() => setActiveTab('pending')}
          className={`cursor-pointer transition-all ${activeTab === 'pending' ? 'ring-2 ring-primary border-primary shadow-sm' : 'hover:border-primary/50'}`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Verification Queue</p>
              <p className="text-3xl font-bold text-foreground mt-1">{pendingDoctors.length}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Pending review</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => setActiveTab('approved')}
          className={`cursor-pointer transition-all ${activeTab === 'approved' ? 'ring-2 ring-primary border-primary shadow-sm' : 'hover:border-primary/50'}`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Approved Practicing</p>
              <p className="text-3xl font-bold text-foreground mt-1">{approvedDoctors.length}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Publicly active</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => setActiveTab('rejected')}
          className={`cursor-pointer transition-all ${activeTab === 'rejected' ? 'ring-2 ring-primary border-primary shadow-sm' : 'hover:border-primary/50'}`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suspended / Rejected</p>
              <p className="text-3xl font-bold text-foreground mt-1">{rejectedDoctors.length}</p>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Inactive profiles</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Ban className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap min-h-[44px] ${
              activeTab === 'pending' 
                ? 'bg-primary text-primary-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            Review Queue
            {pendingDoctors.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">
                {pendingDoctors.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap min-h-[44px] ${
              activeTab === 'approved' 
                ? 'bg-primary text-primary-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            Approved Directory ({approvedDoctors.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap min-h-[44px] ${
              activeTab === 'rejected' 
                ? 'bg-primary text-primary-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            Suspended / Rejected ({rejectedDoctors.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, reg #, or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 sm:h-9 text-sm sm:text-xs"
          />
        </div>
      </div>

      {/* Doctor Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Physician</TableHead>
                <TableHead>Specialty & Qualifications</TableHead>
                <TableHead>Council Reg #</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    No doctor applications found in this category.
                  </TableCell>
                </TableRow>
              ) : (
                filteredList.map((doc: any) => {
                  const clinicName = clinics.find(c => c.id === doc.clinic_id)?.name || 'Main Clinic'

                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          {doc.photo_url ? (
                            <img 
                              src={doc.photo_url} 
                              alt={doc.name} 
                              loading="lazy" 
                              decoding="async" 
                              className="w-9 h-9 rounded-full object-cover border border-border" 
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {doc.name.replace('Dr.', '').trim().charAt(0) || 'D'}
                            </div>
                          )}
                          <div>
                            <div className="font-bold">{formatDoctorName(doc.name)}</div>
                            <div className="text-xs text-muted-foreground">{clinicName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{doc.specialty || 'General Physician'}</div>
                        <div className="text-xs text-muted-foreground">{doc.qualifications || `${doc.experience_years || 0}y experience`}</div>
                      </TableCell>
                      <TableCell>
                        {doc.medical_registration_no ? (
                          <div className="font-mono text-xs font-semibold text-foreground bg-surface-elevated px-2 py-1 rounded inline-block border border-border">
                            {doc.medical_registration_no}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Not provided</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        ₹{doc.consultation_fee || 500}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          doc.status === 'approved' 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : doc.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {doc.status ? doc.status.toUpperCase() : (doc.is_active ? 'ACTIVE' : 'INACTIVE')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openReviewModal(doc)}
                          className="text-xs h-8"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          {doc.status === 'pending' ? 'Review & Verify' : 'Manage Profile'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review & Verification Modal */}
      {isReviewOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-start justify-between bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Doctor Credential Verification</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Application Review & Medical Licensing Verification</p>
                </div>
              </div>
              <button 
                onClick={() => setIsReviewOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {actionError && (
                <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {actionError}
                </div>
              )}

              {/* Profile Details Grid */}
              <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl border border-border bg-surface/30">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Full Name</span>
                  <span className="text-base font-bold text-foreground">{formatDoctorName(selectedDoctor.name)}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Specialty</span>
                  <span className="text-base font-semibold text-primary">{selectedDoctor.specialty}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Qualifications</span>
                  <span className="text-sm font-medium text-foreground">{selectedDoctor.qualifications || 'MBBS'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Experience</span>
                  <span className="text-sm font-medium text-foreground">{selectedDoctor.experience_years || 0} Years</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Medical Council Reg #</span>
                  <span className="text-sm font-mono font-bold text-foreground bg-surface-elevated px-2 py-0.5 rounded border border-border inline-block mt-0.5">
                    {selectedDoctor.medical_registration_no || 'Pending submission'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Issuing Council Authority</span>
                  <span className="text-sm font-medium text-foreground">{selectedDoctor.registration_authority || 'Medical Council'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Consultation Fee</span>
                  <span className="text-sm font-bold text-foreground">₹{selectedDoctor.consultation_fee || 500}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">Affiliated Clinic</span>
                  <span className="text-sm font-medium text-foreground">
                    {clinics.find(c => c.id === selectedDoctor.clinic_id)?.name || 'Main Clinic'}
                  </span>
                </div>
              </div>

              {/* Professional Bio */}
              {selectedDoctor.bio && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Biography & Clinical Focus</h4>
                  <p className="text-sm text-foreground bg-surface/40 p-3.5 rounded-xl border border-border leading-relaxed">
                    {selectedDoctor.bio}
                  </p>
                </div>
              )}

              {/* Verification Document Evidence */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Registration Proof & License Document</h4>
                {selectedDoctor.verification_doc_url ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenVerificationDoc(selectedDoctor.id)}
                    disabled={isDocLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-sm font-semibold transition-colors min-h-[44px]"
                  >
                    {isDocLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <FileText className="w-4 h-4 mr-1" />}
                    Open Medical Council Registration Document (Encrypted Signed URL)
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground italic bg-surface/30 p-3 rounded-lg border border-border">
                    No external certificate file uploaded. Verified via council registry query.
                  </p>
                )}
              </div>

              {/* Rejection Form Input */}
              {showRejectForm && (
                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 space-y-2 animate-in fade-in">
                  <Label htmlFor="reject-reason" className="text-rose-800 dark:text-rose-300 font-semibold text-xs uppercase tracking-wider">
                    Reason for Rejection * (Visible to Doctor)
                  </Label>
                  <Textarea
                    id="reject-reason"
                    rows={3}
                    placeholder="e.g. Medical registration number does not match council directory. Please re-upload degree certificate..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="text-sm bg-card"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-border bg-surface/50 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReviewOpen(false)}
                disabled={isActionLoading}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {selectedDoctor.status === 'approved' ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isActionLoading}
                    onClick={() => handleDecision('suspended')}
                    className="font-semibold"
                  >
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Ban className="w-4 h-4 mr-1.5" />}
                    Suspend Doctor
                  </Button>
                ) : selectedDoctor.status === 'suspended' || selectedDoctor.status === 'rejected' ? (
                  <Button
                    size="sm"
                    disabled={isActionLoading}
                    onClick={() => handleDecision('reactivated')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <RotateCcw className="w-4 h-4 mr-1.5" />}
                    Reactivate & Approve
                  </Button>
                ) : (
                  <>
                    {!showRejectForm ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isActionLoading}
                        onClick={() => setShowRejectForm(true)}
                        className="text-destructive hover:bg-destructive/10 border-destructive/30 font-semibold"
                      >
                        <XCircle className="w-4 h-4 mr-1.5" />
                        Reject Application
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isActionLoading}
                        onClick={() => handleDecision('rejected')}
                        className="font-semibold"
                      >
                        {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <XCircle className="w-4 h-4 mr-1.5" />}
                        Confirm Rejection
                      </Button>
                    )}

                    <Button
                      size="sm"
                      disabled={isActionLoading}
                      onClick={() => handleDecision('approved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                      Approve Doctor
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
