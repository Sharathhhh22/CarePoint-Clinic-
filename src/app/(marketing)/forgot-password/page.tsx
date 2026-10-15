import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ForgotPasswordClient } from "./ForgotPasswordClient"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your SlotUrSelf account password securely via email verification.",
  alternates: {
    canonical: "/forgot-password",
  },
  openGraph: {
    title: "Reset Password",
    description: "Reset your SlotUrSelf account password securely via email verification.",
    url: "/forgot-password",
  },
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-background text-foreground flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Login
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-foreground text-center">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Enter your email address and we will send you a secure link to reset your account password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <ForgotPasswordClient />
      </div>
    </div>
  )
}
