import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginClient } from "./LoginClient"
import { Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Patient & Clinician Portal Log In | CarePoint Clinic",
  description: "Log in to your CarePoint Clinic patient portal to view scheduled visits, verified health records, and clinical passes.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Patient & Clinician Portal Log In | CarePoint Clinic",
    description: "Log in to your CarePoint Clinic patient portal to view scheduled visits, verified health records, and clinical passes.",
    url: "/login",
  },
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center p-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Welcome Back</h1>
        <p className="mt-2 text-muted-foreground">Log in to access your appointments and health records</p>
      </div>

      <div className="w-full max-w-md">
        <Suspense 
          fallback={
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <LoginClient />
        </Suspense>
      </div>
    </div>
  )
}
