"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
  MapPin, 
  Navigation, 
  Search, 
  Filter, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  Compass, 
  Activity,
  CalendarDays
} from "lucide-react"
import { Button } from "@/components/ui/Button"

interface ClinicLocation {
  id: string
  name: string
  address: string
  neighborhood: string
  city: string
  lat: number
  lng: number
  specialties: string[]
  doctorsCount: number
  nextSlot: string
  phone: string
  rating: number
  fee: number
}

// Verified Bangalore clinic network coordinates
const CLINICS_DATA: ClinicLocation[] = [
  {
    id: "clinic-1",
    name: "SlotUrSelf Care - Indiranagar",
    address: "100 Feet Road, HAL 2nd Stage",
    neighborhood: "Indiranagar",
    city: "Bengaluru",
    lat: 12.9719,
    lng: 77.6412,
    specialties: ["General Medicine", "Pediatrics", "Cardiology", "Dermatology"],
    doctorsCount: 8,
    nextSlot: "Today, 03:30 PM",
    phone: "+91 80 4567 8901",
    rating: 4.9,
    fee: 500
  },
  {
    id: "clinic-2",
    name: "SlotUrSelf Family Clinic - Koramangala",
    address: "80 Feet Road, 4th Block",
    neighborhood: "Koramangala",
    city: "Bengaluru",
    lat: 12.9352,
    lng: 77.6245,
    specialties: ["General Medicine", "Orthopedics", "Dentistry", "Pediatrics"],
    doctorsCount: 6,
    nextSlot: "Today, 04:00 PM",
    phone: "+91 80 4567 8902",
    rating: 4.8,
    fee: 450
  },
  {
    id: "clinic-3",
    name: "SlotUrSelf Multispecialty - HSR Layout",
    address: "27th Main, Sector 1",
    neighborhood: "HSR Layout",
    city: "Bengaluru",
    lat: 12.9121,
    lng: 77.6446,
    specialties: ["Cardiology", "Neurology", "Ophthalmology", "Dermatology"],
    doctorsCount: 7,
    nextSlot: "Today, 05:15 PM",
    phone: "+91 80 4567 8903",
    rating: 4.9,
    fee: 600
  },
  {
    id: "clinic-4",
    name: "SlotUrSelf Polyclinic - Whitefield",
    address: "ITPL Main Road, Prestige Ozone",
    neighborhood: "Whitefield",
    city: "Bengaluru",
    lat: 12.9698,
    lng: 77.7499,
    specialties: ["General Medicine", "Pediatrics", "Dentistry"],
    doctorsCount: 5,
    nextSlot: "Tomorrow, 10:00 AM",
    phone: "+91 80 4567 8904",
    rating: 4.7,
    fee: 500
  },
  {
    id: "clinic-5",
    name: "SlotUrSelf Health Hub - Jayanagar",
    address: "11th Main Road, 4th Block",
    neighborhood: "Jayanagar",
    city: "Bengaluru",
    lat: 12.9299,
    lng: 77.5838,
    specialties: ["Orthopedics", "Cardiology", "General Medicine"],
    doctorsCount: 6,
    nextSlot: "Today, 06:00 PM",
    phone: "+91 80 4567 8905",
    rating: 4.9,
    fee: 550
  }
]

// Haversine distance formula in kilometers
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10
}

