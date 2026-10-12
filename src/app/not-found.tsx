import Link from "next/link"
import { ArrowLeft, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-6 h-6" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Page Not Found
        </h2>
        
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          The page or clinic record you are looking for does not exist or has been moved.
        </p>

        <Button
          asChild
          className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Homepage
          </Link>
        </Button>
      </div>
    </div>
  )
}
