import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import { cn } from "@/lib/utils";
import { FeaturesOverlay } from "@/components/layout/FeaturesOverlay";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: "SlotUrSelf | Book Doctors Instantly",
    template: "%s | SlotUrSelf",
  },
  description: "Book verified specialists and real-time appointment slots in under 60 seconds with SlotUrSelf. Zero waiting rooms, real-time doctor availability.",
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
    "verified doctors"
  ],
  openGraph: {
    title: "SlotUrSelf | Book Doctors Instantly",
    description: "Book verified specialists and real-time appointment slots in under 60 seconds.",
    url: "https://slot-yourself-7afv.vercel.app",
    siteName: "SlotUrSelf",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SlotUrSelf | Book Doctors Instantly",
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
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Skip to content link */}
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
