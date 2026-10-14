"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sanitizeText } from "@/lib/security/sanitize"
import { logAdminAction } from "@/lib/security/auditLog"

/**
 * Strict server-side authorization check to enforce "Never trust the frontend"
 */
async function assertAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized: Please log in to perform administrative actions.")
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    throw new Error("Forbidden: Only administrators or clinic staff can perform this operation.")
  }

  return { user, profile }
}

// ==============================
// CLINICS
// ==============================
export async function createClinic(formData: FormData) {
  const supabase = await createClient()
  const { user } = await assertAdmin(supabase)
  
  const name = sanitizeText(formData.get("name"))
  const address = sanitizeText(formData.get("address"))
  const phone = sanitizeText(formData.get("phone"))

  if (!name) {
    redirect('/admin/clinics/new?error=Name is required')
  }

  const { data: newClinic, error } = await supabase
    .from('clinics')
    .insert([{ name, address, phone }])
    .select('id')
    .single()
  
  if (error) {
    redirect('/admin/clinics/new?error=' + encodeURIComponent(error.message))
  }

  await logAdminAction(supabase, {
    actorId: user.id,
    action: 'CREATE_CLINIC',
    targetResource: 'clinics',
    targetId: newClinic?.id,
    details: { name, address, phone },
  })
  
  revalidatePath('/admin/clinics')
  redirect('/admin/clinics')
}

export async function toggleClinicStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { user } = await assertAdmin(supabase)

  await supabase.from('clinics').update({ is_active: !currentStatus }).eq('id', id)

  await logAdminAction(supabase, {
    actorId: user.id,
    action: 'TOGGLE_CLINIC_STATUS',
    targetResource: 'clinics',
    targetId: id,
    details: { oldStatus: currentStatus, newStatus: !currentStatus },
  })

  revalidatePath('/admin/clinics')
}

// ==============================
// DEPARTMENTS
// ==============================
export async function createDepartment(formData: FormData) {
  const supabase = await createClient()
  const { user } = await assertAdmin(supabase)
  
  const name = sanitizeText(formData.get("name"))
  const description = sanitizeText(formData.get("description"))

  if (!name) throw new Error("Name is required")

  const { data: newDept, error } = await supabase
    .from('departments')
    .insert([{ name, description }])
    .select('id')
    .single()
  
  if (error) throw new Error(error.message)

  await logAdminAction(supabase, {
    actorId: user.id,
    action: 'CREATE_DEPARTMENT',
    targetResource: 'departments',
    targetId: newDept?.id,
    details: { name, description },
  })
  
  revalidatePath('/admin/departments')
  redirect('/admin/departments')
}

export async function toggleDepartmentStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { user } = await assertAdmin(supabase)

  await supabase.from('departments').update({ is_active: !currentStatus }).eq('id', id)

  await logAdminAction(supabase, {
    actorId: user.id,
    action: 'TOGGLE_DEPARTMENT_STATUS',
    targetResource: 'departments',
    targetId: id,
    details: { oldStatus: currentStatus, newStatus: !currentStatus },
  })

  revalidatePath('/admin/departments')
}

// ==============================
// DOCTORS
// ==============================
export async function createDoctor(formData: FormData) {
  const supabase = await createClient()
  const { user } = await assertAdmin(supabase)
  
  const name = sanitizeText(formData.get("name"))
  const specialty = sanitizeText(formData.get("specialty"))
  const experience_years = parseInt(formData.get("experience_years") as string) || 0

  if (!name) throw new Error("Name is required")

  const { data: newDoc, error } = await supabase
    .from('doctors')
    .insert([{ name, specialty, experience_years }])
    .select('id')
    .single()
  
  if (error) throw new Error(error.message)

  await logAdminAction(supabase, {
    actorId: user.id,
    action: 'CREATE_DOCTOR',
    targetResource: 'doctors',
    targetId: newDoc?.id,
    details: { name, specialty, experience_years },
  })
  
  revalidatePath('/admin/doctors')
  redirect('/admin/doctors')
}

