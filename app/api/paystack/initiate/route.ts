import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userEmail = body.email

    if (!userEmail) {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 })
    }

    const amount = 9999 * 100 // paystack expects amount in kobo

    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        amount,
        currency: 'NGN',
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/paystack/callback`,
        metadata: {
          product: 'ProfitPilot Premium Monthly',
        },
      }),
    })

    const data = await res.json()
    if (!data || !data.status) {
      return NextResponse.json({ success: false, error: data?.message || 'Failed to initialize payment' }, { status: 500 })
    }

    // return authorization url to client
    return NextResponse.json({ success: true, authorization_url: data.data.authorization_url, reference: data.data.reference })
  } catch (error) {
    console.error('[Paystack] initiate error', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
