"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { PhoneCall } from "lucide-react"
import { EmergencyCallModal } from "@/components/telephony/EmergencyCallModal"

interface EmergencyButtonProps {
  doctorId: string
  doctorName: string
  appointmentId?: string
}

export default function EmergencyButton({ doctorId, doctorName, appointmentId }: EmergencyButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30"
      >
        <PhoneCall className="w-4 h-4 mr-1" />
        Emergency
      </Button>

      {isOpen && (
        <EmergencyCallModal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          doctorId={doctorId}
          doctorName={doctorName}
          appointmentId={appointmentId}
        />
      )}
    </>
  )
}
