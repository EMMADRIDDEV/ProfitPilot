import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for server-side operations.
 * Always create a new client within each function when using it.
 */
export async function createClient() {
  // Prefer the service role key for server-side operations when available.
  // This bypasses Row Level Security for trusted server actions.
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const key = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}
