import { NextRequest, NextResponse } from 'next/server'
import { resendVerificationCode } from '@/app/actions/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body
    if (!email) {
      return NextResponse.json({ success: false, error: 'Missing email' }, { status: 400 })
    }

    const result = await resendVerificationCode(email)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[API] Resend error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
