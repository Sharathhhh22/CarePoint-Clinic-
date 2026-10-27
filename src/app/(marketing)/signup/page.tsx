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
  return <SignupClient />
}
