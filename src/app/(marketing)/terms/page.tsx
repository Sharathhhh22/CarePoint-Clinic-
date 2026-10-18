import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the CarePoint Clinic Terms of Service, emergency medical disclaimers, cancellation policies, and clinical platform terms.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service",
    description: "Read the CarePoint Clinic Terms of Service, emergency medical disclaimers, cancellation policies, and clinical platform terms.",
    url: "/terms",
  },
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-4xl pt-28 md:pt-36 pb-24 px-4 sm:px-6 text-foreground">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} className="mb-8" />

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-foreground">Terms of Service</h1>
      <p className="text-muted-foreground mb-10 text-sm">Last updated: October 15, 2026 • Effective Date: October 15, 2026</p>
      
      <div className="space-y-10 text-foreground/90 leading-relaxed text-base">
        {/* EMERGENCY BANNER */}
        <section className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 space-y-2">
          <h2 className="text-lg font-bold text-destructive flex items-center gap-2">
            CRITICAL MEDICAL EMERGENCY NOTICE
          </h2>
          <p className="text-sm text-foreground/90">
            CarePoint Clinic is an appointment coordination and scheduling platform, <strong>NOT</strong> an emergency medical response service. If you are experiencing chest pain, severe shortness of breath, acute trauma, poisoning, severe bleeding, or any life-threatening situation, please call emergency ambulance services immediately by dialing <strong>108</strong> (National Ambulance Service in India) or visit your nearest hospital emergency department.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms & Eligibility</h2>
          <p className="text-muted-foreground">
            By accessing, browsing, or utilizing the CarePoint Clinic platform (accessible via web and mobile interfaces), you enter into a legally binding agreement with CarePoint Clinic Healthcare Technologies and agree to abide by these Terms of Service.
          </p>
          <p className="text-muted-foreground">
            You represent that you are at least 18 years of age and possess the legal capacity to enter into binding contracts. Minors may use the service only through a verified parent or legal guardian who acts as the primary account holder.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">2. Nature of Platform & Non-Clinical Status</h2>
          <p className="text-muted-foreground">
            CarePoint Clinic provides technological tools to facilitate discovery, calendar viewing, slot reservations, and queue coordination between patients and independent clinics or medical practitioners.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>CarePoint Clinic does not practice medicine, prescribe medication, or provide formal diagnostic opinions.</li>
            <li>Any automated features, search filters, or the AI Guide provide informational triage suggestions only and do not replace professional physician consultations.</li>
            <li>A doctor-patient relationship is established exclusively between you and your attending healthcare provider at the time of your clinical consultation.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">3. Patient Responsibilities & Clinic Etiquette</h2>
          <p className="text-muted-foreground">
            To ensure smooth clinic operations and timely consultations for all patients, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Provide accurate, truthful contact details, phone numbers, and relevant clinical background during booking.</li>
            <li>Arrive at the clinic 10 minutes prior to your confirmed time slot to present your digital queue pass.</li>
            <li>Maintain decorum and respect toward clinic receptionists, nursing staff, and medical personnel.</li>
            <li>Promptly notify the clinic through the portal if you are delayed or unable to attend.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">4. Practitioner Obligations & Credential Verification</h2>
          <p className="text-muted-foreground">
            Doctors and clinics registering on CarePoint Clinic warrant and agree that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>They hold active and unrestricted medical practice registrations from their respective State Medical Council or National Medical Commission (NMC).</li>
            <li>They maintain full clinical autonomy and professional medical liability for care provided during consultations.</li>
            <li>Published consultation fees, clinic locations, and working hours are kept accurate and up to date.</li>
            <li>They will not engage in discriminatory treatment or refuse care in violation of ethical medical conduct codes.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">5. Slot Hold, Rescheduling & Cancellation Policy</h2>
          <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
            <h3 className="text-lg font-bold text-foreground">10-Minute Hold & Cancellation Rules</h3>
            <p className="text-sm text-muted-foreground">
              When an appointment slot is selected, it is temporarily locked for 10 minutes to allow completion of patient details. If unconfirmed within this window, the slot is automatically released to other patients.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Free Cancellation:</strong> Appointments may be cancelled or rescheduled up to 2 hours before the scheduled time slot without penalty. For prepaid consultations, refunds will be credited back to the original payment source within 5 to 7 business days.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Doctor Delays:</strong> In cases of unforeseen medical emergencies where a practitioner is delayed, the clinic will offer an alternate queue priority or the option to reschedule at your convenience.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the maximum extent permitted under applicable law, CarePoint Clinic shall not be liable for any indirect, incidental, or consequential damages resulting from clinical diagnoses, treatments prescribed by third-party doctors, clinic delays, power or telecommunication interruptions, or patient failure to arrive on time.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">7. Account Security & Prohibited Activities</h2>
          <p className="text-muted-foreground">
            You are responsible for maintaining the confidentiality of your account credentials. You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Engage in automated scraping, bot bookings, or denial-of-service attacks on clinic calendars.</li>
            <li>Impersonate any healthcare practitioner or submit counterfeit medical registrations.</li>
            <li>Share accounts or book speculative slots with the intent to resell or transfer queue passes.</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-xl font-bold text-foreground">8. Governing Law & Dispute Resolution</h2>
          <p className="text-sm text-muted-foreground">
            These Terms of Service are governed by and construed in accordance with the laws of India. Any legal dispute, claim, or proceeding arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
          </p>
          <div className="text-sm space-y-1 text-muted-foreground pt-2 border-t border-border mt-3">
            <p><strong className="text-foreground">Inquiries:</strong> legal@carepointclinic.com | +91 80 4567 8900</p>
            <p><strong className="text-foreground">Address:</strong> CarePoint Clinic Healthcare Technologies, Indiranagar, Bengaluru, KA 560038</p>
          </div>
        </section>
      </div>
    </div>
  )
}
