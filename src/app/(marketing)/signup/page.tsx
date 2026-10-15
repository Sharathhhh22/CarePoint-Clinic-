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

export default async function SignupPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string; redirect?: string }>
}) {
  const resolvedParams = searchParams ? await searchParams : undefined
  const initialType = resolvedParams?.type === "doctor" 
    ? "doctor" 
    : resolvedParams?.type === "patient" 
      ? "patient" 
      : null
  const redirectTarget = resolvedParams?.redirect

  return (
    <div className="container mx-auto flex min-h-[85vh] flex-col items-center justify-center p-4 md:p-6 py-12">
      <SignupClient initialType={initialType} redirectTarget={redirectTarget} />
    </div>
  )
}
