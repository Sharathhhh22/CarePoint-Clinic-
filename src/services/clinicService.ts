import { SupabaseClient } from '@supabase/supabase-js'
import { Clinic, Doctor } from '@/types/clinic'
import { ApiError } from '@/lib/api/errorHandler'

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
        // 1. PostGIS distance-based search
        const { data, error } = await supabase.rpc('get_nearby_clinics', {
          user_lat: lat,
          user_lon: lon,
          search_radius_meters: 50000, // 50km
        })

        if (error) {
          console.warn('PostGIS search fallback to regular query:', error.message)
          // Fallback if RPC is missing
          const fallback = await supabase
            .from('clinics')
            .select('clinic_id:id, clinic_name:name, clinic_address:address')
            .eq('is_active', true)
            .limit(20)
          clinicsData = fallback.data || []
        } else {
          clinicsData = data || []
        }
      } else if (search) {
        // 2. Text-based search
        const { data, error } = await supabase
          .from('clinics')
          .select('clinic_id:id, clinic_name:name, clinic_address:address')
          .eq('is_active', true)
          .ilike('address', `%${search}%`)
          .limit(20)

        if (error) throw error
        clinicsData = data || []
      } else {
        // 3. Fallback: all active clinics
        const { data, error } = await supabase
          .from('clinics')
          .select('clinic_id:id, clinic_name:name, clinic_address:address')
          .eq('is_active', true)
          .limit(20)

        if (error) throw error
        clinicsData = data || []
      }

      const clinicIds = clinicsData.map(c => c.clinic_id)
      if (clinicIds.length === 0) {
        return []
      }

      // Fetch active doctors for these clinics
      let doctorsQuery = supabase
        .from('doctors')
        .select('id, name, specialty, experience_years, consultation_fee, clinic_id')
        .eq('is_active', true)
        .in('clinic_id', clinicIds)

      if (specialty) {
        doctorsQuery = doctorsQuery.ilike('specialty', `%${specialty}%`)
      }

      const { data: doctorsData, error: docsError } = await doctorsQuery
      if (docsError) throw docsError

      // Group doctors by clinic
      const clinicsWithDoctors: Clinic[] = clinicsData.map(c => {
        const doctors: Doctor[] = (doctorsData || []).filter(d => d.clinic_id === c.clinic_id)
        return {
          id: c.clinic_id,
          name: c.clinic_name,
          address: c.clinic_address,
          city: '',
          distance_km: c.distance_meters ? Math.round((c.distance_meters / 1000) * 10) / 10 : undefined,
          doctors,
        }
      })

      // Filter out clinics with zero matching doctors when specialty was requested
      if (specialty) {
        return clinicsWithDoctors.filter(c => (c.doctors?.length ?? 0) > 0)
      }

      return clinicsWithDoctors
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to search clinics'
      throw new ApiError(errorMsg, 500, 'CLINIC_FETCH_FAILED', err)
    }
  }
}
