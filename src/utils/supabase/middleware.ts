import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { env } from '@/config/env'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    env.supabase.url,
    env.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const path = url.pathname

  // Public routes that unauthenticated users can access
  const publicRoutes = ['/', '/features', '/how-it-works', '/about', '/contact', '/login', '/signup', '/forgot-password', '/privacy', '/terms']
  
  // Routes that are strictly protected
  const protectedRoutes = ['/dashboard', '/patient', '/doctor', '/admin', '/settings', '/profile', '/records']

  const isPublicRoute = publicRoutes.includes(path) || path.startsWith('/receipt/')
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  if (user) {
    // Fetch profile role once for authenticated redirects/protections
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()

    const role = profile?.role || 'patient'

    // If authenticated user visits login or signup, route them to their role-specific dashboard
    if (path === '/login' || path === '/signup') {
      if (role === 'admin' || role === 'staff') {
        url.pathname = '/admin/dashboard'
      } else if (role === 'doctor') {
        const { data: doctor } = await supabase
          .from('doctors')
          .select('status')
          .eq('profile_id', user.id)
          .maybeSingle()

        url.pathname = doctor?.status === 'approved' ? '/doctor/dashboard' : '/doctor/application-status'
      } else {
        url.pathname = '/patient/dashboard'
      }
      return NextResponse.redirect(url)
    }

    // Role-based protection: /admin/*
    if (path.startsWith('/admin')) {
      if (role !== 'admin' && role !== 'staff') {
        url.pathname = role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'
        return NextResponse.redirect(url)
      }
    }

    // Role-based protection: /doctor/dashboard
    if (path.startsWith('/doctor/dashboard')) {
      if (role !== 'doctor') {
        url.pathname = role === 'admin' || role === 'staff' ? '/admin/dashboard' : '/patient/dashboard'
        return NextResponse.redirect(url)
      }

      // Check if approved
      const { data: doctor } = await supabase
        .from('doctors')
        .select('status')
        .eq('profile_id', user.id)
        .maybeSingle()

      if (doctor?.status !== 'approved') {
        url.pathname = '/doctor/application-status'
        return NextResponse.redirect(url)
      }
    }
  } else {
    // Unauthenticated user
    if (isProtectedRoute || (!isPublicRoute && path !== '/appointments/new' && !path.startsWith('/api') && path !== '/departments' && path !== '/showcase')) {
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
