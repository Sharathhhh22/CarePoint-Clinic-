"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

interface CarePointThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function CarePointThemeToggle({ className = "", showLabel = false }: CarePointThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div 
        className={`w-10 h-10 rounded-full border border-transparent bg-transparent ${className}`}
        aria-hidden="true"
      />
    )
  }

  const isDark = resolvedTheme === "dark" || theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-full flex items-center justify-center text-[#101512] dark:text-[#EAEFEA] hover:bg-[#E7EEE8] dark:hover:bg-[#1E2E25] border border-transparent hover:border-[#E0E4DF] dark:hover:border-[#2D4235] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173F30] dark:focus-visible:ring-[#A9C2B2] ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#A9C2B2] transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#173F30] transition-transform duration-200 rotate-0 hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  )
}
