import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/app/actions/auth'

export async function POST(request: NextRequest) {
  try {
    let body: any
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      body = await request.json()
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text()
      body = Object.fromEntries(new URLSearchParams(text))
    } else {
      // attempt to parse as json
      try {
        body = await request.json()
      } catch (e) {
        body = {}
      }
    }

    const { email, fullName, password } = body

    if (!email || !fullName || !password) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }

    console.log('[LegacyRegister] forwarding registration for', email)

    const result = await registerUser(email, fullName, password)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[LegacyRegister] Error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
