"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Loader2, Navigation, UserCheck, Stethoscope, ArrowLeft } from "lucide-react"
import { formatDoctorName } from "@/lib/utils"

interface Step2Props {
  data: any
  updateData: (key: string, value: any) => void
  onNext: () => void
  onPrev?: () => void
}

export function Step2Clinic({ data, updateData, onNext, onPrev }: Step2Props) {
  const [clinics, setClinics] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [locationStatus, setLocationStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle")
  const [searchQuery, setSearchQuery] = useState("")

  const recommendedSpecialty = data.aiAnalysis?.recommended_specialization || ""

  const fetchClinicsByCoords = async (lat: number, lon: number) => {
    setIsLoading(true)
    setError("")
    try {
      const url = recommendedSpecialty
        ? `/api/clinics/nearby?lat=${lat}&lon=${lon}&specialty=${encodeURIComponent(recommendedSpecialty)}`
        : `/api/clinics/nearby?lat=${lat}&lon=${lon}`
      const res = await fetch(url)
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setClinics(result.clinics || [])
    } catch (err: any) {
      setError(err.message || "Could not retrieve nearby clinics.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClinicsBySearch = async (query: string) => {
    setIsLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      if (query.trim()) params.set("search", query.trim())
      if (recommendedSpecialty) params.set("specialty", recommendedSpecialty)

      const res = await fetch(`/api/clinics/nearby?${params.toString()}`)
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setClinics(result.clinics || [])
    } catch (err: any) {
      setError(err.message || "Failed to search clinics.")
    } finally {
      setIsLoading(false)
    }
  }

  const requestLocation = () => {
    setLocationStatus("requesting")
    if (!navigator.geolocation) {
      setLocationStatus("denied")
      fetchClinicsBySearch("")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus("granted")
        fetchClinicsByCoords(position.coords.latitude, position.coords.longitude)
      },
      (geoError) => {
        console.warn("Geolocation denied or unavailable:", geoError.message)
        setLocationStatus("denied")
        fetchClinicsBySearch("")
      },
      { timeout: 8000 }
    )
  }

  // Initial load: try to get location
  useEffect(() => {
    if (locationStatus === "idle") {
      requestLocation()
    }
  }, [locationStatus])

  const showAllDoctors = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/clinics/nearby`)
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setClinics(result.clinics || [])
    } catch (err: any) {
      setError(err.message || "Failed to load doctors.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchClinicsBySearch(searchQuery)
  }

  const selectDoctor = (clinicId: string, clinicName: string, doctorId: string, doctorName: string, consultationFee?: number) => {
    updateData("clinicId", clinicId)
    updateData("clinicName", clinicName)
    updateData("doctorId", doctorId)
    updateData("doctorName", doctorName)
    if (consultationFee != null) {
      updateData("consultationFee", consultationFee)
    }
    onNext()
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select a Doctor & Clinic</h2>
        
        {recommendedSpecialty ? (
          <p className="text-muted-foreground mb-6">
            Showing available <strong className="text-foreground">{recommendedSpecialty}</strong> specialists near you.
          </p>
        ) : (
          <p className="text-muted-foreground mb-6">Select a doctor to book your appointment.</p>
        )}

        {/* Location / Search Bar */}
        <div className="mb-8 p-4 bg-surface rounded-xl border border-border">
          {locationStatus === "requesting" && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Detecting your location...
            </div>
          )}
          
          {locationStatus === "granted" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm font-medium text-teal-600 dark:text-teal-400">
                <Navigation className="w-4 h-4 mr-2" /> Using your current location
              </div>
              <Button variant="ghost" size="sm" onClick={() => setLocationStatus("denied")} className="text-xs h-8 text-muted-foreground hover:text-foreground">
                Search manually
              </Button>
            </div>
          )}

          {locationStatus === "denied" && (
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Enter clinic name, city, or address..." 
                  className="pl-9 bg-input-bg border-border text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading} variant="outline">
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>
            </form>
          )}
        </div>

        {error && (
          <div className="p-4 mb-6 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Clinic List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Finding available specialists...</p>
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl p-6">
              <p className="text-muted-foreground">No clinics found matching this specific specialty nearby.</p>
              <Button variant="outline" className="mt-4" onClick={showAllDoctors}>
                Show all doctors
              </Button>
            </div>
          ) : (
            clinics.map(clinic => {
              const clinicId = clinic.clinic_id || clinic.id
              const clinicName = clinic.clinic_name || clinic.name
              const clinicAddress = clinic.clinic_address || clinic.address
              const distance = clinic.distance_km != null 
                ? `${clinic.distance_km} km away` 
                : (clinic.distance_meters != null ? `${(clinic.distance_meters / 1000).toFixed(1)} km away` : undefined)

              return (
                <div key={clinicId} className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-surface p-4 border-b border-border flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-foreground">{clinicName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-3.5 h-3.5 mr-1" /> {clinicAddress}
                        {distance && (
                          <span className="ml-2 px-2 py-0.5 bg-surface-elevated text-muted-foreground border border-border rounded-full text-xs font-medium">
                            {distance}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {clinic.doctors?.length > 0 ? (
                      clinic.doctors.map((doctor: any) => (
                        <div key={doctor.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-surface-elevated/40 transition-colors">
                          <div className="flex items-start sm:items-center gap-4">
                            {doctor.photo_url ? (
                              <img 
                                src={doctor.photo_url} 
                                alt={doctor.name} 
                                loading="lazy"
                                decoding="async"
                                className="w-12 h-12 rounded-full object-cover border border-border shadow-xs" 
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0">
                                <UserCheck className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-foreground">{formatDoctorName(doctor.name)}</h4>
                                {doctor.qualifications && (
                                  <span className="text-xs text-muted-foreground font-mono bg-surface-elevated px-1.5 py-0.5 rounded border border-border">
                                    {doctor.qualifications}
                                  </span>
                                )}
                                <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  ✓ Verified
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center mt-0.5">
                                <Stethoscope className="w-3.5 h-3.5 mr-1 text-primary/70 shrink-0" /> 
                                {doctor.specialty} • {doctor.experience_years ? `${doctor.experience_years}y experience` : 'Experienced'}
                              </p>
                              {doctor.consultation_fee != null && (
                                <p className="text-xs text-muted-foreground mt-1 font-medium">
                                  Consultation Fee: <span className="text-foreground font-semibold">₹{doctor.consultation_fee}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={() => selectDoctor(clinicId, clinicName, doctor.id, doctor.name, doctor.consultation_fee)}
                            className="opacity-90 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary-hover text-primary-foreground font-semibold shrink-0"
                          >
                            Select Doctor
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-muted-foreground italic text-center">
                        No doctors currently available at this location.
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {onPrev && (
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <Button variant="outline" onClick={onPrev} className="font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      )}
    </div>
  )
}
