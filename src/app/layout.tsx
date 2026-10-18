import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { FeaturesOverlay } from "@/components/layout/FeaturesOverlay";
import { ThemeProvider } from "@/components/ThemeProvider";
import { siteConfig } from "@/config/site";
import { ToastProvider } from "@/components/ui/toast";
import { Suspense } from "react";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { UtmTracker } from "@/components/common/UtmTracker";

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  manifest: "/manifest.webmanifest",
  title: {
    default: "CarePoint Clinic | Compassionate Modern Healthcare",
    template: "%s | CarePoint Clinic",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
  },
  keywords: [
    "doctor appointment",
    "clinic booking",
    "CarePoint Clinic",
    "healthcare specialists",
    "AI medical triage",
    "online doctor booking",
    "verified doctors",
    "outpatient scheduling",
    "digital clinic pass"
  ],
  openGraph: {
    title: "CarePoint Clinic | Compassionate Modern Healthcare",
    description: "Book verified specialists and real-time appointment slots in under 60 seconds.",
    url: siteConfig.url,
    siteName: "CarePoint Clinic",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CarePoint Clinic - Compassionate Modern Healthcare",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarePoint Clinic | Compassionate Modern Healthcare",
    description: "Book verified specialists and real-time appointment slots in under 60 seconds.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": `${siteConfig.url}/#organization`,
      "name": "CarePoint Clinic",
      "alternateName": "CarePoint Outpatient Medical Centre & Urgent Care",
      "legalName": "CarePoint Medical Group LLC",
      "url": siteConfig.url,
      "logo": `${siteConfig.url}/icon`,
      "image": [
        `${siteConfig.url}/opengraph-image`,
        `${siteConfig.url}/images/carenova/doc-clinic-1.jpg`,
        `${siteConfig.url}/images/carenova/doc-clinic-4.jpg`
      ],
      "description": "CarePoint Clinic is an accredited outpatient medical centre offering family medicine, cardiovascular care, pediatric wellness, neurology, point-of-care laboratory diagnostics, and same-day telehealth.",
      "telephone": siteConfig.contact.phone,
      "email": siteConfig.contact.email,
      "emergencyTelephone": siteConfig.contact.emergencyPhone,
      "priceRange": "$$",
      "currenciesAccepted": "USD",
      "paymentAccepted": "Cash, Credit Card, Debit Card, Medicare, Medicaid, Commercial Private Insurance (BlueCross BlueShield, Aetna, Cigna, UnitedHealthcare)",
      "isAcceptingNewPatients": true,
      "hasMap": "https://maps.google.com/?q=42.3401,-71.0903",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "450 Medical Heights Blvd, Suite 300",
        "addressLocality": "Boston",
        "addressRegion": "MA",
        "postalCode": "02115",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 42.3401,
        "longitude": -71.0903
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "07:30",
          "closes": "20:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Sunday"],
          "opens": "09:00",
          "closes": "16:00"
        }
      ],
      "medicalSpecialty": [
        "Cardiovascular",
        "Neurology",
        "PrimaryCare",
        "Pediatrics",
        "InternalMedicine",
        "DiagnosticRadiology"
      ],
      "availableService": [
        {
          "@type": "MedicalProcedure",
          "name": "Comprehensive Primary Care Consultation",
          "procedureType": "NoninvasiveProcedure",
          "description": "Routine physical exam, preventive screening, prescription refills, and personalized wellness plans."
        },
        {
          "@type": "MedicalProcedure",
          "name": "Cardiovascular Assessment & 12-Lead ECG",
          "procedureType": "DiagnosticProcedure",
          "description": "Resting 12-lead electrocardiogram, hypertension monitoring, and lipid panel evaluation."
        },
        {
          "@type": "MedicalProcedure",
          "name": "Pediatric Developmental Wellness Check",
          "procedureType": "NoninvasiveProcedure",
          "description": "Child development tracking, vital screening, vision and hearing assessments in a calm setting."
        },
        {
          "@type": "MedicalProcedure",
          "name": "Diagnostic Ultrasound & Point-of-Care Blood Testing",
          "procedureType": "DiagnosticProcedure",
          "description": "High-resolution soft tissue imaging, metabolic panels, and rapid HbA1c testing with same-day reports."
        },
        {
          "@type": "MedicalTherapy",
          "name": "HIPAA-Compliant Telehealth Consultation",
          "description": "Encrypted high-definition video consultations with board-certified physicians for remote care."
        }
      ],
      "employee": [
        {
          "@type": "Physician",
          "name": "Dr. Sara Khan",
          "jobTitle": "Director of Cardiovascular Health",
          "medicalSpecialty": "Cardiovascular",
          "description": "MD, FACC. Specializes in preventive cardiology, hypertension, and advanced heart health.",
          "worksFor": { "@id": `${siteConfig.url}/#organization` }
        },
        {
          "@type": "Physician",
          "name": "Dr. Marcus Vance",
          "jobTitle": "Lead Family Physician",
          "medicalSpecialty": "PrimaryCare",
          "description": "MD, Board-Certified Family Physician focusing on adolescent and adult family medicine.",
          "worksFor": { "@id": `${siteConfig.url}/#organization` }
        },
        {
          "@type": "Physician",
          "name": "Dr. Elena Rostova",
          "jobTitle": "Internal Medicine Specialist",
          "medicalSpecialty": "InternalMedicine",
          "description": "MD. Focuses on endocrine balance, complex diagnostics, and chronic care navigation.",
          "worksFor": { "@id": `${siteConfig.url}/#organization` }
        },
        {
          "@type": "Physician",
          "name": "Dr. David Chen",
          "jobTitle": "Director of Pediatric Care",
          "medicalSpecialty": "Pediatrics",
          "description": "MD, FAAP. Dedicated to compassionate pediatric wellness, milestones, and acute pediatric triage.",
          "worksFor": { "@id": `${siteConfig.url}/#organization` }
        },
        {
          "@type": "Physician",
          "name": "Dr. Amira Patel",
          "jobTitle": "Senior Neurologist",
          "medicalSpecialty": "Neurology",
          "description": "MD, PhD. Expertise in migraine therapeutics, neuromuscular evaluations, and cognitive longevity.",
          "worksFor": { "@id": `${siteConfig.url}/#organization` }
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      "url": siteConfig.url,
      "name": "CarePoint Clinic",
      "description": "Accessible, compassionate, personalised outpatient healthcare with verified specialists.",
      "publisher": {
        "@id": `${siteConfig.url}/#organization`
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", outfit.variable)}>
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground antialiased selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300">
        <script
          id="schema-structured-data"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider>
            {/* Skip to content link for a11y */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] bg-teal-600 text-white px-4 py-2 rounded-md font-medium outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
            >
              Skip to content
            </a>
            
            {children}
            
            <FeaturesOverlay />
            <CookieConsent />
            <Suspense fallback={null}>
              <UtmTracker />
            </Suspense>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
