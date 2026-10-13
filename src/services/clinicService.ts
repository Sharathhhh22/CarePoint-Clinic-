import { SupabaseClient } from '@supabase/supabase-js'
import { Clinic, Doctor } from '@/types/clinic'
import { ApiError } from '@/lib/api/errorHandler'

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c)
}

export class ClinicService {
  /**
   * Fetches nearby or searchable clinics with matching active doctors
   */
  static async getNearbyClinics(
    supabase: SupabaseClient,
    options: {
      lat?: number | null
      lon?: number | null
      search?: string | null
      specialty?: string | null
    }
  ): Promise<Clinic[]> {
    const { lat, lon, search, specialty } = options
    let clinicsData: Array<{ clinic_id: string; clinic_name: string; clinic_address: string; distance_meters?: number }> = []

    try {
      if (lat != null && lon != null) {
        // 1. Try PostGIS distance-based search
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_nearby_clinics', {
          user_lat: lat,
          user_lon: lon,
          search_radius_meters: 100000, // 100km radius
        })

        if (!rpcError && rpcData && rpcData.length > 0) {
          clinicsData = rpcData.map((c: any) => ({
            clinic_id: c.clinic_id || c.id,
            clinic_name: c.clinic_name || c.name,
            clinic_address: c.clinic_address || c.address,
            distance_meters: c.distance_meters,
          }))
        } else {
          // Fallback to all active clinics if RPC is missing or returned no nearby results
          const { data: fallbackClinics } = await supabase
            .from('clinics')
            .select('id, name, address, latitude, longitude')
            .eq('is_active', true)
            .limit(20)

          clinicsData = (fallbackClinics || []).map((c: any) => ({
            clinic_id: c.id,
            clinic_name: c.name,
            clinic_address: c.address,
            distance_meters: (c.latitude != null && c.longitude != null)
              ? calculateDistanceMeters(lat, lon, c.latitude, c.longitude)
              : undefined,
          }))

          // Sort by distance if calculated
          clinicsData.sort((a, b) => {
            if (a.distance_meters != null && b.distance_meters != null) {
              return a.distance_meters - b.distance_meters
            }
            return 0
          })
        }
      } else if (search && search.trim()) {
        // 2. Text-based search on name and address
        const q = search.trim()
        const { data: searchResults, error: searchError } = await supabase
          .from('clinics')
          .select('id, name, address')
          .eq('is_active', true)
          .or(`name.ilike.%${q}%,address.ilike.%${q}%`)
          .limit(20)

        if (searchError) {
          console.warn('Text search error, falling back to all active clinics:', searchError.message)
          const { data: fallback } = await supabase
            .from('clinics')
            .select('id, name, address')
            .eq('is_active', true)
            .limit(20)
          clinicsData = (fallback || []).map((c: any) => ({
            clinic_id: c.id,
            clinic_name: c.name,
            clinic_address: c.address,
          }))
        } else {
          clinicsData = (searchResults || []).map((c: any) => ({
            clinic_id: c.id,
            clinic_name: c.name,
            clinic_address: c.address,
          }))
        }
      } else {
        // 3. Default: all active clinics
        const { data: allClinics, error: allError } = await supabase
          .from('clinics')
          .select('id, name, address')
          .eq('is_active', true)
          .limit(20)

        if (allError) throw allError
        clinicsData = (allClinics || []).map((c: any) => ({
          clinic_id: c.id,
          clinic_name: c.name,
          clinic_address: c.address,
        }))
      }

      const clinicIds = clinicsData.map(c => c.clinic_id).filter(Boolean)
      if (clinicIds.length === 0) {
        return []
      }

      // Fetch approved active doctors for these clinics
      const { data: doctorsData, error: docsError } = await supabase
        .from('doctors')
        .select('id, name, specialty, experience_years, consultation_fee, currency, photo_url, qualifications, medical_registration_no, status, clinic_id')
        .eq('is_active', true)
        .eq('status', 'approved')
        .in('clinic_id', clinicIds)

      if (docsError) {
        console.error('Doctors query error:', docsError)
        throw new Error(docsError.message || 'Failed to query active doctors')
      }

      const allDoctors = doctorsData || []

      // Smart specialty matching (handles singular/plural variations like "General Physicians" vs "General Physician")
      let filteredDoctors = allDoctors

      if (specialty && specialty.trim()) {
        const clean = specialty.trim().toLowerCase()
        const tokens = clean
          .replace(/physicians/g, 'physician')
          .replace(/practitioners/g, 'practice')
          .replace(/specialists/g, '')
          .replace(/cardiologists/g, 'cardio')
          .split(/\s+/)
          .filter(t => t.length >= 3)

        const matched = allDoctors.filter(d => {
          const docSpec = (d.specialty || '').toLowerCase()
          if (docSpec.includes(clean) || clean.includes(docSpec)) return true
          return tokens.some(t => docSpec.includes(t))
        })

        // If specific specialists were found, use them; otherwise keep all doctors so user is not blocked
        if (matched.length > 0) {
          filteredDoctors = matched
        }
      }

      // Group doctors by clinic with dual-compatible field names
      const clinicsWithDoctors: Clinic[] = clinicsData.map(c => {
        const doctors: Doctor[] = filteredDoctors.filter(d => d.clinic_id === c.clinic_id)
        return {
          id: c.clinic_id,
          clinic_id: c.clinic_id,
          name: c.clinic_name,
          clinic_name: c.clinic_name,
          address: c.clinic_address,
          clinic_address: c.clinic_address,
          city: '',
          distance_km: c.distance_meters != null ? Math.round((c.distance_meters / 1000) * 10) / 10 : undefined,
          distance_meters: c.distance_meters,
          doctors,
        } as unknown as Clinic
      })

      // If specialty was requested, prioritize clinics that have doctors
      const clinicsWithActiveDoctors = clinicsWithDoctors.filter(c => (c.doctors?.length ?? 0) > 0)
      return clinicsWithActiveDoctors.length > 0 ? clinicsWithActiveDoctors : clinicsWithDoctors

    } catch (err: unknown) {
      console.error('Clinic search error details:', err)
      const errorMsg = (err as any)?.message || (err instanceof Error ? err.message : 'Failed to search clinics')
      throw new ApiError(errorMsg, 500, 'CLINIC_FETCH_FAILED', err)
    }
  }
}
