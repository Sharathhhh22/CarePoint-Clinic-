import type { Metadata } from "next"
import { SignupClient } from "./SignupClient"

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
    <div className="container mx-auto flex min-h-[85vh] flex-col items-center justify-center p-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Create an Account</h1>
        <p className="mt-2 text-muted-foreground">Join SlotUrSelf to manage your appointments and digital health records</p>
      </div>

      <div className="w-full max-w-md">
        <SignupClient />
      </div>
    </div>
  )
}
