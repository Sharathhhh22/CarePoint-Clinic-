import { SupabaseClient } from '@supabase/supabase-js'

export interface DoctorRecommendationRequest {
  specialty?: string | null
  patientLat?: number | null
  patientLon?: number | null
  preferredDate?: string | null
  preferredTimeSlot?: string | null
  concern?: string | null
  isEmergency?: boolean
}

export interface DoctorAllocationScore {
  doctor: {
    id: string
    name: string
    specialty: string
    experience_years?: number
    consultation_fee?: number
    photo_url?: string | null
    clinic_id?: string
    clinic_name?: string
    clinic_address?: string
    distance_km?: number
  }
  score: number // 0 to 100
  factors: {
    specialtyScore: number // up to 40
    availabilityScore: number // up to 25
    workloadScore: number // up to 20
    proximityScore: number // up to 15
  }
  nextAvailableSlot?: {
    date: string
    time: string
  } | null
  todayWorkloadCount: number
  capacityStatus: 'available' | 'high_demand' | 'full'
  emergencyWarning?: string | null
}

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth radius in km
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Math.round(R * c * 10) / 10
}

/**
 * Checks for life-threatening emergency cues in the patient concern
 */
function checkForEmergencySignals(text?: string | null, isExplicitEmergency = false): boolean {
  if (isExplicitEmergency) return true
  if (!text) return false

  const emergencyKeywords = [
    'chest pain', 'heart attack', 'unconscious', 'cannot breathe',
    'severe bleeding', 'stroke', 'seizure', 'anaphylaxis',
    'difficulty breathing', 'severe head injury', 'poisoning'
  ]

  const lower = text.toLowerCase()
  return emergencyKeywords.some(keyword => lower.includes(keyword))
}

