import type { Metadata } from "next"
import { Bot, ShieldAlert } from "lucide-react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { AssistantClient } from "./AssistantClient"

export const metadata: Metadata = {
  title: "AI Symptom Checker & Medical Guide | SlotUrSelf",
  description: "Describe your symptoms in plain language to receive automated clinical triage guidance and specialist recommendations on SlotUrSelf.",
  alternates: {
    canonical: "/assistant",
  },
  openGraph: {
    title: "AI Symptom Checker & Medical Guide | SlotUrSelf",
    description: "Describe your symptoms in plain language to receive automated clinical triage guidance and specialist recommendations on SlotUrSelf.",
    url: "/assistant",
  },
}

export default function AssistantPage() {
  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <div className="max-w-[1000px] mx-auto px-6 md:px-12">
        <Breadcrumbs items={[{ label: "AI Symptom Guide" }]} className="mb-8" />

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
            <Bot className="w-3.5 h-3.5" />
            Clinical AI Triage
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            AI Symptom Checker & Guide
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Describe how you are feeling in plain language. Our clinical reasoning engine evaluates urgency and recommends the right department.
          </p>
        </div>

        {/* Emergency Disclaimer */}
        <div className="mb-10 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Important Medical Disclaimer:</strong> This tool provides preliminary clinical navigation, not a definitive medical diagnosis. If you are experiencing chest pain, acute shortness of breath, severe bleeding, or sudden paralysis, dial emergency services (108) immediately.
          </div>
        </div>

        <AssistantClient />
      </div>
    </div>
  )
}
