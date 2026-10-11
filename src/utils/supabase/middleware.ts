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
  const protectedRoutes = ['/dashboard', '/settings', '/profile', '/admin', '/patients']

  const isPublicRoute = publicRoutes.includes(path) || path.startsWith('/receipt/')
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  if (user) {
    // Authenticated user
    if (path === '/' || path === '/login' || path === '/signup') {
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
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
