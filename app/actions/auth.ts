'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createTransport } from 'nodemailer'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@profitpilot.com'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'

// Email service configuration
const emailTransporter = createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

async function sendVerificationEmail(email: string, code: string) {
  try {
    const verificationUrl = `${FRONTEND_URL}/verify-email?code=${code}`
    
    await emailTransporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: 'Verify your ProfitPilot email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Welcome to ProfitPilot!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Verify Email Address
          </a>
          <p style="color: #6b7280; font-size: 14px;">Or use this verification code: <strong>${code}</strong></p>
          <p style="color: #6b7280; font-size: 12px;">This link expires in 24 hours.</p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

async function generateVerificationCode(): Promise<string> {
  // Generate a random 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function registerUser(
  email: string,
  fullName: string,
  password: string
) {
  console.log('[Auth] registerUser called for:', email)
  const supabase = await createClient()

  try {
    // Validate inputs
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' }
    }

    if (!fullName || fullName.trim().length === 0) {
      return { success: false, error: 'Please enter your full name' }
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long' }
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (existingUser) {
      return { success: false, error: 'User with this email already exists' }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([{
        email: email.toLowerCase(),
        full_name: fullName,
        password_hash: passwordHash,
        email_verified: false,
        is_premium: false,
        premium_expires_at: null,
      }])
      .select()
      .single()

    if (userError || !newUser) {
      console.error('[Auth] Error creating user:', userError)
      return { success: false, error: 'Failed to create user. Please try again.' }
    }

    // Generate verification code
    const verificationCode = await generateVerificationCode()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Save verification code
    const { error: codeError } = await supabase
      .from('email_verification_codes')
      .insert([{
        user_id: newUser.id,
        code: verificationCode,
        expires_at: expiresAt.toISOString(),
      }])

    if (codeError) {
      console.error('[Auth] Error creating verification code:', codeError)
      return { success: false, error: 'Failed to create verification code' }
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode)
    } catch (emailError) {
      console.error('[Auth] Error sending verification email:', emailError)
      // Don't fail registration if email fails to send
      // User can request a new code later
    }

    return {
      success: true,
      message: 'Registration successful! Please check your email for verification code.',
      userId: newUser.id,
    }
  } catch (error) {
    console.error('[Auth] Registration error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function verifyEmail(code: string) {
  const supabase = await createClient()

  try {
    // Find verification code
    const { data: verificationRecord, error: codeError } = await supabase
      .from('email_verification_codes')
      .select('*, users(*)')
      .eq('code', code)
      .maybeSingle()

    if (codeError || !verificationRecord) {
      return { success: false, error: 'Invalid verification code' }
    }

    // Check if code has expired
    if (new Date(verificationRecord.expires_at) < new Date()) {
      return { success: false, error: 'Verification code has expired' }
    }

    // Check if already used
    if (verificationRecord.used_at) {
      return { success: false, error: 'This verification code has already been used' }
    }

    // Update user as verified
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString(),
      })
      .eq('id', verificationRecord.user_id)

    if (updateError) {
      return { success: false, error: 'Failed to verify email' }
    }

    // Mark code as used
    await supabase
      .from('email_verification_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', verificationRecord.id)

    return {
      success: true,
      message: 'Email verified successfully!',
      userId: verificationRecord.user_id,
    }
  } catch (error) {
    console.error('[Auth] Email verification error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function loginWithEmail(email: string, password: string) {
  const supabase = await createClient()

  try {
    // Find user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (userError || !user) {
      return { success: false, error: 'Invalid email or password' }
    }

    // Check if email is verified
    if (!user.email_verified) {
      return {
        success: false,
        error: 'Please verify your email before logging in',
        requiresVerification: true,
        userId: user.id,
      }
    }

    // Verify password
    if (!user.password_hash) {
      return { success: false, error: 'Invalid email or password' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return { success: false, error: 'Invalid email or password' }
    }

    // Create session token
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    // Save session in database
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert([{
        user_id: user.id,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }])

    if (sessionError) {
      console.error('[Auth] Error creating session:', sessionError)
      return { success: false, error: 'Failed to create session' }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })
    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })

    // Determine whether the user already has a business
    try {
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      const hasBusiness = !!business

      return {
        success: true,
        message: 'Login successful',
        userId: user.id,
        requiresSetup: !hasBusiness,
        redirectUrl: hasBusiness ? '/dashboard' : '/dashboard/setup',
      }
    } catch (err) {
      console.error('[Auth] Error checking business for user:', err)
      return {
        success: true,
        message: 'Login successful',
        userId: user.id,
        requiresSetup: true,
        redirectUrl: '/dashboard/setup',
      }
    }
  } catch (error) {
    console.error('[Auth] Login error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function loginWithGoogle(
  email: string,
  fullName: string,
  googleId: string
) {
  const supabase = await createClient()

  try {
    // Check if user exists with Google ID
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', googleId)
      .maybeSingle()

    let user = existingUser

    if (!user) {
      // Check if user exists with email
      const { data: userByEmail } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .maybeSingle()

      if (userByEmail) {
        // Link Google account to existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ google_id: googleId, oauth_provider: 'google' })
          .eq('id', userByEmail.id)
          .select()
          .single()

        if (updateError) {
          return { success: false, error: 'Failed to link Google account' }
        }
        user = updatedUser
      } else {
        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{
            email: email.toLowerCase(),
            full_name: fullName,
            google_id: googleId,
            oauth_provider: 'google',
            email_verified: true,
            email_verified_at: new Date().toISOString(),
            is_premium: false,
            premium_expires_at: null,
          }])
          .select()
          .single()

        if (createError || !newUser) {
          return { success: false, error: 'Failed to create user' }
        }
        user = newUser
      }
    }

    // Create session token
    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    // Save session
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert([{
        user_id: user.id,
        session_token: sessionToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }])

    if (sessionError) {
      console.error('[Auth] Error creating session:', sessionError)
      return { success: false, error: 'Failed to create session' }
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })
    cookieStore.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    })

    // Check if user already has a business and redirect appropriately
    try {
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      const hasBusiness = !!business

      return {
        success: true,
        message: 'Google login successful',
        userId: user.id,
        requiresSetup: !hasBusiness,
        redirectUrl: hasBusiness ? '/dashboard' : '/dashboard/setup',
      }
    } catch (err) {
      console.error('[Auth] Error checking business for user (google):', err)
      return {
        success: true,
        message: 'Google login successful',
        userId: user.id,
        requiresSetup: true,
        redirectUrl: '/dashboard/setup',
      }
    }
  } catch (error) {
    console.error('[Auth] Google login error:', error)
    return { success: false, error: 'Failed to authenticate with Google' }
  }
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return null
  }

  try {
    // If user IDs are numeric (BIGINT), convert the cookie value to a Number
    const parsedUserId = /^[0-9]+$/.test(userId) ? Number(userId) : userId
    const { data: user } = await supabase
      .from('users')
      .select('id, email, full_name, email_verified, created_at, is_premium, premium_expires_at')
      .eq('id', parsedUserId)
      .maybeSingle()

    return user || null
  } catch (error) {
    console.error('[Auth] Error getting current user:', error)
    return null
  }
}

