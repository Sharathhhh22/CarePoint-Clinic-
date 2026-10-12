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
      ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800" 
      : "bg-transparent border-b border-transparent"
  }`

  return (
    <>
      <header className={navClasses}>
        <div className="mx-auto flex h-[72px] md:h-[84px] max-w-[1400px] items-center justify-between px-6 md:px-12">
          
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-opacity duration-200 group-hover:opacity-75">
              APPOINTLY
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
                      ? "text-teal-600 dark:text-teal-400 font-semibold" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specialists..." 
                className="h-9 w-44 lg:w-52 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md pl-8 pr-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
              />
            </form>
            
            <button 
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors w-9 h-9 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" 
              aria-label="Toggle Dark Mode" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <Link 
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center rounded-md bg-teal-600 hover:bg-teal-700 px-4 text-sm font-medium text-white shadow-sm transition-colors"
              >
                <User className="w-3.5 h-3.5 mr-2" />
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login"
                  className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white px-2 py-1"
                >
                  Log In
                </Link>
                <Link 
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-teal-600 hover:bg-teal-700 px-4 text-sm font-medium text-white transition-colors shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button 
              className="text-slate-600 dark:text-slate-400 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" 
              aria-label="Toggle Dark Mode" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              className="p-2 rounded-md text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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
            className="md:hidden fixed top-[72px] inset-x-0 z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[calc(100vh-72px)]"
          >
            <div className="flex flex-col px-6 py-6 space-y-5">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search specialists..." 
                  className="h-10 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
              </form>

              <div className="flex flex-col space-y-3 py-2 border-y border-slate-100 dark:border-slate-800">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-base py-2 font-medium transition-colors ${
                        isActive 
                          ? "text-teal-600 dark:text-teal-400 font-semibold" 
                          : "text-slate-800 dark:text-slate-200"
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
                    className="inline-flex items-center justify-center w-full h-11 rounded-md bg-teal-600 text-white font-medium shadow-sm hover:bg-teal-700 transition-colors"
                  >
                    Go to Patient Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center w-full h-11 rounded-md border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center w-full h-11 rounded-md bg-teal-600 text-white font-medium shadow-sm hover:bg-teal-700 transition-colors"
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
