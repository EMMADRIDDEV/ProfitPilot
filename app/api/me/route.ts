import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const cookieHeader = req.headers.get('cookie') || ''
    // Attempt to find user_id from cookies
    const match = cookieHeader.match(/user_id=([^;]+)/)
    const userId = match ? decodeURIComponent(match[1]) : null

    if (!userId) {
      return NextResponse.json({ user: null })
    }

    const { data: user } = await supabase.from('users').select('id, email, full_name, is_premium, premium_expires_at').eq('id', userId).maybeSingle()
    return NextResponse.json({ user: user || null })
  } catch (error) {
    console.error('[API /me] Error', error)
    return NextResponse.json({ user: null })
  }
}
