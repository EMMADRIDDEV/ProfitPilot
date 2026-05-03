import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/get-access-code', '/verify-email', '/']

  // Check if current path is public
  const isPublicRoute = publicRoutes.includes(pathname)

  // Get Better Auth session cookie from headers
  const authCookie = request.cookies.get('better-auth.session_token')?.value || 
                     request.cookies.get('session_token')?.value // Fallback for transition

  // If trying to access dashboard routes without session, redirect to login
  if (pathname.startsWith('/dashboard') && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access login/register with valid session, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && authCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

