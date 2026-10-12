"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, CheckCircle2, Loader2, Calendar, Clock, MapPin, UserCheck, ShieldCheck, CreditCard, Banknote, QrCode } from "lucide-react"
import Image from "next/image"
import { formatDoctorName } from "@/lib/utils"

interface Step5Props {
  data: any
  updateData: (key: string, value: any) => void
  onNext: () => void
  onPrev: () => void
}

export function Step5Review({ data, updateData, onNext, onPrev }: Step5Props) {
  const [shareData, setShareData] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE_PAYMENT" | "PAY_AT_CLINIC">("ONLINE_PAYMENT")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const getPayload = () => ({
    appointmentId: data.appointmentId,
    dob: data.dob,
    height: data.height,
    weight: data.weight,
    guardianName: data.guardianName,
    shareData,
    concern: shareData ? data.concern : null,
    aiSummary: shareData ? data.aiAnalysis?.plain_language_summary : null,
    paymentMethod
  })

  const handleConfirm = async () => {
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch('/api/appointments/confirm', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getPayload())
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to confirm appointment")
      }
      
      updateData("paymentMethod", paymentMethod)
      onNext()

    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const formatTime = (t: string) => {
    if (!t) return ""
    const [h, m] = t.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${m} ${ampm}`
  }

  const formatDate = (d: string) => {
    if (!d) return ""
    return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Review & Payment</h2>
          <p className="text-sm text-muted-foreground">Confirm your details and complete the booking</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-20">
        
        {/* Appointment Summary */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Appointment Details
          </h3>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Doctor</p>
              <p className="font-medium text-foreground">{formatDoctorName(data.doctorName)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Clinic</p>
              <p className="font-medium text-foreground">{data.clinicName}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Date</p>
              <p className="font-medium text-foreground">{formatDate(data.date)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Time</p>
              <p className="font-medium text-foreground">{formatTime(data.time)}</p>
            </div>
          </div>
        </div>

        {/* Payment Selection */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            Payment Method
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setPaymentMethod("ONLINE_PAYMENT")}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                paymentMethod === "ONLINE_PAYMENT" 
                  ? "border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 shadow-sm" 
                  : "border-border bg-card hover:border-teal-400 hover:bg-surface-elevated"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${paymentMethod === "ONLINE_PAYMENT" ? "bg-teal-600 text-white" : "bg-surface-elevated text-muted-foreground"}`}>
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Online Payment</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Pay securely using UPI</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => setPaymentMethod("PAY_AT_CLINIC")}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                paymentMethod === "PAY_AT_CLINIC" 
                  ? "border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 shadow-sm" 
                  : "border-border bg-card hover:border-teal-400 hover:bg-surface-elevated"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${paymentMethod === "PAY_AT_CLINIC" ? "bg-teal-600 text-white" : "bg-surface-elevated text-muted-foreground"}`}>
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Pay at Clinic</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Pay directly at the clinic</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Payment Panel */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {paymentMethod === "ONLINE_PAYMENT" ? (
            <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground text-lg">Complete Your Payment</h4>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Scan the QR code using your preferred UPI app to complete the payment.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-border shadow-sm inline-block">
                <div className="relative w-48 h-48 mx-auto">
                  <Image 
                    src="/images/payment_qr.jpg" 
                    alt="UPI Payment QR Code" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Scan with any supported UPI app</p>
                <p className="text-lg font-bold text-teal-600 dark:text-teal-400">Amount to Pay: ₹500</p>
              </div>

              <div className="w-full pt-4 space-y-3">
                <Button 
                  onClick={handleConfirm} 
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base"
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Payment Completed"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Payment confirmation received. Your appointment will be confirmed after payment verification.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground text-lg">Pay at Clinic</h4>
                <p className="text-sm text-muted-foreground">
                  You can pay for your appointment directly at the clinic when you arrive.
                </p>
              </div>

              <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                <li>Payment is completed at the clinic.</li>
                <li>No online payment is required right now.</li>
                <li>Arrive at the clinic at your scheduled appointment time.</li>
                <li>Keep your appointment details available when you arrive.</li>
              </ul>
              
              <div className="bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-sm p-3 rounded-lg flex items-start gap-2 mt-4 border border-teal-200 dark:border-teal-800">
                <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <p>Your appointment can be booked without making an online payment.</p>
              </div>

              <div className="w-full pt-4">
                <Button 
                  onClick={handleConfirm} 
                  disabled={isLoading}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base"
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Book Appointment"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Data Sharing Toggle */}
        <div className="bg-surface rounded-xl p-4 border border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <label htmlFor="share-data" className="text-sm font-medium text-foreground cursor-pointer">
                  Share Context with Doctor
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                Help the doctor prepare by sharing your AI summary and vitals.
              </p>
            </div>
            <Switch
              id="share-data"
              checked={shareData}
              onCheckedChange={setShareData}
            />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm border border-destructive/20">
            {error}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-border flex justify-between bg-card z-10">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    </div>
  )
}
