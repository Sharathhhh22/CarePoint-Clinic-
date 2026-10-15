"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, Search, Moon, Sun, Activity } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useTheme } from "next-themes"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/clinics", label: "Clinics" },
  { href: "/departments", label: "Specialists" },
  { href: "/assistant", label: "AI Guide" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const supabase = createClient()

  React.useEffect(() => {
    async function getUser() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    }
    getUser()
  }, [supabase])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    React.startTransition(() => {
      setIsMobileMenuOpen(false)
    })
  }, [pathname])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false)
      }
    }
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMobileMenuOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/departments?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsMobileMenuOpen(false)
    }
  }

  const navClasses = "sticky top-0 z-50 w-full bg-surface border-b border-border shadow-xs"

  return (
    <>
      <header className={navClasses}>
        <div className="mx-auto flex h-[72px] md:h-[84px] max-w-[1440px] items-center justify-between px-6 md:px-12">
          
          {/* Left Brand + Divider + Navigation Links with generous spacing */}
          <div className="flex items-center gap-6 xl:gap-8 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-xs group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                SlotUrSelf
              </span>
            </Link>

            <div className="hidden lg:block h-5 w-px bg-border/80 shrink-0" aria-hidden="true" />

            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 shrink-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors ${
                      isActive 
                        ? "text-primary font-semibold" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specialists..." 
                className="h-9 w-44 lg:w-52 bg-input-bg border border-border rounded-md pl-8 pr-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground shadow-sm"
              />
            </form>
            
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors w-9 h-9 flex items-center justify-center rounded-md hover:bg-surface-elevated" 
              aria-label="Toggle Dark Mode" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <Link 
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary hover:bg-primary-hover px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors"
              >
                <User className="w-3.5 h-3.5 mr-2" />
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-2 py-1"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary hover:bg-primary-hover px-4 text-sm font-medium text-primary-foreground transition-colors shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button 
              className="text-muted-foreground hover:text-foreground w-11 h-11 flex items-center justify-center rounded-lg hover:bg-surface-elevated transition-colors" 
              aria-label="Toggle Dark Mode" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              className="w-11 h-11 flex items-center justify-center rounded-lg text-foreground hover:bg-surface-elevated transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU BACKDROP & DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60"
              aria-hidden="true"
            />
            <motion.div
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="lg:hidden fixed top-[72px] md:top-[84px] inset-x-0 z-50 bg-surface border-b border-border shadow-2xl overflow-y-auto max-h-[calc(100dvh-72px)] pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
            >
              <div className="flex flex-col px-5 py-5 space-y-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search specialists, clinics..." 
                    className="h-11 w-full bg-input-bg border border-border rounded-xl pl-10 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground shadow-xs"
                  />
                </form>

                <div className="flex flex-col divide-y divide-border/60 py-1">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`min-h-[44px] flex items-center px-2 py-3 text-base font-medium rounded-lg transition-colors ${
                          isActive 
                            ? "text-primary font-semibold bg-primary/10" 
                            : "text-foreground hover:bg-surface-elevated"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  {user ? (
                    <Link 
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="min-h-[44px] inline-flex items-center justify-center w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary-hover active:scale-[0.99] transition-all"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link 
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="min-h-[44px] inline-flex items-center justify-center w-full rounded-xl border border-border text-foreground font-semibold hover:bg-surface-elevated active:scale-[0.99] transition-all"
                      >
                        Log In
                      </Link>
                      <Link 
                        href="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="min-h-[44px] inline-flex items-center justify-center w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary-hover active:scale-[0.99] transition-all"
                      >
                        Create Free Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