export async function toggleDoctorStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { user } = await assertAdmin(supabase)

  await supabase.from('doctors').update({ is_active: !currentStatus }).eq('id', id)

  await logAdminAction(supabase, {
    actorId: user.id,
    action: 'TOGGLE_DOCTOR_STATUS',
    targetResource: 'doctors',
    targetId: id,
    details: { oldStatus: currentStatus, newStatus: !currentStatus },
  })

  revalidatePath('/admin/doctors')
}

export async function saveMainClinic(formData: FormData) {
  const supabase = await createClient()
  const { user } = await assertAdmin(supabase)
  
  const name = sanitizeText(formData.get("clinicName"))
  const address = sanitizeText(formData.get("address"))
  const phone = sanitizeText(formData.get("contactPhone"))
  
  if (!name) {
    redirect('/settings?error=Name is required')
  }

  // Try to find the first existing clinic
  const { data: clinics } = await supabase.from('clinics').select('id').limit(1)
  
  if (clinics && clinics.length > 0) {
    // Update existing
    await supabase.from('clinics').update({ name, address, phone }).eq('id', clinics[0].id)
    await logAdminAction(supabase, {
      actorId: user.id,
      action: 'UPDATE_MAIN_CLINIC',
      targetResource: 'clinics',
      targetId: clinics[0].id,
      details: { name, address, phone },
    })
  } else {
    // Insert new
    const { data: inserted } = await supabase.from('clinics').insert([{ name, address, phone }]).select('id').single()
    await logAdminAction(supabase, {
      actorId: user.id,
      action: 'CREATE_MAIN_CLINIC',
      targetResource: 'clinics',
      targetId: inserted?.id,
      details: { name, address, phone },
    })
  }
  
  revalidatePath('/settings')
  redirect('/settings?success=1')
}

// ==============================
// DOCTOR APPLICATION REVIEW & AUDIT
// ==============================
export async function reviewDoctorApplication(
  doctorId: string,
  decision: 'approved' | 'rejected' | 'suspended' | 'reactivated',
  reason?: string
) {
  const supabase = await createClient()
  const { user, profile } = await assertAdmin(supabase)

  try {
    let newStatus: string
    let newIsActive: boolean

    switch (decision) {
      case 'approved':
      case 'reactivated':
        newStatus = 'approved'
        newIsActive = true
        break
      case 'rejected':
        newStatus = 'rejected'
        newIsActive = false
        break
      case 'suspended':
        newStatus = 'suspended'
        newIsActive = false
        break
      default:
        return { error: "Invalid review decision" }
    }

    const cleanReason = reason ? sanitizeText(reason) : null

    // 1. Update doctor record with review outcome
    const { error: updateError } = await supabase
      .from('doctors')
      .update({
        status: newStatus,
        is_active: newIsActive,
        admin_reviewer_id: user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: decision === 'rejected' ? (cleanReason || 'Credentials could not be verified.') : null,
      })
      .eq('id', doctorId)

    if (updateError) {
      console.error("Failed to update doctor review status:", updateError)
      return { error: updateError.message }
    }

    // 2. Insert into verification review history audit log
    const { error: historyError } = await supabase
      .from('doctor_verification_history')
      .insert([
        {
          doctor_id: doctorId,
          reviewer_id: user.id,
          decision,
          reason: cleanReason,
          reviewed_at: new Date().toISOString(),
          metadata: {
            reviewer_role: profile.role,
            timestamp: new Date().toISOString(),
          },
        },
      ])

    if (historyError) {
      console.warn("Could not write to verification audit log:", historyError)
    }

    // 3. Write to centralized security audit log
    await logAdminAction(supabase, {
      actorId: user.id,
      action: `DOCTOR_REVIEW_${decision.toUpperCase()}`,
      targetResource: 'doctors',
      targetId: doctorId,
      details: { decision, reason: cleanReason },
    })

    revalidatePath('/admin/doctors')
    revalidatePath('/doctor')
    return { success: true }
  } catch (err: any) {
    console.error("Error reviewing doctor application:", err)
    return { error: err.message || "Failed to process review." }
  }
}
