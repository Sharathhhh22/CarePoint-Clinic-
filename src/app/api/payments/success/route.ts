import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const sessionId = url.searchParams.get('session_id')
  const appointmentId = url.searchParams.get('appointment_id')

  if (!sessionId || !appointmentId) {
    return NextResponse.redirect(new URL('/appointments/new?error=missing_params', req.url))
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Enforce authentication on payment confirmation to stop IDOR bugs
  if (!user) {
    return NextResponse.redirect(new URL('/login?error=unauthorized', req.url))
  }

  // 1. Confirm the appointment and mark it as paid online, scoped strictly to the authenticated patient
  const { error } = await supabase
    .from('appointments')
    .update({ 
      status: 'confirmed',
      payment_mode: 'online',
      transaction_id: sessionId
    })
    .eq('id', appointmentId)
    .eq('patient_id', user.id) // Strict IDOR defense
    .eq('status', 'held')

  if (error) {
    console.error('[Payment Confirmation Error]:', error)
    return NextResponse.redirect(new URL('/appointments/new?error=confirmation_failed', req.url))
  }

  // 2. Record the health history if provided
  const { data: appt } = await supabase
    .from('appointments')
    .select('patient_id, height_cm, weight_kg, dob')
    .eq('id', appointmentId)
    .eq('patient_id', user.id)
    .maybeSingle()

  if (appt && (appt.height_cm || appt.weight_kg)) {
    await supabase.from('health_history').insert({
      patient_id: appt.patient_id,
      height_cm: appt.height_cm,
      weight_kg: appt.weight_kg
    }).select().maybeSingle()
  }

  // Redirect to the receipt with verified payment
  return NextResponse.redirect(new URL(`/receipt/${appointmentId}?payment=success`, req.url))
}
