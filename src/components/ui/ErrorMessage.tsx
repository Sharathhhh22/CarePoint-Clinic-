import React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "./Button"

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  className = "",
}: ErrorMessageProps) {
  return (
    <div className={`rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 p-4 text-rose-900 dark:text-rose-200 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm">
          <h4 className="font-semibold text-rose-950 dark:text-rose-100">{title}</h4>
          <p className="mt-1 text-rose-800/90 dark:text-rose-300/90">{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
