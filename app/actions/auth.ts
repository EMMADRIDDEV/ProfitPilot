'use server'

import { auth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    
    if (!session || !session.user) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.name,
      email_verified: session.user.emailVerified,
      created_at: session.user.createdAt,
    }
  } catch (error) {
    console.error('[Auth] Error getting current user:', error)
    return null
  }
}

export async function getBusiness() {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return business || null
}

export async function logout() {
  // Better Auth handles session removal, but we can call it here if needed
  // or just redirect to login as the client side signOut will handle cookies
  redirect('/login')
}

