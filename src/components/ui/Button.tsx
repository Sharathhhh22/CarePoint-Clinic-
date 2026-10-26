import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "default"
  | "destructive"
  | "link"

export type ButtonSize = "sm" | "md" | "lg" | "default" | "icon"

export interface ButtonVariantsArgs {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}

export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonVariantsArgs = {}): string {
  // Normalize default alias
  const resolvedVariant = variant === "default" ? "primary" : variant
  const resolvedSize = size === "default" ? "md" : size

  return cn(
    "inline-flex items-center justify-center gap-2 min-h-11 px-5 py-3 whitespace-nowrap rounded-[var(--radius)] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
    // Variant mapping
    {
      "bg-primary text-primary-foreground hover:bg-primary-hover active:scale-[0.99] shadow-sm":
        resolvedVariant === "primary",
      "bg-muted text-foreground hover:bg-muted/80 active:scale-[0.99]":
        resolvedVariant === "secondary",
      "border border-border bg-transparent text-foreground hover:bg-muted/60 active:scale-[0.99]":
        resolvedVariant === "outline",
      "text-foreground hover:bg-muted/50 active:scale-[0.99]":
        resolvedVariant === "ghost",
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm":
        resolvedVariant === "destructive",
      "text-primary underline-offset-4 hover:underline min-h-0 h-auto p-0":
        resolvedVariant === "link",
    },
    // Size mapping (all interactive buttons guarantee min-h-11 = 44px for WCAG 2.5.8)
    {
      "min-h-11 px-4 py-2 text-xs": resolvedSize === "sm",
      "min-h-11 px-5 py-3 text-sm": resolvedSize === "md",
      "min-h-12 px-7 py-3.5 text-base": resolvedSize === "lg",
      "min-h-11 min-w-[44px] h-11 w-11 p-0": resolvedSize === "icon",
    },
    fullWidth && "w-full",
    className
  )
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Responsive button group wrapper.
 * Stacks buttons vertically on mobile (w-full) and aligns them horizontally on tablet/desktop.
 */
export function ButtonGroup({
  className,
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
