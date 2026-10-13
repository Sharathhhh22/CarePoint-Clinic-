"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// ==============================
// CLINICS
// ==============================
export async function createClinic(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const address = formData.get("address") as string
  const phone = formData.get("phone") as string

  if (!name) {
    redirect('/admin/clinics/new?error=Name is required')
  }

  const { error } = await supabase.from('clinics').insert([{ name, address, phone }])
  
  if (error) {
    redirect('/admin/clinics/new?error=' + encodeURIComponent(error.message))
  }
  
  revalidatePath('/admin/clinics')
  redirect('/admin/clinics')
}

export async function toggleClinicStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  await supabase.from('clinics').update({ is_active: !currentStatus }).eq('id', id)
  revalidatePath('/admin/clinics')
}

// ==============================
// DEPARTMENTS
// ==============================
export async function createDepartment(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  if (!name) throw new Error("Name is required")

  const { error } = await supabase.from('departments').insert([{ name, description }])
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/departments')
  redirect('/admin/departments')
}

export async function toggleDepartmentStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  await supabase.from('departments').update({ is_active: !currentStatus }).eq('id', id)
  revalidatePath('/admin/departments')
}

// ==============================
// DOCTORS
// ==============================
export async function createDoctor(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("name") as string
  const specialty = formData.get("specialty") as string
  const experience_years = parseInt(formData.get("experience_years") as string) || 0

  if (!name) throw new Error("Name is required")

  const { error } = await supabase.from('doctors').insert([{ name, specialty, experience_years }])
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/doctors')
  redirect('/admin/doctors')
}

export async function toggleDoctorStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  await supabase.from('doctors').update({ is_active: !currentStatus }).eq('id', id)
  revalidatePath('/admin/doctors')
}

export async function saveMainClinic(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get("clinicName") as string
  const address = formData.get("address") as string
  const phone = formData.get("contactPhone") as string
  
  if (!name) {
    redirect('/settings?error=Name is required')
  }

  // Try to find the first existing clinic
  const { data: clinics } = await supabase.from('clinics').select('id').limit(1)
  
  if (clinics && clinics.length > 0) {
    // Update existing
    await supabase.from('clinics').update({ name, address, phone }).eq('id', clinics[0].id)
  } else {
    // Insert new
    await supabase.from('clinics').insert([{ name, address, phone }])
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
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Authentication required" }
  }

  // Verify Admin / Staff Privileges
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'staff')) {
    return { error: "Access denied. Only administrators can review doctor applications." }
  }

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

    // 1. Update doctor record with review outcome
    const { error: updateError } = await supabase
      .from('doctors')
      .update({
        status: newStatus,
        is_active: newIsActive,
        admin_reviewer_id: user.id,
        reviewed_at: new Date().toISOString(),
        rejection_reason: decision === 'rejected' ? (reason || 'Credentials could not be verified.') : null,
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
          reason: reason || null,
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

    revalidatePath('/admin/doctors')
    revalidatePath('/doctor')
    return { success: true }
  } catch (err: any) {
    console.error("Error reviewing doctor application:", err)
    return { error: err.message || "Failed to process review." }
  }
}
