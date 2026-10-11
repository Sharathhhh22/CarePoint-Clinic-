import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { AppointmentService } from '@/services/appointmentService'
import { ApiError } from '@/lib/api/errorHandler'

export async function PUT(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await req.json()

    await AppointmentService.confirmAppointment(supabase, user.id, payload)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Confirmation error:', error)
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
