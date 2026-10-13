import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { FeaturesOverlay } from "@/components/layout/FeaturesOverlay";
import { ThemeProvider } from "@/components/ThemeProvider";
import { siteConfig } from "@/config/site";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
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
      { url: "/icon" }
    ],
    apple: "/icon",
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
      "description": "Enterprise healthcare booking platform connecting patients directly with verified clinical specialists.",
      "telephone": siteConfig.contact.phone,
      "emergencyTelephone": siteConfig.contact.emergencyPhone,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Health Tech Blvd, Suite 400",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "postalCode": "94107",
        "addressCountry": "US"
      },
      "medicalSpecialty": [
        "Cardiovascular",
        "Neurology",
        "Orthopedics",
        "Ophthalmology",
        "Dentistry",
        "PrimaryCare"
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (storedTheme === 'dark' || (!storedTheme && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Skip to content link for a11y */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] bg-teal-600 text-white px-4 py-2 rounded-md font-medium outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
          >
            Skip to content
          </a>
          
          {children}
          
          <FeaturesOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
