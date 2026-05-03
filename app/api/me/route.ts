import { createServersideClient as createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
        is_premium: user.user_metadata?.is_premium || false,
      },
    })
  } catch (error) {
    console.error('[API /me] Error', error)
    return NextResponse.json({ user: null })
  }
}
