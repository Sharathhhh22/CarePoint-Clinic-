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
    default: "SlotUrSelf | Book Doctors Instantly",
    template: "%s | SlotUrSelf",
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
    "SlotUrSelf",
    "healthcare specialists",
    "AI medical triage",
    "online doctor booking",
    "verified doctors",
    "outpatient scheduling",
    "digital clinic pass"
  ],
  openGraph: {
    title: "SlotUrSelf | Book Doctors Instantly",
    description: "Book verified specialists and real-time appointment slots in under 60 seconds.",
    url: siteConfig.url,
    siteName: "SlotUrSelf",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SlotUrSelf - Skip the waiting room. Book doctors instantly.",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SlotUrSelf | Book Doctors Instantly",
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
      "@type": "MedicalBusiness",
      "@id": `${siteConfig.url}/#organization`,
      "name": "SlotUrSelf",
      "url": siteConfig.url,
      "logo": `${siteConfig.url}/icon`,
      "image": `${siteConfig.url}/opengraph-image`,
      "description": "Enterprise healthcare booking platform connecting patients directly with verified clinical specialists across Bengaluru.",
      "telephone": siteConfig.contact.phone,
      "emergencyTelephone": siteConfig.contact.emergencyPhone,
      "priceRange": "₹₹",
      "currenciesAccepted": "INR",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "100 Feet Road, Indiranagar",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560038",
        "addressCountry": "IN"
      },
      "medicalSpecialty": [
        "Cardiovascular",
        "Neurology",
        "Orthopedics",
        "Dermatology",
        "Pediatrics",
        "PrimaryCare",
        "Dentistry"
      ],
      "availableService": {
        "@type": "MedicalProcedure",
        "name": "Clinical Specialist Appointment Booking",
        "procedureType": "NoninvasiveProcedure"
      }
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      "url": siteConfig.url,
      "name": "SlotUrSelf",
      "description": "Book doctors instantly with zero wait times.",
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
