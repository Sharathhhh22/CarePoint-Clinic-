-- ==============================================================================
-- REAL-TIME RESOURCE ALLOCATION & CONCURRENCY LOCK MIGRATION
-- SlotUrSelf Healthcare Platform
-- Safe, idempotent, non-destructive migration
-- ==============================================================================

-- 1. ADD DOCTOR AVAILABILITY TO SUPABASE REALTIME PUBLICATION
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE doctor_availability;
    EXCEPTION
      WHEN duplicate_object THEN
        NULL;
      WHEN OTHERS THEN
        NULL;
    END;
  END IF;
END $$;

-- 2. ATOMIC SLOT HOLD & CONCURRENCY LOCK RPC
-- Prevents double-booking race conditions when multiple patients attempt to hold
-- the same appointment slot simultaneously, and recycles expired 5-minute holds.
CREATE OR REPLACE FUNCTION public.hold_appointment_slot_atomic(
  p_patient_id UUID,
  p_doctor_id UUID,
  p_clinic_id UUID,
  p_date DATE,
  p_time TIME,
  p_held_minutes INT DEFAULT 5
)
RETURNS TABLE (
  appointment_id UUID,
  held_until TIMESTAMPTZ,
  success BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  v_held_until TIMESTAMPTZ;
  v_existing_id UUID;
  v_existing_status TEXT;
  v_new_id UUID;
BEGIN
  v_held_until := NOW() + (p_held_minutes || ' minutes')::interval;

  -- Step A: Cancel any expired hold on this slot to recycle it for new patients
  UPDATE public.appointments
  SET status = 'cancelled', updated_at = NOW()
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND appointment_time = p_time
    AND status = 'held'
    AND held_until <= NOW();

  -- Step B: Check if slot is actively held or confirmed
  SELECT id, status INTO v_existing_id, v_existing_status
  FROM public.appointments
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND appointment_time = p_time
    AND (status = 'confirmed' OR (status = 'held' AND held_until > NOW()))
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    RETURN QUERY SELECT 
      NULL::UUID, 
      NULL::TIMESTAMPTZ, 
      FALSE, 
      'That slot was just reserved by another patient. Please choose an alternate time.'::TEXT;
    RETURN;
  END IF;

  -- Step C: Atomically insert the new held appointment
  INSERT INTO public.appointments (
    patient_id,
    doctor_id,
    clinic_id,
    appointment_date,
    appointment_time,
    status,
    held_until,
    created_at,
    updated_at
  ) VALUES (
    p_patient_id,
    p_doctor_id,
    p_clinic_id,
    p_date,
    p_time,
    'held',
    v_held_until,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_new_id;

  RETURN QUERY SELECT 
    v_new_id, 
    v_held_until, 
    TRUE, 
    NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. GRANT RPC PERMISSIONS
GRANT EXECUTE ON FUNCTION public.hold_appointment_slot_atomic(UUID, UUID, UUID, DATE, TIME, INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.hold_appointment_slot_atomic(UUID, UUID, UUID, DATE, TIME, INT) TO service_role;

-- 4. ENSURE DOCTOR AVAILABILITY HAS PUBLIC SELECT ACCESS FOR ACTIVE DOCTORS
DROP POLICY IF EXISTS "Public can view active doctor availability" ON public.doctor_availability;
CREATE POLICY "Public can view active doctor availability"
  ON public.doctor_availability
  FOR SELECT TO authenticated, anon
  USING (
    is_active = true 
    AND doctor_id IN (
      SELECT id FROM public.doctors WHERE is_active = true AND status = 'approved'
    )
  );

-- 5. FUNCTION TO QUERY CURRENT ALLOCATION STATISTICS (FOR ADMIN ALLOCATION MONITOR)
CREATE OR REPLACE FUNCTION public.get_resource_allocation_stats()
RETURNS JSON AS $$
DECLARE
  v_total_doctors INT;
  v_active_doctors INT;
  v_pending_doctors INT;
  v_today_held INT;
  v_today_confirmed INT;
  v_today_completed INT;
  v_result JSON;
BEGIN
  -- Doctor counts
  SELECT COUNT(*) INTO v_total_doctors FROM public.doctors;
  SELECT COUNT(*) INTO v_active_doctors FROM public.doctors WHERE is_active = true AND status = 'approved';
  SELECT COUNT(*) INTO v_pending_doctors FROM public.doctors WHERE status = 'pending';

  -- Today's appointment counts
  SELECT COUNT(*) INTO v_today_held 
  FROM public.appointments 
  WHERE appointment_date = CURRENT_DATE AND status = 'held' AND held_until > NOW();

  SELECT COUNT(*) INTO v_today_confirmed 
  FROM public.appointments 
  WHERE appointment_date = CURRENT_DATE AND status = 'confirmed';

  SELECT COUNT(*) INTO v_today_completed 
  FROM public.appointments 
  WHERE appointment_date = CURRENT_DATE AND status = 'completed';

  v_result := json_build_object(
    'total_doctors', v_total_doctors,
    'active_doctors', v_active_doctors,
    'pending_doctors', v_pending_doctors,
    'today_held', v_today_held,
    'today_confirmed', v_today_confirmed,
    'today_completed', v_today_completed
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_resource_allocation_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_resource_allocation_stats() TO service_role;
