import { NextRequest, NextResponse } from 'next/server'

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    const accessCode = generateAccessCode()


    return NextResponse.json({
      success: true,
      accessCode,
      message: 'Access code generated successfully',
    })
  } catch (error) {
    console.error('[v0] Error generating access code:', error)
    return NextResponse.json(
      { error: 'Failed to generate access code' },
      { status: 500 }
    )
  }
}
