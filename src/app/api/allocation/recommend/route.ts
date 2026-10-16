import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { AllocationService } from '@/services/allocationService'
import { ApiError } from '@/lib/api/errorHandler'

export async function POST(req: Request) {
  const supabase = await createClient()

  try {
    const body = await req.json()
    const {
      specialty,
      patientLat,
      patientLon,
      preferredDate,
      preferredTimeSlot,
      concern,
      isEmergency,
    } = body

    const result = await AllocationService.getRecommendedDoctors(supabase, {
      specialty,
      patientLat: patientLat != null ? parseFloat(patientLat) : null,
      patientLon: patientLon != null ? parseFloat(patientLon) : null,
      preferredDate,
      preferredTimeSlot,
      concern,
      isEmergency: Boolean(isEmergency),
    })

    return NextResponse.json(result)
  } catch (error: unknown) {
    console.error('Allocation recommendation error:', error)
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    const msg = error instanceof Error ? error.message : 'Failed to compute allocations'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
