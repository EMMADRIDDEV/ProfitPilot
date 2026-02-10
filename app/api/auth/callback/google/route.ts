// This is a placeholder for Google OAuth callback
// To implement, you'll need to:
// 1. Create OAuth app at https://console.cloud.google.com
// 2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env
// 3. Implement the full OAuth flow

import { NextRequest, NextResponse } from 'next/server'
import fetch from 'node-fetch'
import { loginWithGoogle } from '@/app/actions/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 })
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData || tokenData.error) {
      console.error('[GoogleOAuth] Token exchange error', tokenData)
      return NextResponse.json({ error: 'Failed to exchange token' }, { status: 400 })
    }

    const accessToken = tokenData.access_token

    // Fetch user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const userInfo = await userRes.json()

    if (!userInfo || !userInfo.email) {
      console.error('[GoogleOAuth] Failed to fetch user info', userInfo)
      return NextResponse.json({ error: 'Failed to fetch user info' }, { status: 400 })
    }

    // Create or login user via server action
    const result = await loginWithGoogle(userInfo.email, userInfo.name || userInfo.email, userInfo.id)

    // loginWithGoogle sets cookies; redirect to dashboard or setup
    const redirectUrl = result?.redirectUrl || '/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, process.env.FRONTEND_URL || 'http://localhost:3000'))
  } catch (error) {
    console.error('[GoogleOAuth] Error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
