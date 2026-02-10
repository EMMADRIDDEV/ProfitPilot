import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Get user session from cookies
  const userId = request.cookies.get('user_id')?.value
  
  // List of protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/payment/success']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  
  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !userId) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  // If logged in and trying to access login/payment pages, redirect to dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname.startsWith('/payment')) && userId) {
    // Check if payment is being processed
    if (!request.nextUrl.pathname.includes('/payment/success') && request.nextUrl.pathname.startsWith('/payment')) {
      // Allow payment pages while logged in
      return NextResponse.next()
    }
  }
  
  return NextResponse.next()
}
