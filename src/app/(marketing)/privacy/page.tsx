import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how CarePoint Clinic collects, secures, and protects patient and medical data in compliance with digital healthcare privacy standards and the DPDP Act.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy",
    description: "Learn how CarePoint Clinic collects, secures, and protects patient and medical data in compliance with digital healthcare privacy standards and the DPDP Act.",
    url: "/privacy",
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-4xl pt-28 md:pt-36 pb-24 px-4 sm:px-6 text-foreground">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} className="mb-8" />

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-foreground">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10 text-sm">Last updated: October 15, 2026 • Effective Date: October 15, 2026</p>
      
      <div className="space-y-10 text-foreground/90 leading-relaxed text-base">
        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-xl font-bold text-foreground">1. Introduction & Regulatory Framework</h2>
          <p className="text-muted-foreground">
            CarePoint Clinic (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the clinical appointment scheduling platform accessible at carepointclinic.com. We are committed to safeguarding the privacy and confidentiality of personal data and digital health information entrusted to us by patients, doctors, and clinic partners.
          </p>
          <p className="text-muted-foreground">
            This Privacy Policy is formulated in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act), the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (SPDI Rules) of India.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
          <p className="text-muted-foreground">
            We collect only the minimum necessary information required to schedule, confirm, and facilitate your outpatient clinical consultations:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-xl bg-card border border-border space-y-2">
              <h3 className="font-semibold text-foreground">A. Patient Profile Information</h3>
              <p className="text-sm text-muted-foreground">
                Full legal name, mobile telephone number, email address, date of birth, emergency contact, and communication preferences.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border space-y-2">
              <h3 className="font-semibold text-foreground">B. Appointment & Clinical Intake Data</h3>
              <p className="text-sm text-muted-foreground">
                Chosen department/specialty, attending doctor or clinic, requested appointment time slot, visit notes, and symptom description provided for triage.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border space-y-2">
              <h3 className="font-semibold text-foreground">C. Practitioner Credentials</h3>
              <p className="text-sm text-muted-foreground">
                State Medical Council or National Medical Commission registration numbers, degrees, clinic addresses, and consultation fee schedules.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border space-y-2">
              <h3 className="font-semibold text-foreground">D. Technical & Security Telemetry</h3>
              <p className="text-sm text-muted-foreground">
                Internet Protocol (IP) address, browser user-agent, device characteristics, operating system, and secure session authentication tokens.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">3. Purpose and Legal Grounds for Processing</h2>
          <p className="text-muted-foreground">
            Your personal data is processed solely on the basis of your explicit consent and for valid healthcare facilitation purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Facilitating appointment discovery, calendar synchronization, and slot holding with your chosen healthcare provider.</li>
            <li>Generating digital queue tokens and digital clinic entrance passes to reduce physical waiting room congestion.</li>
            <li>Sending critical transactional notifications regarding appointment confirmations, schedule changes, or cancellations.</li>
            <li>Verifying practitioner licensing credentials prior to publishing provider profiles.</li>
            <li>Preventing fraudulent access, malicious automated bookings, and unauthorized account takeovers.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">4. Strict Data Segregation & Sharing Policies</h2>
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
            <p className="font-semibold text-foreground">Zero Third-Party Advertising Monetization</p>
            <p className="text-sm text-muted-foreground">
              CarePoint Clinic never sells, leases, rents, or monetizes patient health records or appointment details to third-party data brokers, insurers, or advertising platforms.
            </p>
            <p className="text-sm text-muted-foreground">
              Your consultation intake information is shared exclusively with the specific medical practitioner and clinic personnel with whom you have confirmed an appointment. All database records are strictly isolated using role-based access control, ensuring doctors can only access records of patients booked with their clinic.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">5. Data Retention & Erasure</h2>
          <p className="text-muted-foreground">
            We retain your profile and booking history only for as long as your account remains active or as required by applicable Indian medical record retention regulations. You may request the deletion of your account and personal data at any time through your Profile Settings or by contacting our Data Grievance Officer. Upon confirmed request, your non-statutory records will be erased within 30 days.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">6. Security Architecture & Standards</h2>
          <p className="text-muted-foreground">
            We implement comprehensive technical and organizational safeguards:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Transport Security:</strong> All web traffic and API endpoints are encrypted in transit using Transport Layer Security (TLS 1.3).</li>
            <li><strong>Storage Encryption:</strong> Database records, authentication tokens, and audit trails are encrypted at rest using industry-standard AES-256 encryption.</li>
            <li><strong>Role-Based Access Control:</strong> Strict database permission policies enforce that patients can only view their own appointments and profiles.</li>
            <li><strong>Authentication Safety:</strong> Salted password hashing and secure token-based session management prevent credential tampering.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">7. Your Rights under the DPDP Act</h2>
          <p className="text-muted-foreground">
            As a data principal, you possess specific legal rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li><strong>Right to Access:</strong> You can review a summary of personal data held about you in your Patient Portal at any time.</li>
            <li><strong>Right to Correction:</strong> You can update inaccurate contact details or personal preferences directly in your Profile.</li>
            <li><strong>Right to Withdraw Consent:</strong> You may revoke consent for future data processing by requesting account deactivation.</li>
            <li><strong>Right to Grievance Redressal:</strong> You have the right to file inquiries or complaints directly with our designated Grievance Officer.</li>
          </ul>
        </section>

        <section className="p-6 rounded-2xl bg-card border border-border space-y-3">
          <h2 className="text-xl font-bold text-foreground">8. Grievance Officer & Contact Details</h2>
          <p className="text-sm text-muted-foreground">
            In accordance with the Information Technology Act, 2000 and the DPDP Act, 2023, the details of our Grievance Officer are:
          </p>
          <div className="text-sm space-y-1 text-muted-foreground pt-1">
            <p><strong className="text-foreground">Grievance Officer:</strong> Healthcare Compliance Desk</p>
            <p><strong className="text-foreground">Entity:</strong> CarePoint Clinic Healthcare Technologies</p>
            <p><strong className="text-foreground">Address:</strong> Indiranagar, 100 Feet Road, Bengaluru, Karnataka 560038, India</p>
            <p><strong className="text-foreground">Email:</strong> privacy@carepointclinic.com / support@carepointclinic.com</p>
            <p><strong className="text-foreground">Helpline:</strong> +91 80 4567 8900 (Mon–Sat, 9:00 AM – 7:00 PM IST)</p>
          </div>
        </section>
      </div>
    </div>
  )
}
