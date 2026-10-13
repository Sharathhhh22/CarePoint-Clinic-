import type { Metadata } from "next"
import { LoginClient } from "./LoginClient"

export const metadata: Metadata = {
  title: "Log In | SlotUrSelf",
  description: "Log in to your SlotUrSelf patient portal to view upcoming appointments, health records, and digital passes.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Log In | SlotUrSelf",
    description: "Log in to your SlotUrSelf patient portal to view upcoming appointments, health records, and digital passes.",
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
        <LoginClient />
      </div>
    </div>
  )
}
