import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { ClinicService } from '@/services/clinicService'
import { ApiError } from '@/lib/api/errorHandler'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const latParam = url.searchParams.get('lat')
  const lonParam = url.searchParams.get('lon')
  const search = url.searchParams.get('search')
  const specialty = url.searchParams.get('specialty')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const lat = latParam ? parseFloat(latParam) : null
    const lon = lonParam ? parseFloat(lonParam) : null

    const clinics = await ClinicService.getNearbyClinics(supabase, {
      lat,
      lon,
      search,
      specialty,
    })

    return NextResponse.json({ clinics })
  } catch (error: unknown) {
    console.error('Clinic search error:', error)
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    const msg = error instanceof Error ? error.message : 'Failed to fetch clinics'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