export async function getBusiness() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')?.value

  if (!userId) {
    return null
  }

  // If user IDs are numeric (BIGINT), convert the cookie value to a Number
  const parsedUserId = /^[0-9]+$/.test(userId) ? Number(userId) : userId

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', parsedUserId)
    .maybeSingle()

  return business || null
}

export async function logout() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')?.value

  if (sessionToken) {
    const supabase = await createClient()
    // Invalidate session in database
    await supabase
      .from('sessions')
      .update({ expires_at: new Date().toISOString() })
      .eq('session_token', sessionToken)
  }

  // Clear cookies
  cookieStore.delete('session_token')
  cookieStore.delete('user_id')
  redirect('/login')
}

export async function resendVerificationCode(email: string) {
  const supabase = await createClient()

  try {
    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id, email_verified')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.email_verified) {
      return { success: false, error: 'Email is already verified' }
    }

    // Generate new verification code
    const verificationCode = await generateVerificationCode()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Delete old codes
    await supabase
      .from('email_verification_codes')
      .delete()
      .eq('user_id', user.id)

    // Save new verification code
    const { error: codeError } = await supabase
      .from('email_verification_codes')
      .insert([{
        user_id: user.id,
        code: verificationCode,
        expires_at: expiresAt.toISOString(),
      }])

    if (codeError) {
      return { success: false, error: 'Failed to create verification code' }
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode)
    } catch (emailError) {
      console.error('[Auth] Error sending verification email:', emailError)
    }

    return {
      success: true,
      message: 'Verification code sent to your email',
    }
  } catch (error) {
    console.error('[Auth] Resend verification code error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
