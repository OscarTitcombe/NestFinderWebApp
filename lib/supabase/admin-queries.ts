import { createClient } from './server'
import { requireAdmin } from './admin'
import type { Database } from '@/lib/types/database'

type BuyerRequest = Database['public']['Tables']['buyer_requests']['Row']
type SellerProperty = Database['public']['Tables']['seller_properties']['Row']
type Contact = Database['public']['Tables']['contacts']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * SECURITY: Admin-only queries
 * These functions require admin access and can view/manage all data
 * All functions call requireAdmin() to ensure only admins can use them
 */

// ============ Buyer Requests ============

export async function adminGetAllBuyerRequests() {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('buyer_requests')
    .select(`
      *,
      profiles:user_id (
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all buyer requests:', error)
    throw error
  }

  return data as (BuyerRequest & { profiles: Profile | null })[]
}

export async function adminUpdateBuyerRequest(id: string, updates: Partial<BuyerRequest>) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('buyer_requests')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      profiles:user_id (
        id,
        email,
        full_name
      )
    `)
    .single()

  if (error) {
    console.error('Error updating buyer request:', error)
    throw error
  }

  return data as BuyerRequest & { profiles: Profile | null }
}

export async function adminDeleteBuyerRequest(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('buyer_requests')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting buyer request:', error)
    throw error
  }
}

// ============ Seller Properties ============

export async function adminGetAllSellerProperties() {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('seller_properties')
    .select(`
      *,
      profiles:user_id (
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all seller properties:', error)
    throw error
  }

  return data as (SellerProperty & { profiles: Profile | null })[]
}

export async function adminUpdateSellerProperty(id: string, updates: Partial<SellerProperty>) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('seller_properties')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      profiles:user_id (
        id,
        email,
        full_name
      )
    `)
    .single()

  if (error) {
    console.error('Error updating seller property:', error)
    throw error
  }

  return data as SellerProperty & { profiles: Profile | null }
}

export async function adminDeleteSellerProperty(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('seller_properties')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting seller property:', error)
    throw error
  }
}

// ============ Contacts/Messages ============

export async function adminGetAllContacts() {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      buyer_requests (
        id,
        budget_min,
        budget_max,
        beds_min,
        beds_max,
        property_type,
        postcode_districts,
        description,
        profiles:user_id (
          id,
          email,
          full_name
        )
      ),
      seller_profiles:seller_id (
        id,
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all contacts:', error)
    throw error
  }

  return data as (Contact & {
    buyer_requests: any & { profiles: Profile | null }
    seller_profiles: Profile | null
  })[]
}

export async function adminUpdateContact(id: string, updates: Partial<Contact>) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating contact:', error)
    throw error
  }

  return data as Contact
}

export async function adminDeleteContact(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting contact:', error)
    throw error
  }
}

// ============ Users/Profiles ============

export async function adminGetAllUsers() {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all users:', error)
    throw error
  }

  return data as Profile[]
}

export async function adminUpdateUser(id: string, updates: Partial<Profile>) {
  await requireAdmin()
  const supabase = await createClient()
  
  // Prevent changing admin status via this function (must be done manually in database)
  if (updates.role === 'admin') {
    throw new Error('Cannot assign admin role via API. Must be done manually in database.')
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating user:', error)
    throw error
  }

  return data as Profile
}

// ============ Statistics ============

export async function adminGetStats() {
  await requireAdmin()
  const supabase = await createClient()
  
  const [
    { count: totalUsers },
    { count: totalBuyerRequests },
    { count: activeBuyerRequests },
    { count: totalSellerProperties },
    { count: activeSellerProperties },
    { count: totalContacts },
    { count: unreadContacts }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('buyer_requests').select('*', { count: 'exact', head: true }),
    supabase.from('buyer_requests').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('seller_properties').select('*', { count: 'exact', head: true }),
    supabase.from('seller_properties').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).in('status', ['pending', 'sent'])
  ])

  return {
    users: {
      total: totalUsers || 0
    },
    buyerRequests: {
      total: totalBuyerRequests || 0,
      active: activeBuyerRequests || 0
    },
    sellerProperties: {
      total: totalSellerProperties || 0,
      active: activeSellerProperties || 0
    },
    contacts: {
      total: totalContacts || 0,
      unread: unreadContacts || 0
    }
  }
}



