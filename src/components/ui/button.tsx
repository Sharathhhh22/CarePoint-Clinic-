import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(
          "btn-text inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none",
          {
            "bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm": variant === "default",
            "border border-border bg-card text-foreground hover:bg-surface-elevated hover:text-foreground shadow-xs": variant === "outline",
            "text-foreground hover:bg-surface-elevated hover:text-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm": variant === "destructive",
            "min-h-[44px] px-5 py-2.5 text-sm": size === "default",
            "min-h-[36px] h-9 px-3 text-xs gap-1.5": size === "sm",
            "min-h-[48px] h-12 px-7 text-base gap-2.5": size === "lg",
            "min-h-[44px] min-w-[44px] h-11 w-11 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
