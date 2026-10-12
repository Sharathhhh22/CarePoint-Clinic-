"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, Search, Moon, Sun } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useTheme } from "next-themes"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/assistant", label: "AI Guide" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/departments", label: "Specialists" },
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
  const [mounted, setMounted] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  const supabase = createClient()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/departments?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsMobileMenuOpen(false)
    }
  }

  const navClasses = `sticky top-0 z-50 w-full transition-all duration-300 ${
    isScrolled || isMobileMenuOpen 
      ? "bg-surface/95 backdrop-blur-md border-b border-border shadow-sm" 
      : "bg-transparent border-b border-transparent"
  }`

  return (
    <>
      <header className={navClasses}>
        <div className="mx-auto flex h-[72px] md:h-[84px] max-w-[1400px] items-center justify-between px-6 md:px-12">
          
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-bold tracking-tight text-foreground transition-opacity duration-200 group-hover:opacity-80">
              SlotUrSelf
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
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

          <div className="hidden md:flex items-center gap-4">
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

          <div className="flex items-center gap-2 md:hidden">
            <button 
              className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-surface-elevated" 
              aria-label="Toggle Dark Mode" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              className="p-2 rounded-md text-foreground hover:bg-surface-elevated"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden fixed top-[72px] inset-x-0 z-40 bg-surface border-b border-border shadow-xl overflow-y-auto max-h-[calc(100vh-72px)]"
          >
            <div className="flex flex-col px-6 py-6 space-y-5">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search specialists..." 
                  className="h-10 w-full bg-input-bg border border-border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </form>

              <div className="flex flex-col space-y-3 py-2 border-y border-border">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-base py-2 font-medium transition-colors ${
                        isActive 
                          ? "text-primary font-semibold" 
                          : "text-foreground"
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
                    className="inline-flex items-center justify-center w-full h-11 rounded-md bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary-hover transition-colors"
                  >
                    Go to Patient Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center w-full h-11 rounded-md border border-border text-foreground font-medium hover:bg-surface-elevated transition-colors"
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center w-full h-11 rounded-md bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary-hover transition-colors"
                    >
                      Create Free Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
