import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Payment functionality has been disabled' },
    { status: 403 }
  )
}
