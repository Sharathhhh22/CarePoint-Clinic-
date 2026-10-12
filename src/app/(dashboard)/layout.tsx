"use client"

import { useState, useEffect } from "react"
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDoctor, setIsDoctor] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
  }, [])

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
        }
      }
    }
    checkRole()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/appointments", label: "Appointments", icon: CalendarCheck },
    { href: "/records", label: "Medical Records", icon: User },
    ...(isDoctor ? [{ href: "/doctor", label: "Doctor Portal", icon: Stethoscope }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin Panel", icon: Settings }] : []),
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background flex transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-surface border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-foreground">
              SlotUrSelf
            </span>
          </Link>
          <button 
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg nav-text text-sm transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2.5 w-full rounded-lg nav-text text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
          >
            <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-border flex items-center px-4 lg:px-8 shrink-0 sticky top-0 z-30 justify-between gap-4 transition-colors">
          <div className="flex items-center flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 mr-4 text-muted-foreground hover:text-foreground rounded-lg hover:bg-surface-elevated lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search clinics, doctors, conditions..." 
                className="w-full h-9 pl-9 pr-4 rounded-md border border-border bg-input-bg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle Dark Mode"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {!isAdmin && !isDoctor && (
              <Link 
                href="/appointments/new"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary hover:bg-primary-hover px-4 md:px-5 text-sm font-medium text-primary-foreground transition-colors shadow-sm whitespace-nowrap"
              >
                Book Appointment
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
