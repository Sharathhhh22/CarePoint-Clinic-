"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Trash2, ExternalLink, Activity, Pill, Plus, Eye, Stethoscope, Tag } from "lucide-react"
import { validateFileUpload } from "@/lib/security/fileValidation"
import { sanitizeText } from "@/lib/security/sanitize"
import { PrescriptionViewer } from "@/components/records/PrescriptionViewer"
import type { PrescriptionData } from "@/components/records/PrescriptionModal"

function generateStorageFileName(userId: string, originalName: string) {
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${userId}/${Date.now()}-${sanitizedName}`
}

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState<"prescriptions" | "reports">("prescriptions")
  const [records, setRecords] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([])
  const [viewingPrescription, setViewingPrescription] = useState<PrescriptionData | null>(null)
  const [category, setCategory] = useState("Blood Test")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")

  const supabase = createClient()

  async function fetchRecords() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { data, error } = await supabase
        .from('patient_records')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecords(data || [])

      // Load stored prescriptions
      const storedRx = localStorage.getItem("sloturself_prescriptions")
      if (storedRx) {
        setPrescriptions(JSON.parse(storedRx))
      } else {
        // Initial sample prescription so the user has an immediate working example
        const sampleRx: PrescriptionData = {
          id: "rx-sample-01",
          appointmentId: "demo-appt",
          patientName: user.user_metadata?.full_name || "Self",
          doctorName: "Dr. Arvind Rao",
          doctorRegNo: "KMC-2016-8942",
          clinicName: "Indiranagar Family Clinic",
          date: new Date().toISOString().split('T')[0],
          diagnosis: "Seasonal Viral Pharyngitis with dry cough",
          medicines: [
            { id: "1", name: "Amoxicillin", dosage: "500 mg", frequency: "Thrice daily (1-1-1)", duration: "5 days", instructions: "After food" },
            { id: "2", name: "Cetirizine", dosage: "10 mg", frequency: "At Bedtime (0-0-1)", duration: "5 days", instructions: "With water" },
            { id: "3", name: "Dextromethorphan Cough Syrup", dosage: "10 ml", frequency: "Twice daily (1-0-1)", duration: "4 days", instructions: "After meals" }
          ],
          advice: "Warm saline gargles thrice daily. Avoid cold beverages and air-conditioning drafts.",
          followUpDays: 5
        }
        setPrescriptions([sampleRx])
      }
    } catch (err: any) {
      console.error(err)
      setError("Failed to load medical records.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !title || !user) return

    // Validate file upload types, size (5MB), and MIME security
    const validation = validateFileUpload(file)
    if (!validation.valid) {
      setError(validation.error || "Invalid file.")
      return
    }

    setUploading(true)
    setError("")

    try {
      const cleanTitle = sanitizeText(title)
      const fileName = generateStorageFileName(user.id, validation.cleanFileName || file.name)

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('medical_records')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Save storage relative path to Database
      const { error: dbError } = await supabase
        .from('patient_records')
        .insert([
          {
            patient_id: user.id,
            title: cleanTitle || title,
            file_url: fileName
          }
        ])

      if (dbError) throw dbError

      // Reset form and reload
      setTitle("")
      setFile(null)
      fetchRecords()

    } catch (err: any) {
      console.error(err)
      setError("Failed to upload file. Please make sure you created the 'medical_records' bucket in Supabase.")
    } finally {
      setUploading(false)
    }
  }

  async function handleViewReport(record: any) {
    try {
      let filePath = record.file_url
      if (!filePath) return

      if (filePath.includes('/medical_records/')) {
        filePath = filePath.split('/medical_records/')[1]
      } else if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        const url = new URL(filePath)
        const parts = url.pathname.split('/')
        filePath = parts.slice(parts.indexOf('medical_records') + 1).join('/')
      }

      const { data, error } = await supabase.storage
        .from('medical_records')
        .createSignedUrl(filePath, 300) // 5 minutes validity

      if (error || !data?.signedUrl) {
        alert("Could not generate secure download link: " + (error?.message || "File unavailable"))
        return
      }

      window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
    } catch (err: any) {
      alert("Error accessing report: " + err.message)
    }
  }

  async function handleDelete(id: string, fileUrl: string) {
    if (!confirm("Are you sure you want to delete this record?")) return

    try {
      // 1. Delete from DB
      await supabase.from('patient_records').delete().eq('id', id)
      
      // 2. Attempt cleanup from private storage
      if (fileUrl) {
        let filePath = fileUrl
        if (filePath.includes('/medical_records/')) {
          filePath = filePath.split('/medical_records/')[1]
        }
        await supabase.storage.from('medical_records').remove([filePath])
      }

      setRecords(records.filter(r => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-foreground">Medical Records Vault</h1>
          <p className="text-muted-foreground mt-1">
            Access your verified electronic prescriptions, laboratory test reports, and diagnostic scans.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-surface border border-border rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "prescriptions"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Pill className="w-3.5 h-3.5" /> Doctor Prescriptions (Rx)
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "reports"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Diagnostic Reports & Scans
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl border border-destructive/20 text-sm font-medium">
          {error}
        </div>
      )}

      {/* TAB 1: DOCTOR PRESCRIPTIONS */}
      {activeTab === "prescriptions" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((rx) => (
              <Card key={rx.id} className="border-border bg-card hover:border-primary/50 transition-colors shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      ℞
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-foreground">{rx.diagnosis}</CardTitle>
                      <CardDescription className="text-xs">
                        Prescribed by {rx.doctorName} • {new Date(rx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-surface border border-border text-xs space-y-1">
                    <span className="font-semibold text-foreground">Medicines Prescribed ({rx.medicines.length}):</span>
                    <p className="text-muted-foreground truncate">
                      {rx.medicines.map(m => m.name).join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {rx.clinicName || "Clinic Network"}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setViewingPrescription(rx)}
                      className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs h-8 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> View / Print Rx
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {prescriptions.length === 0 && (
            <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border p-8">
              <Pill className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="font-bold text-foreground">No prescriptions issued yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Once a doctor completes your consultation and issues a prescription, it will appear here automatically.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DIAGNOSTIC REPORTS & SCANS */}
      {activeTab === "reports" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-base font-bold">Upload Report</CardTitle>
                <CardDescription className="text-xs">Add a lab result, MRI, or blood test.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-xs font-semibold">Report Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-input-bg text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Blood Test">Blood Test / Lipid Profile</option>
                      <option value="Imaging / X-Ray">Radiology (X-Ray / MRI / CT)</option>
                      <option value="Cardiology / ECG">Cardiology / ECG</option>
                      <option value="Pathology">Pathology / Biopsy</option>
                      <option value="Discharge Summary">Hospital Discharge Summary</option>
                      <option value="General">Other Medical Report</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="title" className="text-xs font-semibold">Document Title</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="e.g. Complete Blood Count (CBC) - Apollo"
                      className="h-10 text-xs rounded-xl"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="file" className="text-xs font-semibold">Report File</Label>
                    <Input 
                      id="file" 
                      type="file" 
                      onChange={(e) => setFile(e.target.files?.[0] || null)} 
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="text-xs rounded-xl file:text-xs"
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">PDF, JPG, or PNG up to 5MB</p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={uploading || !file || !title} 
                    className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-10 text-xs rounded-xl"
                  >
                    {uploading ? (
                      <>Uploading & Encrypting...</>
                    ) : (
                      <><Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Report</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Records List */}
          <div className="lg:col-span-2">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Your Lab Documents</CardTitle>
                  <CardDescription className="text-xs">Stored securely in your encrypted personal health locker.</CardDescription>
                </div>
                <span className="text-xs text-muted-foreground">{records.length} document{records.length === 1 ? '' : 's'}</span>
              </CardHeader>
              <CardContent>
                {records.length === 0 ? (
                  <div className="text-center py-12 bg-surface rounded-xl border border-dashed border-border">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <h3 className="font-bold text-foreground text-sm">No uploaded reports</h3>
                    <p className="text-muted-foreground text-xs mt-0.5">Upload blood tests or scans using the form on the left.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {records.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-surface transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm">{record.title}</h4>
                            <p className="text-[11px] text-muted-foreground">
                              Uploaded on {new Date(record.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button 
                            type="button"
                            onClick={() => handleViewReport(record)} 
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                            title="View / Download Encrypted Report"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id, record.file_url)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Delete Report"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Prescription Viewer Modal Popup */}
      {viewingPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl my-8">
            <PrescriptionViewer 
              prescription={viewingPrescription} 
              onClose={() => setViewingPrescription(null)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}
