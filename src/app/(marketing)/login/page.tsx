import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginClient } from "./LoginClient"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your SlotUrSelf patient portal to view upcoming appointments, health records, and digital passes.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Log In",
    description: "Log in to your SlotUrSelf patient portal to view upcoming appointments, health records, and digital passes.",
    url: "/login",
  },
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center items-center py-10 sm:py-14 lg:py-16 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto">
        <Suspense fallback={
          <div className="flex h-64 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <LoginClient />
        </Suspense>
      </div>
    </div>
  )
}
