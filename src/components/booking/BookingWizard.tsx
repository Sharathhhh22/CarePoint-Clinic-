"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Activity, MapPin, Calendar as CalendarIcon, User, CheckCircle2 } from "lucide-react"
import { BookingProvider, useBooking } from "@/context/BookingContext"

import { Step1Concern } from "./Step1Concern"
import { Step2Clinic } from "./Step2Clinic"
import { Step3DateTime } from "./Step3DateTime"
import { Step4Details } from "./Step4Details"
import { Step5Review } from "./Step5Review"
import { Step6Confirmation } from "./Step6Confirmation"

const steps = [
  { id: 1, title: "Concern", icon: Activity },
  { id: 2, title: "Clinic & Doctor", icon: MapPin },
  { id: 3, title: "Date & Time", icon: CalendarIcon },
  { id: 4, title: "Details", icon: User },
  { id: 5, title: "Review", icon: CheckCircle2 },
]

function BookingWizardContent() {
  const { state, currentStep, direction, nextStep, prevStep, updateField } = useBooking()

  const variants = {
    initial: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
    }),
  }

  const handleUpdate = (key: string, value: any) => {
    updateField(key as any, value)
  }

  return (
    <div className="max-w-4xl mx-auto min-h-[500px] flex flex-col w-full">
      {/* Progress Indicator */}
      {currentStep < 6 && (
        <div className="mb-6 sm:mb-8">
          {/* Mobile compact progress bar */}
          <div className="sm:hidden space-y-2 px-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-primary flex items-center gap-1.5">
                {(() => {
                  const CurrentIcon = steps[currentStep - 1]?.icon || Activity
                  return <CurrentIcon className="w-4 h-4 text-primary" />
                })()}
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-foreground font-bold">
                {steps[currentStep - 1]?.title}
              </span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Tablet & Desktop full circle steps */}
          <div className="hidden sm:flex items-center justify-between relative px-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((s) => {
              const isActive = s.id === currentStep
              const isPassed = s.id < currentStep
              return (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' 
                      : isPassed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-surface border-2 border-border text-muted-foreground'
                  }`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-semibold ${
                    isActive ? 'text-foreground' : isPassed ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {s.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 bg-card rounded-2xl shadow-sm border border-border overflow-hidden relative min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col"
          >
            {currentStep === 1 && (
              <Step1Concern 
                data={state} 
                updateData={handleUpdate} 
                onNext={nextStep} 
              />
            )}
            {currentStep === 2 && (
              <Step2Clinic 
                data={state} 
                updateData={handleUpdate} 
                onNext={nextStep} 
                onPrev={prevStep}
              />
            )}
            {currentStep === 3 && (
              <Step3DateTime
                data={state}
                updateData={handleUpdate}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 4 && (
              <Step4Details
                data={state}
                updateData={handleUpdate}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 5 && (
              <Step5Review
                data={state}
                updateData={handleUpdate}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            {currentStep === 6 && (
              <Step6Confirmation
                data={state}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function BookingWizard() {
  return (
    <BookingProvider>
      <BookingWizardContent />
    </BookingProvider>
  )
}
