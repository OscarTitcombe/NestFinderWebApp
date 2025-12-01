import { createClient } from './server'
import type { Database } from '@/lib/types/database'

/**
 * SECURITY: Server-side only admin functions
 * These functions MUST only be called from server components or API routes
 * Never expose these to client-side code
 */

/**
 * Check if the current user is an admin
 * This is the ONLY way to verify admin status - always use this server-side
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !data) {
    return false
  }

  return data.role === 'admin'
}

/**
 * Get admin user profile (for checking admin status)
 */
export async function getAdminProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .eq('role', 'admin')
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Require admin access - throws error if user is not admin
 * Use this in API routes and server components
 */
export async function requireAdmin() {
  const isUserAdmin = await isAdmin()
  if (!isUserAdmin) {
    throw new Error('Unauthorized: Admin access required')
  }
}




