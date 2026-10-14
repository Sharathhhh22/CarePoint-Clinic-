"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { sanitizeText } from "@/lib/security/sanitize"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Sanitize user inputs to prevent XSS / script injection
  const full_name = sanitizeText(formData.get("full_name"))
  const mobile = sanitizeText(formData.get("mobile"))
  const address = sanitizeText(formData.get("address"))
  const bio = sanitizeText(formData.get("bio"))
  
  // Update profiles table strictly for the authenticated user (prevent IDOR)
  const { error } = await supabase
    .from('profiles')
    .update({ 
      full_name, 
      mobile, 
      address, 
      bio 
    })
    .eq('id', user.id)
    
  if (error) {
    console.error("Profile update error:", error)
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return { error: "Please provide both password fields." }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }
  
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters for account security." }
  }

  const { error } = await supabase.auth.updateUser({ password })
  
  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
