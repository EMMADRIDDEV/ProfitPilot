'use server'

import { createServersideClient as createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { resend } from '@/lib/resend'

export async function getCurrentUser() {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      created_at: user.created_at,
    }
  } catch (error) {
    console.error('[Auth] Error getting current user:', error)
    return null
  }
}

export async function getBusiness() {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = createClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return business || null
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function registerUser(formData: any) {
  const { email, password, fullName } = formData
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Use Resend to send a custom welcome/confirmation email if needed
  // Note: Supabase already sends a confirmation email if enabled in dashboard.
  // If you want to use Resend INSTEAD of Supabase's default, you'd need to handle
  // the verification flow manually or use a Supabase hook.
  // For now, we'll let Supabase handle the core verification link.
  
  return { success: true, data }
}

export async function loginUser(formData: any) {
  const { email, password } = formData
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function verifyEmailCode(email: string, code: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'signup',
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function resendVerificationCode(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
