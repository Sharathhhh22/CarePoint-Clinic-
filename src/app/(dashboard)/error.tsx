"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Dashboard Error]:", error)
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[500px]">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        
        <h2 className="text-xl font-bold text-foreground mb-2">
          Unable to load dashboard data
        </h2>
        
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {error.message || "We could not load your clinic records. This may be due to a temporary connection hiccup."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload View
          </Button>
          
          <Button
            variant="outline"
            asChild
            className="border-border text-foreground hover:bg-muted"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Reset Portal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
