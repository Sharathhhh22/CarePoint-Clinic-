"use client"

import * as React from "react"
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react"

export type ToastVariant = "default" | "success" | "destructive" | "warning" | "info"

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastContextType {
  toasts: ToastItem[]
  toast: (options: Omit<ToastItem, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

// Global reference for calling toast outside components if needed
let globalToast: ((options: Omit<ToastItem, "id">) => void) | null = null

export function toast(options: Omit<ToastItem, "id">) {
  if (globalToast) {
    globalToast(options)
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = React.useCallback(
    ({ title, description, variant = "default", duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastItem = { id, title, description, variant, duration }
      
      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id)
        }, duration)
      }
    },
    [dismiss]
  )

  React.useEffect(() => {
    globalToast = addToast
    return () => {
      globalToast = null
    }
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, toast: addToast, dismiss }}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-[9999] flex max-h-screen w-full max-w-sm flex-col-reverse gap-2 pointer-events-none p-4 sm:p-0"
    >
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onDismiss={() => onDismiss(item.id)} />
      ))}
    </div>
  )
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const icons: Record<ToastVariant, React.ReactNode> = {
    default: <Info className="h-5 w-5 text-primary shrink-0" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    destructive: <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-500 shrink-0" />,
  }

  const borderStyles: Record<ToastVariant, string> = {
    default: "border-border bg-surface text-foreground",
    success: "border-emerald-500/30 bg-surface text-foreground shadow-emerald-500/5",
    destructive: "border-rose-500/30 bg-surface text-foreground shadow-rose-500/5",
    warning: "border-amber-500/30 bg-surface text-foreground",
    info: "border-sky-500/30 bg-surface text-foreground",
  }

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
        borderStyles[item.variant || "default"]
      }`}
    >
      {icons[item.variant || "default"]}
      <div className="flex-1 space-y-0.5">
        <p className="text-sm font-semibold">{item.title}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
