import type { Metadata } from "next"
import { SignupClient } from "./SignupClient"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Register for SlotUrSelf to manage your medical appointments, access digital passes, and connect with top doctors.",
  alternates: {
    canonical: "/signup",
  },
  openGraph: {
    title: "Create Account",
    description: "Register for SlotUrSelf to manage your medical appointments, access digital passes, and connect with top doctors.",
    url: "/signup",
  },
}

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center items-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="w-full max-w-4xl mx-auto">
        <SignupClient />
      </div>
    </div>
  )
}
