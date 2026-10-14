"use client"

import { useState, useEffect, useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  CalendarCheck,
  Sun,
  Moon
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useTheme } from "next-themes"

const emptySubscribe = () => () => {}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDoctor, setIsDoctor] = useState(false)
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
        if (data?.role === 'admin' || data?.role === 'staff') {
          setIsAdmin(true)
        }
        if (data?.role === 'doctor') {
          setIsDoctor(true)
        } else {
          // Check if user has an associated doctor application
          const { data: doc } = await supabase.from('doctors').select('id').eq('profile_id', user.id).maybeSingle()
          if (doc) {
            setIsDoctor(true)
          }
        }
      }
    }
    checkRole()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false)
      }
    }
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSidebarOpen])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/appointments", label: "Appointments", icon: CalendarCheck },
    { href: "/records", label: "Medical Records", icon: User },
    { href: "/doctor", label: "Doctor Portal", icon: Stethoscope },
    ...(isAdmin ? [{ href: "/admin", label: "Admin Panel", icon: Settings }] : []),
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  // Quick items for bottom navigation on mobile/tablet
  const mobileBottomItems = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/appointments", label: "Slots", icon: CalendarCheck },
    { href: "/appointments/new", label: "Book", icon: CalendarCheck, isAction: true },
    { href: isDoctor ? "/doctor" : "/records", label: isDoctor ? "Doctor" : "Records", icon: isDoctor ? Stethoscope : User },
  ]

  return (
    <div className="min-h-screen bg-background flex transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop sticky / Mobile slide-over) */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 sm:w-64 bg-surface border-r border-border transform transition-transform duration-250 ease-in-out lg:translate-x-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <Link href="/dashboard" className="flex items-center space-x-2" onClick={() => setIsSidebarOpen(false)}>
            <span className="text-xl font-bold tracking-tight text-foreground">
              SlotUrSelf
            </span>
          </Link>
          <button 
            className="lg:hidden w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-elevated transition-colors"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`min-h-[44px] flex items-center space-x-3 px-3 py-2.5 rounded-xl nav-text text-sm transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          <button
            onClick={handleLogout}
            className="min-h-[44px] flex items-center space-x-3 px-3 py-2.5 w-full rounded-xl nav-text text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
          >
            <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-border flex items-center px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-30 justify-between gap-3 transition-colors">
          <div className="flex items-center flex-1 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-elevated lg:hidden shrink-0 mr-2"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search clinics, doctors..." 
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-input-bg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <Link href="/dashboard" className="sm:hidden font-bold text-foreground text-lg truncate">
              SlotUrSelf
            </Link>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-elevated transition-colors"
              aria-label="Toggle Dark Mode"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {!isAdmin && !isDoctor && (
              <Link 
                href="/appointments/new"
                className="hidden sm:inline-flex min-h-[40px] items-center justify-center rounded-xl bg-primary hover:bg-primary-hover px-4 md:px-5 text-sm font-semibold text-primary-foreground transition-all shadow-sm active:scale-[0.99] whitespace-nowrap"
              >
                Book Appointment
              </Link>
            )}
          </div>
        </header>

        {/* Content body with responsive padding and mobile bottom-bar buffer */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 lg:pb-8 max-w-full">
          {children}
        </main>

        {/* Mobile / Tablet Bottom Navigation Bar */}
        <nav 
          aria-label="Mobile Navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 pt-1.5 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] shadow-lg"
        >
          {mobileBottomItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))

            if (item.isAction) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center justify-center px-2 py-1 -mt-4 group"
                  aria-label="Book new appointment"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-active:scale-95 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-primary mt-1">Book</span>
                </Link>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`min-h-[44px] min-w-[56px] flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-[11px] mt-1 truncate">{item.label}</span>
              </Link>
            )
          })}

          <button
            onClick={() => setIsSidebarOpen(true)}
            className="min-h-[44px] min-w-[56px] flex flex-col items-center justify-center py-1 px-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open more menu options"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
            <span className="text-[11px] mt-1">More</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
