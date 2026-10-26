"use client"

import { useState, useRef } from "react"
import { createClient } from "@/utils/supabase/client"
import { Camera, Loader2, User as UserIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { validateFileUpload } from "@/lib/security/fileValidation"

export function AvatarUpload({ userId, initialUrl }: { userId: string, initialUrl?: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl || null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]

      // Security check: validate size and image MIME type
      const validation = validateFileUpload(file)
      if (!validation.valid || file.type === 'application/pdf') {
        throw new Error(validation.error || 'Please upload a valid image file (JPEG, PNG, or WEBP under 5MB).')
      }

      setUploading(true)

      const fileExt = validation.cleanFileName?.split('.').pop() || file.name.split('.').pop() || 'jpg'
      const filePath = `${userId}/avatar.${fileExt}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      setAvatarUrl(publicUrl)
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Error uploading avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative group">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-card bg-surface-elevated shadow-lg flex items-center justify-center relative">
        {avatarUrl ? (
          <Image 
            src={avatarUrl} 
            alt="User profile photo" 
            fill 
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-surface-elevated to-primary/5">
            <UserIcon className="w-12 h-12 text-primary" />
          </div>
        )}
        
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
      </div>
      
      <input
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  )
}
