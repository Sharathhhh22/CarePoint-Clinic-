"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Unable to load dashboard data
        </h2>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {error.message || "We could not load your clinic records. This may be due to a temporary connection hiccup."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload View
          </Button>
          
          <Button
            variant="outline"
            asChild
            className="border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
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
