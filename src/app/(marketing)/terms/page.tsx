import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | SlotUrSelf",
  description: "Read the SlotUrSelf Terms of Service, medical disclaimers, and user platform guidelines.",
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-3xl py-24 px-6 text-foreground">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground/90">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using SlotUrSelf, you accept and agree to be bound by the terms and provisions of this agreement.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Medical Disclaimer</h2>
          <p>
            SlotUrSelf is an appointment booking platform. We do not provide direct medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Appointment Cancellations</h2>
          <p>
            You agree to notify the clinic at least 2 hours in advance if you need to cancel or reschedule your appointment.
          </p>
        </section>
      </div>
    </div>
  )
}
