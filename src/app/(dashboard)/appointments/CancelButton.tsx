"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { XCircle, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function CancelButton({ appointmentId }: { appointmentId: string }) {
  const [isCancelling, setIsCancelling] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return
    
    setIsCancelling(true)
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)

      if (error) throw error
      
      router.refresh() // Refresh the server component to show updated list
    } catch (error: any) {
      alert("Failed to cancel appointment: " + error.message)
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleCancel} 
      disabled={isCancelling}
      className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
    >
      {isCancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
      {isCancelling ? "" : "Cancel"}
    </Button>
  )
}
