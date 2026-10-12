import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-full min-h-[60vh] w-full flex flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground font-medium animate-pulse">Loading...</p>
    </div>
  )
}
