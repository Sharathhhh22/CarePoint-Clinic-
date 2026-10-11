import { SupabaseClient } from '@supabase/supabase-js'
import { Appointment, HoldSlotRequest, ConfirmAppointmentRequest } from '@/types/appointment'
import { ApiError } from '@/lib/api/errorHandler'

export class AppointmentService {
  /**
   * Holds a specific slot for a patient for 5 minutes
   */
  static async holdSlot(
    supabase: SupabaseClient,
    userId: string,
    params: HoldSlotRequest
  ): Promise<{ appointmentId: string; heldUntil: string }> {
    const { clinicId, doctorId, date, time } = params

    if (!clinicId || !doctorId || !date || !time) {
      throw new ApiError('Missing required booking fields', 400, 'VALIDATION_ERROR')
    }

    const heldUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: userId,
          clinic_id: clinicId,
          doctor_id: doctorId,
          appointment_date: date,
          appointment_time: time,
          status: 'held',
          held_until: heldUntil,
        },
      ])
      .select('id, held_until')
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new ApiError(
          'That slot was just taken by someone else! Please choose another.',
          409,
          'SLOT_UNAVAILABLE'
        )
      }
      throw new ApiError(error.message, 400, 'DATABASE_ERROR', error)
    }

    return {
      appointmentId: data.id,
      heldUntil: data.held_until,
    }
  }

  /**
   * Confirms a held appointment and records health history
   */
  static async confirmAppointment(
    supabase: SupabaseClient,
    userId: string,
    params: ConfirmAppointmentRequest
  ): Promise<void> {
    const {
      appointmentId,
      dob,
      height,
      weight,
      guardianName,
      shareData,
      concern,
      aiSummary,
      paymentMethod,
    } = params

    if (!appointmentId || !dob) {
      throw new ApiError('Missing appointment ID or date of birth', 400, 'VALIDATION_ERROR')
    }

    // 1. Update appointment to confirmed
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'confirmed',
        dob,
        height_cm: height || null,
        weight_kg: weight || null,
        patient_name: guardianName || null,
        consent_given: shareData,
        payment_mode: paymentMethod || 'PAY_AT_CLINIC',
        reason: shareData ? concern : null,
        ...(shareData && aiSummary ? { reason: `Concern: ${concern}\nAI Summary: ${aiSummary}` } : {}),
      })
      .eq('id', appointmentId)
      .eq('patient_id', userId)
      .eq('status', 'held')

    if (updateError) {
      throw new ApiError('Database error updating appointment: ' + updateError.message, 400, 'UPDATE_FAILED')
    }

    // 2. Record to health history
    const { error: historyError } = await supabase
      .from('health_history')
      .insert([
        {
          patient_id: userId,
          dob,
          height_cm: height || null,
          weight_kg: weight || null,
          recorded_at: new Date().toISOString(),
        },
      ])

    if (historyError) {
      console.warn('Could not save to health history:', historyError)
    }
  }

  /**
   * Retrieves appointments for a patient or clinic staff with relations
   */
  static async getAppointments(
    supabase: SupabaseClient,
    userId: string,
    isAdminOrStaff = false,
    limit = 50
  ): Promise<Appointment[]> {
    let query = supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        appointment_time,
        status,
        payment_mode,
        payment_status,
        patient_name,
        patient_phone,
        reason,
        ticket_number,
        profiles ( id, full_name, mobile ),
        doctors ( id, name, specialty, consultation_fee ),
        clinics ( id, name, address, city )
      `)
      .order('appointment_date', { ascending: false })
      .limit(limit)

    if (!isAdminOrStaff) {
      query = query.eq('patient_id', userId)
    }

    const { data, error } = await query

    if (error) {
      throw new ApiError('Error fetching appointments: ' + error.message, 500, 'FETCH_FAILED')
    }

    return (data as unknown as Appointment[]) || []
  }

  /**
   * Cancels an appointment if owned by user
   */
  static async cancelAppointment(
    supabase: SupabaseClient,
    userId: string,
    appointmentId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .eq('patient_id', userId)

    if (error) {
      throw new ApiError('Failed to cancel appointment: ' + error.message, 400, 'CANCEL_FAILED')
    }
  }
}
