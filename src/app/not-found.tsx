import Link from "next/link"
import { ArrowLeft, Search, Stethoscope, Bot, Home, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "404 - Page Not Found",
  description: "The medical page or clinic record you requested could not be located.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-lg w-full bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-wider mb-6 border border-destructive/20">
          Error 404
        </div>
        
        {/* Strictly One H1 */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
          Page Not Found
        </h1>
        
        <p className="text-sm md:text-base text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
          The healthcare resource, clinic page, or appointment pass you requested could not be found. It may have moved or been rescheduled.
        </p>

        {/* Helpful Clinical Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <Link
            href="/departments"
            className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-primary/40 transition-colors flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Find Specialists</p>
              <p className="text-xs text-muted-foreground">Browse all departments</p>
            </div>
          </Link>

          <Link
            href="/assistant"
            className="p-3.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-primary/40 transition-colors flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">AI Symptom Guide</p>
              <p className="text-xs text-muted-foreground">Instant clinic routing</p>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-11 px-6"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Return to Homepage
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-border text-foreground hover:bg-muted h-11 px-6 font-medium"
          >
            <Link href="/contact">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
