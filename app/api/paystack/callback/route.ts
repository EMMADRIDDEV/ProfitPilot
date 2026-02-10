import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const reference = url.searchParams.get('reference')

  if (!reference) {
    return NextResponse.json({ success: false, error: 'No reference provided' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY || ''}`,
      },
    })

    const data = await res.json()
    if (!data || !data.status) {
      console.error('[Paystack] verify failed', data)
      return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 400 })
    }

    const email = data.data.customer.email
    const amount = data.data.amount // in kobo

    // mark user as premium in DB
    const supabase = await createClient()
    const { data: user } = await supabase.from('users').select('id, email').eq('email', email).maybeSingle()

    if (user) {
      // set premium for 30 days (monthly)
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      await supabase.from('users').update({ is_premium: true, premium_expires_at: expiresAt }).eq('id', user.id)
    }

    // redirect to dashboard with success
    return NextResponse.redirect(new URL('/dashboard', process.env.FRONTEND_URL || 'http://localhost:3000'))
  } catch (error) {
    console.error('[Paystack] callback error', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
