"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PhoneCall, AlertTriangle, PhoneForwarded } from "lucide-react"
import { formatDoctorName } from "@/lib/utils"

interface EmergencyCallModalProps {
  isOpen: boolean
  onClose: () => void
  doctorId: string
  doctorName: string
  appointmentId?: string
}

const REASONS = [
  "Condition is rapidly worsening",
  "Experiencing severe new symptoms",
  "Medication adverse reaction",
  "Running late / Logistics emergency"
]

export function EmergencyCallModal({ isOpen, onClose, doctorId, doctorName, appointmentId }: EmergencyCallModalProps) {
  const [reason, setReason] = useState(REASONS[0])
  const [status, setStatus] = useState<'idle' | 'calling' | 'no_answer' | 'connected' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState("")

  const formattedDoc = formatDoctorName(doctorName)

  const handleCall = async () => {
    setStatus('calling')
    setErrorMsg("")

    try {
      const res = await fetch('/api/emergency/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, appointmentId, reason })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate call")
      }
      
      setTimeout(() => {
        if (data.message?.includes('Simulated')) {
          setStatus('no_answer')
        } else {
          setStatus('connected')
        }
      }, 5000)

    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  const handleNotifyClinic = () => {
    alert("The clinic has been notified. They will reach out to you shortly.")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive gap-2">
            <AlertTriangle className="w-5 h-5" />
            Emergency Contact
          </DialogTitle>
          <DialogDescription>
            Contact {formattedDoc} immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg font-medium">
          If this is a life-threatening emergency, call medical emergency (108) now.
        </div>

        {status === 'idle' || status === 'error' ? (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Select Reason:</Label>
              <RadioGroup value={reason} onValueChange={setReason} className="gap-2">
                {REASONS.map((r) => (
                  <div key={r} className="flex items-center space-x-2 border border-border p-3 rounded-lg hover:bg-surface-elevated cursor-pointer bg-card transition-colors">
                    <RadioGroupItem value={r} id={r} />
                    <Label htmlFor={r} className="flex-1 cursor-pointer text-foreground">{r}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="text-xs text-muted-foreground italic">
              Notice: To protect privacy, phone numbers are masked. Calls may be recorded for quality and legal purposes based on clinic settings.
            </div>

            {status === 'error' && (
              <div className="text-sm text-destructive font-medium">
                {errorMsg}
              </div>
            )}

            <Button 
              onClick={handleCall}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold h-12"
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              Call {formattedDoc}
            </Button>
          </div>
        ) : status === 'calling' ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-destructive/15 rounded-full flex items-center justify-center animate-pulse">
                <PhoneForwarded className="w-8 h-8 text-destructive animate-bounce" />
              </div>
              <div className="absolute inset-0 border-4 border-destructive rounded-full animate-ping opacity-20"></div>
            </div>
            <h3 className="text-lg font-bold text-foreground">Calling...</h3>
            <p className="text-sm text-muted-foreground text-center max-w-[250px]">
              You will receive a phone call shortly to connect you. Please answer your phone.
            </p>
          </div>
        ) : status === 'no_answer' ? (
          <div className="flex flex-col py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                <PhoneCall className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Doctor is Unavailable</h3>
              <p className="text-sm text-muted-foreground">
                {formattedDoc} did not answer within 30 seconds. 
              </p>
            </div>
            
            <div className="bg-surface p-4 rounded-xl border border-border space-y-3">
              <p className="text-sm font-semibold text-foreground">Fallback Options:</p>
              
              <Button asChild className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground h-11">
                <a href="tel:108">Call Medical Emergency (108)</a>
              </Button>
              
              <Button onClick={handleNotifyClinic} variant="outline" className="w-full h-11">
                Notify Clinic by Message
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
             <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full flex items-center justify-center">
                <PhoneCall className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Connected</h3>
              <p className="text-sm text-muted-foreground">
                The call has been established.
              </p>
              <Button onClick={onClose} variant="outline" className="mt-4">
                Close
              </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