export class AllocationService {
  /**
   * Recommends and ranks active doctors using multi-factor allocation scoring
   */
  static async getRecommendedDoctors(
    supabase: SupabaseClient,
    request: DoctorRecommendationRequest
  ): Promise<{
    recommendations: DoctorAllocationScore[]
    emergencyAlert?: string | null
  }> {
    const isEmergency = checkForEmergencySignals(request.concern, request.isEmergency)
    const emergencyAlert = isEmergency
      ? "Emergency Medical Advisory: Your symptoms suggest an acute emergency. Routine booking is not recommended. Please call emergency services (+91 80 4567 8900 or 112) or proceed to the nearest emergency room immediately."
      : null

    const targetDate = request.preferredDate || new Date().toISOString().split('T')[0]
    const targetDayOfWeek = new Date(targetDate).getDay()

    // 1. Fetch all approved and active doctors with clinic relations
    const { data: doctorsData, error: docsError } = await supabase
      .from('doctors')
      .select(`
        id,
        name,
        specialty,
        experience_years,
        consultation_fee,
        photo_url,
        is_active,
        status,
        clinic_id,
        clinics (
          id,
          name,
          address,
          latitude,
          longitude
        )
      `)
      .eq('is_active', true)
      .eq('status', 'approved')

    if (docsError || !doctorsData || doctorsData.length === 0) {
      return { recommendations: [], emergencyAlert }
    }

    const doctorIds = doctorsData.map(d => d.id)

    // 2. Fetch doctor availability schedules
    const { data: availabilityData } = await supabase
      .from('doctor_availability')
      .select('*')
      .in('doctor_id', doctorIds)
      .eq('is_active', true)

    const availabilityByDoctor = new Map<string, any[]>()
    for (const a of availabilityData || []) {
      const list = availabilityByDoctor.get(a.doctor_id) || []
      list.push(a)
      availabilityByDoctor.set(a.doctor_id, list)
    }

    // 3. Fetch today's / target date appointments to evaluate current workload
    const { data: appointmentsData } = await supabase
      .from('appointments')
      .select('doctor_id, appointment_date, appointment_time, status, held_until')
      .in('doctor_id', doctorIds)
      .eq('appointment_date', targetDate)
      .in('status', ['confirmed', 'held'])

    const workloadByDoctor = new Map<string, number>()
    const takenSlotsByDoctor = new Map<string, Set<string>>()

    for (const apt of appointmentsData || []) {
      // Exclude expired holds from workload
      if (apt.status === 'held' && apt.held_until && new Date(apt.held_until) <= new Date()) {
        continue
      }

      workloadByDoctor.set(apt.doctor_id, (workloadByDoctor.get(apt.doctor_id) || 0) + 1)

      const slots = takenSlotsByDoctor.get(apt.doctor_id) || new Set<string>()
      slots.add(apt.appointment_time)
      takenSlotsByDoctor.set(apt.doctor_id, slots)
    }

    // 4. Calculate multi-factor scores for each doctor
    const recommendations: DoctorAllocationScore[] = []

    for (const doc of doctorsData) {
      const clinic = Array.isArray(doc.clinics) ? doc.clinics[0] : doc.clinics
      const doctorSchedules = availabilityByDoctor.get(doc.id) || []
      const currentWorkload = workloadByDoctor.get(doc.id) || 0
      const takenSlots = takenSlotsByDoctor.get(doc.id) || new Set<string>()

      // --- Factor A: Specialty Match (up to 40 pts) ---
      let specialtyScore = 15 // base fallback score
      if (request.specialty && request.specialty.trim()) {
        const querySpec = request.specialty.trim().toLowerCase()
        const docSpec = (doc.specialty || '').toLowerCase()

        if (docSpec === querySpec) {
          specialtyScore = 40
        } else if (docSpec.includes(querySpec) || querySpec.includes(docSpec)) {
          specialtyScore = 35
        } else {
          // Check common synonyms
          const queryTokens = querySpec.split(/\s+/)
          const hasCommonToken = queryTokens.some(t => t.length > 3 && docSpec.includes(t))
          if (hasCommonToken) {
            specialtyScore = 25
          } else {
            specialtyScore = docSpec.includes('general') ? 15 : 5
          }
        }
      } else {
        specialtyScore = 30 // Neutral when no specialty filter requested
      }

      // --- Factor B: Availability & Next Slot (up to 25 pts) ---
      let availabilityScore = 5
      let nextAvailableSlot: { date: string; time: string } | null = null

      const scheduleForTargetDay = doctorSchedules.find(s => s.day_of_week === targetDayOfWeek)
      if (scheduleForTargetDay || doctorSchedules.length === 0) {
        // Doctor works on target date (or uses default 9-5 hours)
        const startH = scheduleForTargetDay ? parseInt(scheduleForTargetDay.start_time.split(':')[0], 10) : 9
        const endH = scheduleForTargetDay ? parseInt(scheduleForTargetDay.end_time.split(':')[0], 10) : 17

        for (let h = startH; h < endH; h++) {
          const slot1 = `${h.toString().padStart(2, '0')}:00:00`
          const slot2 = `${h.toString().padStart(2, '0')}:30:00`

          if (!takenSlots.has(slot1)) {
            nextAvailableSlot = { date: targetDate, time: slot1 }
            availabilityScore = 25
            break
          }
          if (!takenSlots.has(slot2)) {
            nextAvailableSlot = { date: targetDate, time: slot2 }
            availabilityScore = 25
            break
          }
        }

        // If today is full, but doctor is active, assign partial score
        if (!nextAvailableSlot) {
          availabilityScore = 10
        }
      } else if (doctorSchedules.length > 0) {
        // Doctor works other days of the week
        availabilityScore = 12
        // Find next day doctor works
        for (let offset = 1; offset <= 7; offset++) {
          const nextD = new Date(targetDate)
          nextD.setDate(nextD.getDate() + offset)
          const nextDay = nextD.getDay()
          const nextSched = doctorSchedules.find(s => s.day_of_week === nextDay)
          if (nextSched) {
            nextAvailableSlot = {
              date: nextD.toISOString().split('T')[0],
              time: nextSched.start_time
            }
            break
          }
        }
      }

      // --- Factor C: Workload & Capacity Balance (up to 20 pts) ---
      let workloadScore = 20
      let capacityStatus: 'available' | 'high_demand' | 'full' = 'available'

      if (currentWorkload >= 12) {
        workloadScore = 0
        capacityStatus = 'full'
      } else if (currentWorkload >= 8) {
        workloadScore = 8
        capacityStatus = 'high_demand'
      } else if (currentWorkload >= 5) {
        workloadScore = 14
        capacityStatus = 'available'
      } else {
        workloadScore = 20
        capacityStatus = 'available'
      }

      // --- Factor D: Geographic Proximity (up to 15 pts) ---
      let proximityScore = 10 // neutral default
      let distanceKm: number | undefined

      if (
        request.patientLat != null &&
        request.patientLon != null &&
        clinic?.latitude != null &&
        clinic?.longitude != null
      ) {
        distanceKm = calculateDistanceKm(
          request.patientLat,
          request.patientLon,
          clinic.latitude,
          clinic.longitude
        )

        if (distanceKm <= 5) proximityScore = 15
        else if (distanceKm <= 10) proximityScore = 12
        else if (distanceKm <= 20) proximityScore = 8
        else if (distanceKm <= 40) proximityScore = 5
        else proximityScore = 2
      }

      const totalScore = Math.min(
        100,
        Math.round(specialtyScore + availabilityScore + workloadScore + proximityScore)
      )

      recommendations.push({
        doctor: {
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          experience_years: doc.experience_years,
          consultation_fee: doc.consultation_fee,
          photo_url: doc.photo_url,
          clinic_id: doc.clinic_id,
          clinic_name: clinic?.name || 'Main Medical Center',
          clinic_address: clinic?.address || 'Bengaluru, India',
          distance_km: distanceKm,
        },
        score: totalScore,
        factors: {
          specialtyScore,
          availabilityScore,
          workloadScore,
          proximityScore,
        },
        nextAvailableSlot,
        todayWorkloadCount: currentWorkload,
        capacityStatus,
        emergencyWarning: emergencyAlert,
      })
    }

    // Sort by allocation score descending
    recommendations.sort((a, b) => b.score - a.score)

    return {
      recommendations,
      emergencyAlert,
    }
  }
}
