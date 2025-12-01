import { createClient } from './server'
import { requireAdmin } from './admin'
import type { Database } from '@/lib/types/database'

type BuyerRequest = Database['public']['Tables']['buyer_requests']['Row']
type SellerProperty = Database['public']['Tables']['seller_properties']['Row']
type Contact = Database['public']['Tables']['contacts']['Row']
type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']
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
  
  // First get all buyer requests
  const { data: buyerRequests, error: buyerError } = await supabase
    .from('buyer_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (buyerError) {
    console.error('Error fetching all buyer requests:', buyerError)
    throw buyerError
  }

  if (!buyerRequests || buyerRequests.length === 0) {
    return []
  }

  // Get unique user IDs
  const userIds = Array.from(new Set(buyerRequests.map(br => br.user_id).filter(Boolean) as string[]))

  // Fetch profiles for those users
  let profilesMap = new Map<string, { id: string; email: string; full_name: string | null }>()
  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', userIds)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      // Don't throw - just continue without profiles
    } else if (profiles) {
      profiles.forEach(p => profilesMap.set(p.id, p))
    }
  }

  // Combine the data
  return buyerRequests.map(br => ({
    ...br,
    profiles: br.user_id ? (profilesMap.get(br.user_id) || null) : null
  })) as (BuyerRequest & { profiles: { id: string; email: string; full_name: string | null } | null })[]
}

export async function adminUpdateBuyerRequest(id: string, updates: Partial<BuyerRequest>) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('buyer_requests')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating buyer request:', error)
    throw error
  }

  // Fetch profile if user_id exists
  let profile: { id: string; email: string; full_name: string | null } | null = null
  if (data.user_id) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('id', data.user_id)
      .single()
    
    profile = profileData || null
  }

  return { ...data, profiles: profile } as BuyerRequest & { profiles: { id: string; email: string; full_name: string | null } | null }
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
  
  // Get all contacts with buyer_requests
  const { data: contacts, error: contactsError } = await supabase
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
        user_id
      )
    `)
    .order('created_at', { ascending: false })

  if (contactsError) {
    console.error('Error fetching all contacts:', contactsError)
    throw contactsError
  }

  if (!contacts || contacts.length === 0) {
    return []
  }

  // Get unique user IDs from buyer_requests and seller_ids
  const userIds = new Set<string>()
  contacts.forEach(contact => {
    if (contact.buyer_requests?.user_id) {
      userIds.add(contact.buyer_requests.user_id)
    }
    if (contact.seller_id) {
      userIds.add(contact.seller_id)
    }
  })

  // Fetch all profiles
  let profilesMap = new Map<string, { id: string; email: string; full_name: string | null }>()
  if (userIds.size > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .in('id', Array.from(userIds))

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      // Don't throw - just continue without profiles
    } else if (profiles) {
      profiles.forEach(p => profilesMap.set(p.id, p))
    }
  }

  // Combine the data
  return contacts.map(contact => ({
    ...contact,
    buyer_requests: contact.buyer_requests ? {
      ...contact.buyer_requests,
      profiles: contact.buyer_requests.user_id 
        ? (profilesMap.get(contact.buyer_requests.user_id) || null)
        : null
    } : null,
    seller_profiles: contact.seller_id 
      ? (profilesMap.get(contact.seller_id) || null)
      : null
  })) as (Contact & {
    buyer_requests: any & { profiles: { id: string; email: string; full_name: string | null } | null }
    seller_profiles: { id: string; email: string; full_name: string | null } | null
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
  
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all users:', error)
    throw error
  }

  if (!users || users.length === 0) {
    return []
  }

  // Get buyer request counts for each user
  const userIds = users.map(u => u.id)
  const { data: buyerRequests } = await supabase
    .from('buyer_requests')
    .select('user_id, status')
    .in('user_id', userIds)

  // Count requests per user
  const requestCounts = new Map<string, { total: number; active: number }>()
  buyerRequests?.forEach(br => {
    if (br.user_id) {
      const current = requestCounts.get(br.user_id) || { total: 0, active: 0 }
      current.total++
      if (br.status === 'active') current.active++
      requestCounts.set(br.user_id, current)
    }
  })

  // Get contact counts (messages sent by users as sellers)
  const { data: contacts } = await supabase
    .from('contacts')
    .select('seller_id')
    .in('seller_id', userIds)

  const contactCounts = new Map<string, number>()
  contacts?.forEach(c => {
    if (c.seller_id) {
      contactCounts.set(c.seller_id, (contactCounts.get(c.seller_id) || 0) + 1)
    }
  })

  // Combine data
  return users.map(user => ({
    ...user,
    buyerRequestCount: requestCounts.get(user.id)?.total || 0,
    activeBuyerRequestCount: requestCounts.get(user.id)?.active || 0,
    messageCount: contactCounts.get(user.id) || 0
  })) as (Profile & {
    buyerRequestCount: number
    activeBuyerRequestCount: number
    messageCount: number
  })[]
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

// ============ Contact Submissions ============

export async function adminGetAllContactSubmissions() {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all contact submissions:', error)
    throw error
  }

  return (data || []) as ContactSubmission[]
}

export async function adminUpdateContactSubmission(id: string, updates: Partial<ContactSubmission>) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating contact submission:', error)
    throw error
  }

  return data as ContactSubmission
}

export async function adminDeleteContactSubmission(id: string) {
  await requireAdmin()
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting contact submission:', error)
    throw error
  }
}

// ============ Statistics ============

export async function adminGetStats() {
  await requireAdmin()
  const supabase = await createClient()
  
  const [
    { count: totalUsers },
    { count: totalBuyerRequests },
    { count: activeBuyerRequests },
    { count: totalContacts },
    { count: unreadContacts },
    { count: totalContactSubmissions },
    { count: newContactSubmissions }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('buyer_requests').select('*', { count: 'exact', head: true }),
    supabase.from('buyer_requests').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).in('status', ['pending', 'sent']),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new')
  ])

  return {
    users: {
      total: totalUsers || 0
    },
    buyerRequests: {
      total: totalBuyerRequests || 0,
      active: activeBuyerRequests || 0
    },
    contacts: {
      total: totalContacts || 0,
      unread: unreadContacts || 0
    },
    contactSubmissions: {
      total: totalContactSubmissions || 0,
      new: newContactSubmissions || 0
    }
  }
}



