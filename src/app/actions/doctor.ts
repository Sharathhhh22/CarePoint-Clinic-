"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { sanitizeText } from "@/lib/security/sanitize"

export interface SaveDoctorProfileInput {
  name: string
  specialty: string
  qualifications: string
  medicalRegistrationNo: string
  registrationAuthority: string
  experienceYears: number
  consultationFee: number
  clinicId?: string
  hospitalName?: string
  practiceLocation?: string
  bio?: string
  photoUrl?: string
  verificationDocUrl?: string
  submitForReview: boolean
  schedule?: Array<{
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive: boolean
  }>
}

/**
 * Saves a doctor profile as draft or submits for admin verification
 */
export async function saveDoctorProfile(input: SaveDoctorProfileInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in to submit a doctor profile." }
  }

  const name = sanitizeText(input.name)
  const specialty = sanitizeText(input.specialty)
  const qualifications = sanitizeText(input.qualifications)
  const medicalRegistrationNo = sanitizeText(input.medicalRegistrationNo)
  const registrationAuthority = sanitizeText(input.registrationAuthority)
  const experienceYears = Number(input.experienceYears) || 0
  const consultationFee = Number(input.consultationFee) || 500
  const clinicId = input.clinicId || null
  const hospitalName = input.hospitalName ? sanitizeText(input.hospitalName) : undefined
  const practiceLocation = input.practiceLocation ? sanitizeText(input.practiceLocation) : undefined
  const bio = input.bio ? sanitizeText(input.bio) : undefined
  const photoUrl = input.photoUrl ? sanitizeText(input.photoUrl) : undefined
  const verificationDocUrl = input.verificationDocUrl ? sanitizeText(input.verificationDocUrl) : undefined
  const submitForReview = Boolean(input.submitForReview)
  const schedule = input.schedule

  if (!name.trim()) return { error: "Doctor name is required." }
  if (!specialty.trim()) return { error: "Specialty is required." }
  if (submitForReview) {
    if (!qualifications.trim()) return { error: "Medical qualifications are required for review." }
    if (!medicalRegistrationNo.trim()) return { error: "Medical council registration number is required." }
  }

  const targetStatus = submitForReview ? 'pending' : 'draft'

  try {
    // 1. Check if an existing doctor record belongs to this user
    const { data: existingDoctor } = await supabase
      .from('doctors')
      .select('id, status')
      .eq('profile_id', user.id)
      .maybeSingle()

    let doctorId: string

    if (existingDoctor) {
      doctorId = existingDoctor.id
      const { error: updateError } = await supabase
        .from('doctors')
        .update({
          name: name.trim(),
          specialty: specialty.trim(),
          qualifications: qualifications.trim(),
          medical_registration_no: medicalRegistrationNo.trim(),
          registration_authority: registrationAuthority.trim(),
          experience_years: Number(experienceYears) || 0,
          consultation_fee: Number(consultationFee) || 500,
          clinic_id: clinicId || null,
          hospital_name: hospitalName?.trim() || null,
          practice_location: practiceLocation?.trim() || null,
          bio: bio?.trim() || null,
          photo_url: photoUrl?.trim() || null,
          verification_doc_url: verificationDocUrl?.trim() || null,
          status: targetStatus,
          is_active: false, // Inactive until admin approves
          rejection_reason: null, // Clear past rejection feedback on resubmission
        })
        .eq('id', existingDoctor.id)

      if (updateError) {
        console.error("Doctor update error:", updateError)
        return { error: updateError.message }
      }
    } else {
      // Create new doctor record
      const { data: newDoc, error: insertError } = await supabase
        .from('doctors')
        .insert([
          {
            profile_id: user.id,
            name: name.trim(),
            specialty: specialty.trim(),
            qualifications: qualifications.trim(),
            medical_registration_no: medicalRegistrationNo.trim(),
            registration_authority: registrationAuthority.trim(),
            experience_years: Number(experienceYears) || 0,
            consultation_fee: Number(consultationFee) || 500,
            clinic_id: clinicId || null,
            hospital_name: hospitalName?.trim() || null,
            practice_location: practiceLocation?.trim() || null,
            bio: bio?.trim() || null,
            photo_url: photoUrl?.trim() || null,
            verification_doc_url: verificationDocUrl?.trim() || null,
            status: targetStatus,
            is_active: false,
          },
        ])
        .select('id')
        .single()

      if (insertError) {
        console.error("Doctor insert error:", insertError)
        return { error: insertError.message }
      }
      doctorId = newDoc.id
    }

    // Note: Do not elevate profile role to 'doctor' here. Role escalation is strictly 
    // enforced upon Administrator verification and approval to prevent premature privilege escalation.

    // 2. Save weekly availability schedule if provided
    if (schedule && schedule.length > 0) {
      // Remove existing availability records for this doctor
      await supabase
        .from('doctor_availability')
        .delete()
        .eq('doctor_id', doctorId)

      // Insert new weekly availability rows
      const availabilityRows = schedule.map((slot) => ({
        doctor_id: doctorId,
        day_of_week: slot.dayOfWeek,
        start_time: slot.startTime,
        end_time: slot.endTime,
        is_active: slot.isActive,
      }))

      const { error: availError } = await supabase
        .from('doctor_availability')
        .insert(availabilityRows)

      if (availError) {
        console.warn("Could not save availability schedule:", availError)
      }
    }

    revalidatePath('/doctor')
    revalidatePath('/admin/doctors')
    return { success: true, doctorId, status: targetStatus }
  } catch (err: any) {
    console.error("Error in saveDoctorProfile:", err)
    return { error: err.message || "Failed to save profile." }
  }
}

/**
 * Updates availability schedule for an approved doctor
 */
export async function updateDoctorSchedule(
  doctorId: string,
  schedule: Array<{ dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Verify ownership or admin
  const { data: doc } = await supabase
    .from('doctors')
    .select('id, profile_id')
    .eq('id', doctorId)
    .single()

  if (!doc || doc.profile_id !== user.id) {
    return { error: "You can only update your own schedule." }
  }

  try {
    await supabase
      .from('doctor_availability')
      .delete()
      .eq('doctor_id', doctorId)

    const rows = schedule.map((s) => ({
      doctor_id: doctorId,
      day_of_week: s.dayOfWeek,
      start_time: s.startTime,
      end_time: s.endTime,
      is_active: s.isActive,
    }))

    const { error } = await supabase.from('doctor_availability').insert(rows)
    if (error) throw error

    revalidatePath('/doctor')
    revalidatePath('/admin/allocation')
    revalidatePath('/appointments/new')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || "Failed to update schedule." }
  }
}
