"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { BookingState, BookingPatientDetails } from "@/types/booking"
import { TriageAnalysis } from "@/types/triage"
import { PaymentMethod } from "@/types/appointment"

interface BookingContextType {
  state: BookingState
  currentStep: number
  direction: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  setConcern: (concern: string, analysis?: TriageAnalysis | null) => void
  setClinicAndDoctor: (clinicId: string, clinicName: string, doctorId: string, doctorName: string, fee?: number) => void
  setDateTime: (date: string, time: string, appointmentId: string) => void
  setPatientDetails: (details: Partial<BookingPatientDetails>) => void
  setPaymentMethod: (method: PaymentMethod) => void
  updateField: <K extends keyof BookingState>(key: K, value: BookingState[K]) => void
  resetBooking: () => void
}

const initialBookingState: BookingState = {
  currentStep: 1,
  concern: "",
  aiAnalysis: null,
  clinicId: null,
  clinicName: null,
  doctorId: null,
  doctorName: null,
  consultationFee: null,
  date: null,
  time: null,
  appointmentId: null,
  details: {
    dob: "",
    height: "",
    weight: "",
    notes: "",
    guardianName: "",
    consent: false,
  },
  paymentMethod: "ONLINE_PAYMENT",
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialBookingState)
  const [direction, setDirection] = useState(1)

  const currentStep = state.currentStep

  const nextStep = useCallback(() => {
    setDirection(1)
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 6),
    }))
  }, [])

  const prevStep = useCallback(() => {
    setDirection(-1)
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }))
  }, [])

  const goToStep = useCallback((step: number) => {
    setDirection(step > state.currentStep ? 1 : -1)
    setState(prev => ({ ...prev, currentStep: step }))
  }, [state.currentStep])

  const setConcern = useCallback((concern: string, aiAnalysis: TriageAnalysis | null = null) => {
    setState(prev => ({ ...prev, concern, aiAnalysis }))
  }, [])

  const setClinicAndDoctor = useCallback((
    clinicId: string,
    clinicName: string,
    doctorId: string,
    doctorName: string,
    fee?: number
  ) => {
    setState(prev => ({
      ...prev,
      clinicId,
      clinicName,
      doctorId,
      doctorName,
      consultationFee: fee ?? null,
    }))
  }, [])

  const setDateTime = useCallback((date: string, time: string, appointmentId: string) => {
    setState(prev => ({
      ...prev,
      date,
      time,
      appointmentId,
    }))
  }, [])

  const setPatientDetails = useCallback((details: Partial<BookingPatientDetails>) => {
    setState(prev => ({
      ...prev,
      details: {
        ...prev.details,
        ...details,
      },
    }))
  }, [])

  const setPaymentMethod = useCallback((paymentMethod: PaymentMethod) => {
    setState(prev => ({ ...prev, paymentMethod }))
  }, [])

  const updateField = useCallback(<K extends keyof BookingState>(key: K, value: BookingState[K]) => {
    setState(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetBooking = useCallback(() => {
    setDirection(1)
    setState(initialBookingState)
  }, [])

  return (
    <BookingContext.Provider
      value={{
        state,
        currentStep,
        direction,
        nextStep,
        prevStep,
        goToStep,
        setConcern,
        setClinicAndDoctor,
        setDateTime,
        setPatientDetails,
        setPaymentMethod,
        updateField,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking(): BookingContextType {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider")
  }
  return context
}
