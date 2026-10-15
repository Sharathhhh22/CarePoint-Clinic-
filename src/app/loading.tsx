import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-full min-h-[50vh] w-full flex items-center justify-center bg-background text-foreground" role="status" aria-live="polite">
      <Loader2 className="h-8 w-8 text-primary animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading page content...</span>
    </div>
  )
}
