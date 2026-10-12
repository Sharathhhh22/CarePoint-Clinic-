import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { FeaturesOverlay } from "@/components/layout/FeaturesOverlay";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "APPOINTLY | Book Doctors Instantly",
    template: "%s | APPOINTLY",
  },
  description: "Book verified specialists and real-time appointment slots in under 60 seconds with APPOINTLY. Zero waiting rooms, real-time doctor availability.",
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
    "healthcare specialists",
    "AI medical triage",
    "online doctor booking",
    "verified doctors"
  ],
  openGraph: {
    title: "APPOINTLY | Book Doctors Instantly",
    description: "Book verified specialists and real-time appointment slots in under 60 seconds.",
    url: "https://slot-yourself-7afv.vercel.app",
    siteName: "APPOINTLY",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "APPOINTLY | Book Doctors Instantly",
    description: "Book verified specialists and real-time appointment slots in under 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", outfit.variable)}>
      <body className={`min-h-screen bg-slate-50 antialiased dark:bg-slate-950 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* 12. skip to content ↓ */}
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
