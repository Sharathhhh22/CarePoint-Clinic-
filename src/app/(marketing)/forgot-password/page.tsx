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
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center items-center py-10 sm:py-14 lg:py-16 px-4 sm:px-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Login
        </Link>

        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
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
