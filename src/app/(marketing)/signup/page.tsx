import type { Metadata } from "next"
import { Suspense } from "react"
import { SignupClient } from "./SignupClient"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Create Account | SlotUrSelf",
  description: "Register for SlotUrSelf to manage your medical appointments, access digital passes, and connect with top doctors.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Create Account | SlotUrSelf",
    description: "Register for SlotUrSelf to manage your medical appointments, access digital passes, and connect with top doctors.",
    url: "/signup",
  },
}

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-[85vh] flex-col items-center justify-center p-4 md:p-6 py-12">
      <Suspense 
        fallback={
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }
      >
        <SignupClient />
      </Suspense>
    </div>
  )
}
