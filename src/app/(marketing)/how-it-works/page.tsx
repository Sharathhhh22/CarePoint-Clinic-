import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { HowItWorksClient } from "./HowItWorksClient"

export const metadata: Metadata = {
  title: "How It Works | CarePoint Clinic",
  description: "Learn how easy it is to schedule consultations, access verified medical specialists, and experience unhurried outpatient care at CarePoint Clinic.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How It Works | CarePoint Clinic",
    description: "Learn how easy it is to schedule consultations, access verified medical specialists, and experience unhurried outpatient care at CarePoint Clinic.",
    url: "/how-it-works",
  },
}

const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Book an Instant Doctor Appointment on SlotUrSelf",
  "description": "Step-by-step guide to searching for verified doctors, locking real-time appointment slots, and skipping the clinic queue.",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Find Your Specialist",
      "text": "Search verified clinics and doctors by specialty, qualification, and location. See consultation fees and available dates immediately."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Select an Open Slot",
      "text": "View actual consultation hours synchronized directly with the clinic calendar. Your selected slot is held exclusively for 10 minutes."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Confirm with Flexible Payment",
      "text": "Confirm your visit instantly. Pay securely online or choose to pay in cash or card directly at the clinic reception desk."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Skip the Waiting Line",
      "text": "Arrive 10 minutes prior to your time, display your digital pass or QR token at reception, and proceed directly to your consultation."
    }
  ]
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      <div className="site-container">
        <Breadcrumbs items={[{ label: "How It Works" }]} className="mb-8" />

        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            How It Works
          </h1>
          <p className="text-xl text-muted-foreground">
            Booking a doctor should be as easy as booking a table at a restaurant.
          </p>
        </div>

        <HowItWorksClient />
      </div>
    </div>
  )
}
