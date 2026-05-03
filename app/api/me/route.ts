import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session || !session.user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.name,
        // Map other fields as needed
        is_premium: false, // Default for now
        premium_expires_at: null,
      },
    })
  } catch (error) {
    console.error('[API /me] Error', error)
    return NextResponse.json({ user: null })
  }
}
