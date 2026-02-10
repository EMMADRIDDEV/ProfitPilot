import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Build Google OAuth2 authorization URL and redirect the user
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/auth/callback/google`
  const scope = encodeURIComponent('openid email profile')
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId || ''
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`

  return NextResponse.redirect(authUrl)
}
