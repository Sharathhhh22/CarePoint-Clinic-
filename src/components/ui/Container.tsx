import React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

/**
 * Unified responsive container component.
 * Standardized across the entire application: mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8.
 */
export function Container({
  className,
  as: Component = "div",
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </Component>
  )
}
