import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-paystack-signature') || ''
  const body = await req.text()

  const secret = process.env.PAYSTACK_SECRET_KEY || ''
  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex')

  if (hash !== signature) {
    console.error('[Paystack] invalid signature')
    return NextResponse.json({ success: false }, { status: 400 })
  }

  try {
    const payload = JSON.parse(body)
    const event = payload.event

    // handle charge.success or subscription events
    if (event === 'charge.success' || event === 'subscription.create') {
      const email = payload.data.customer.email
      const supabase = await createClient()
      const { data: user } = await supabase.from('users').select('id').eq('email', email).maybeSingle()
      if (user) {
        // set premium for 30 days
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        await supabase.from('users').update({ is_premium: true, premium_expires_at: expiresAt }).eq('id', user.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Paystack] webhook error', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