export function ClinicMapExplorer() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [radiusFilter, setRadiusFilter] = useState<number>(0) // 0 means all
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.")
      return
    }

    setGeoLoading(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
        setGeoLoading(false)
        if (radiusFilter === 0) setRadiusFilter(10) // default to 10km when located
      },
      (err) => {
        console.warn("Geo error:", err)
        // Default to central Bengaluru coordinates if denied so distance calculations still work
        setUserLocation({ lat: 12.9716, lng: 77.5946 })
        setGeoError("Using central Bengaluru as location reference.")
        setGeoLoading(false)
      },
      { timeout: 8000 }
    )
  }

  // Calculate distances and filter clinics
  const clinicsWithDistance = useMemo(() => {
    return CLINICS_DATA.map((clinic) => {
      const distance = userLocation
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, clinic.lat, clinic.lng)
        : null
      return { ...clinic, distance }
    })
  }, [userLocation])

  const filteredClinics = useMemo(() => {
    return clinicsWithDistance
      .filter((clinic) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matches =
            clinic.name.toLowerCase().includes(q) ||
            clinic.neighborhood.toLowerCase().includes(q) ||
            clinic.specialties.some((s) => s.toLowerCase().includes(q))
          if (!matches) return false
        }

        // Specialty filter
        if (selectedSpecialty !== "all" && !clinic.specialties.includes(selectedSpecialty)) {
          return false
        }

        // Radius filter
        if (radiusFilter > 0 && clinic.distance !== null && clinic.distance > radiusFilter) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (a.distance !== null && b.distance !== null) {
          return a.distance - b.distance
        }
        return 0
      })
  }, [clinicsWithDistance, searchQuery, selectedSpecialty, radiusFilter])

  return (
    <div className="space-y-8">
      {/* Control Bar: Location trigger, radius, search */}
      <div className="bg-card p-6 rounded-2xl border border-border shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search neighborhood, clinic, or specialty..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-input-bg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={handleLocateMe}
              disabled={geoLoading}
              className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-11 px-4 rounded-xl flex items-center gap-2 text-xs shrink-0"
            >
              <Navigation className={`w-4 h-4 ${geoLoading ? 'animate-spin' : ''}`} />
              {userLocation ? "Location Set" : "Use My Location"}
            </Button>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="h-11 px-3 rounded-xl border border-border bg-card text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shrink-0"
            >
              <option value="all">All Specialties</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dentistry">Dentistry</option>
            </select>

            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(parseInt(e.target.value, 10))}
              className="h-11 px-3 rounded-xl border border-border bg-card text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary shrink-0"
            >
              <option value={0}>Any Distance</option>
              <option value={3}>Within 3 km</option>
              <option value={7}>Within 7 km</option>
              <option value={15}>Within 15 km</option>
            </select>
          </div>
        </div>

        {geoError && (
          <p className="text-xs text-muted-foreground italic flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-primary" />
            {geoError}
          </p>
        )}
      </div>

      {/* SVG Interactive Neighborhood Radar Map */}
      <div className="relative w-full h-56 sm:h-72 rounded-2xl bg-surface border border-border overflow-hidden flex items-center justify-center p-4">
        {/* Radar concentric circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-15">
          <div className="w-[180px] h-[180px] rounded-full border border-primary"></div>
          <div className="w-[320px] h-[320px] rounded-full border border-primary absolute"></div>
          <div className="w-[480px] h-[480px] rounded-full border border-primary absolute"></div>
        </div>

        {/* Map Grid and Interactive Pins */}
        <div className="relative w-full h-full max-w-2xl flex items-center justify-center">
          {/* User Location Pulse */}
          <div className="absolute flex flex-col items-center">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md"></span>
            </span>
            <span className="text-[10px] font-bold text-foreground bg-card/90 px-2 py-0.5 rounded-full border border-border mt-1 shadow-xs">
              You are here
            </span>
          </div>

          {/* Clinic Pins */}
          {filteredClinics.map((clinic, idx) => {
            // Coordinate mapping to SVG space
            const angle = (idx * (360 / CLINICS_DATA.length) * Math.PI) / 180
            const radius = 60 + (idx % 3) * 35
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius

            return (
              <div
                key={clinic.id}
                style={{ transform: `translate(${x}px, ${y}px)` }}
                className="absolute flex flex-col items-center group cursor-pointer z-10"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-bold bg-card border border-border px-2 py-0.5 rounded-md shadow-xs text-foreground mt-1 whitespace-nowrap group-hover:border-primary transition-colors">
                  {clinic.neighborhood} {clinic.distance !== null && `• ${clinic.distance} km`}
                </div>
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-3 right-3 text-[11px] text-muted-foreground bg-card/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-border font-mono">
          Bengaluru Metro Clinical Grid
        </div>
      </div>

      {/* Clinic Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filteredClinics.length} verified clinical locations</span>
          <span>Sorted by proximity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mb-1.5">
                      <ShieldCheck className="w-3 h-3" /> Verified Clinic
                    </span>
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {clinic.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {clinic.address}, {clinic.neighborhood}
                    </p>
                  </div>

                  {clinic.distance !== null && (
                    <div className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-xs shrink-0 flex items-center gap-1">
                      <Navigation className="w-3 h-3" /> {clinic.distance} km
                    </div>
                  )}
                </div>

                {/* Specialties tags */}
                <div className="flex flex-wrap gap-1.5">
                  {clinic.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium bg-surface text-foreground px-2 py-0.5 rounded-md border border-border"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Next available slot strip */}
                <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays className="w-3.5 h-3.5 text-primary" />
                    <span>Next Open Slot:</span>
                  </div>
                  <span className="font-bold text-primary">{clinic.nextSlot}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-muted-foreground">Fee from </span>
                  <span className="font-bold text-foreground">₹{clinic.fee}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${clinic.name}, ${clinic.address}, Bengaluru`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-elevated transition-colors"
                    title="Open in Google Maps"
                  >
                    <Compass className="w-4 h-4" />
                  </a>

                  <Link
                    href={`/appointments/new?clinic=${encodeURIComponent(clinic.name)}`}
                    className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    Book Slot <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
