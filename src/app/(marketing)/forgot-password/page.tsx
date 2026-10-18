import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ForgotPasswordClient } from "./ForgotPasswordClient"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your CarePoint Clinic account password securely via email verification.",
  alternates: {
    canonical: "/forgot-password",
  },
  openGraph: {
    title: "Reset Password",
    description: "Reset your CarePoint Clinic account password securely via email verification.",
    url: "/forgot-password",
  },
}

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md space-y-6">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Login
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we will send you a secure link to reset your account password.
          </p>
        </div>

        <ForgotPasswordClient />
      </div>
    </div>
  )
}
