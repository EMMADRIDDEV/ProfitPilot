'use server'

import { createClient } from '@/lib/supabase/server'
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
  console.log('[AuthAction] registerUser called', { email: formData.email })
  
  try {
    const { email, password, fullName } = formData
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[AuthAction] Missing Supabase environment variables')
      return { success: false, error: 'Server configuration error' }
    }

    const supabase = createClient()
    console.log('[AuthAction] Supabase client created')

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
      console.error('[AuthAction] Supabase signUp error:', error.message)
      return { success: false, error: error.message }
    }

    console.log('[AuthAction] Supabase signUp successful', { userId: data.user?.id })
    return { success: true, data }
  } catch (error: any) {
    console.error('[AuthAction] Unexpected exception during registerUser:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

export async function loginUser(formData: any) {
  console.log('[AuthAction] loginUser called', { email: formData.email })

  try {
    const { email, password } = formData
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[AuthAction] Missing Supabase environment variables')
      return { success: false, error: 'Server configuration error' }
    }

    const supabase = createClient()
    console.log('[AuthAction] Supabase client created')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[AuthAction] Supabase signIn error:', error.message)
      return { success: false, error: error.message }
    }

    console.log('[AuthAction] Supabase signIn successful', { userId: data.user?.id })
    return { success: true, data }
  } catch (error: any) {
    console.error('[AuthAction] Unexpected exception during loginUser:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
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
