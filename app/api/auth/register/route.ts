import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/app/actions/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName, password } = body

    if (!email || !fullName || !password) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }

    const result = await registerUser(email, fullName, password)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[API] Register error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
