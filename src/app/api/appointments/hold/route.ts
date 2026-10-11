import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { AppointmentService } from '@/services/appointmentService'
import { ApiError } from '@/lib/api/errorHandler'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { clinicId, doctorId, date, time } = await req.json()

    const result = await AppointmentService.holdSlot(supabase, user.id, {
      clinicId,
      doctorId,
      date,
      time,
    })

    return NextResponse.json({
      success: true,
      appointmentId: result.appointmentId,
      heldUntil: result.heldUntil,
    })
  } catch (error: unknown) {
    console.error('Slot hold error:', error)
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    const msg = error instanceof Error ? error.message : 'Failed to hold slot'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
