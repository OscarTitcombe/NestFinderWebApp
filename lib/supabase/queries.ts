import { createClient } from './client'
import type { Database } from '@/lib/types/database'

type BuyerRequest = Database['public']['Tables']['buyer_requests']['Row']
type BuyerRequestInsert = Database['public']['Tables']['buyer_requests']['Insert']
type SellerProperty = Database['public']['Tables']['seller_properties']['Row']
type SellerPropertyInsert = Database['public']['Tables']['seller_properties']['Insert']
type Contact = Database['public']['Tables']['contacts']['Row']
type ContactInsert = Database['public']['Tables']['contacts']['Insert']

// Buyer Requests
export async function getBuyerRequests(postcodeDistrict?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('buyer_requests')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (postcodeDistrict) {
    query = query.contains('postcode_districts', [postcodeDistrict])
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching buyer requests:', error)
    throw error
  }

  return data as BuyerRequest[]
}

export async function createBuyerRequest(request: Omit<BuyerRequestInsert, 'user_id'>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is authenticated, check active buyer request limit (max 3)
  if (user) {
    const { count, error: countError } = await supabase
      .from('buyer_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (countError) {
      console.error('Error checking active requests:', countError)
      throw new Error('Failed to check active requests')
    }

    const activeCount = count || 0
    if (activeCount >= 3) {
      throw new Error('You can only have 3 active buyer requests at a time. Please pause or delete an existing request to create a new one.')
    }
  }

  // Allow unauthenticated users - user_id will be null
  // They'll need to verify their email to activate the account
  const { data, error } = await supabase
    .from('buyer_requests')
    .insert({
      ...request,
      user_id: user?.id || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating buyer request:', error)
    throw error
  }

  return data as BuyerRequest
}

export async function getUserBuyerRequests() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('buyer_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user buyer requests:', error)
    throw error
  }

  return data as BuyerRequest[]
}

export async function updateBuyerRequest(id: string, updates: Partial<BuyerRequest>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('buyer_requests')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating buyer request:', error)
    throw error
  }

  return data as BuyerRequest
}

export async function deleteBuyerRequest(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { error } = await supabase
    .from('buyer_requests')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting buyer request:', error)
    throw error
  }
}

// Seller Properties
export async function getSellerProperties(postcodeDistrict?: string) {
  const supabase = createClient()
  
  let query = supabase
    .from('seller_properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (postcodeDistrict) {
    query = query.eq('postcode_district', postcodeDistrict)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching seller properties:', error)
    throw error
  }

  return data as SellerProperty[]
}

export async function createSellerProperty(property: Omit<SellerPropertyInsert, 'user_id'>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to create a seller property')
  }

  const { data, error } = await supabase
    .from('seller_properties')
    .insert({
      ...property,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating seller property:', error)
    throw error
  }

  return data as SellerProperty
}

export async function getUserSellerProperties() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('seller_properties')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user seller properties:', error)
    throw error
  }

  return data as SellerProperty[]
}

export async function updateSellerProperty(id: string, updates: Partial<SellerProperty>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('seller_properties')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating seller property:', error)
    throw error
  }

  return data as SellerProperty
}

export async function deleteSellerProperty(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { error } = await supabase
    .from('seller_properties')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting seller property:', error)
    throw error
  }
}

// Contacts
export async function createContact(contact: Omit<ContactInsert, 'seller_id'>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to create a contact')
  }

  // Check daily contact limit (max 10 per day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStart = today.toISOString()
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStart = tomorrow.toISOString()

  const { count, error: countError } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('seller_id', user.id)
    .gte('created_at', todayStart)
    .lt('created_at', tomorrowStart)

  if (countError) {
    console.error('Error checking daily contacts:', countError)
    throw new Error('Failed to check daily contact limit')
  }

  const todayCount = count || 0
  if (todayCount >= 10) {
    throw new Error('You can only contact up to 10 buyers per day. Please try again tomorrow.')
  }

  // Create the contact
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      ...contact,
      seller_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating contact:', error)
    throw error
  }

  return data as Contact
}

export async function getUserContacts() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user contacts:', error)
    throw error
  }

  return data as Contact[]
}

// Get contacts for a buyer (messages sent to their buyer requests)
export async function getBuyerContacts() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  // Get all buyer requests for this user
  const { data: buyerRequests, error: buyerError } = await supabase
    .from('buyer_requests')
    .select('id')
    .eq('user_id', user.id)

  if (buyerError) {
    console.error('Error fetching buyer requests:', buyerError)
    throw buyerError
  }

  if (!buyerRequests || buyerRequests.length === 0) {
    return []
  }

  const buyerRequestIds = buyerRequests.map(br => br.id)

  // Get contacts for these buyer requests, with buyer request details
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
        description
      )
    `)
    .in('buyer_request_id', buyerRequestIds)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching buyer contacts:', error)
    throw error
  }

  return data as (Contact & { buyer_requests: any })[]
}

// Mark a contact as read
export async function markContactAsRead(contactId: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated')
  }

  // Verify this contact belongs to one of the user's buyer requests
  const { data: contact, error: fetchError } = await supabase
    .from('contacts')
    .select(`
      *,
      buyer_requests!inner(user_id)
    `)
    .eq('id', contactId)
    .single()

  if (fetchError || !contact) {
    throw new Error('Contact not found')
  }

  // Check if the buyer request belongs to the current user
  const buyerRequest = (contact as any).buyer_requests
  if (buyerRequest.user_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('contacts')
    .update({ status: 'read' })
    .eq('id', contactId)
    .select()
    .single()

  if (error) {
    console.error('Error marking contact as read:', error)
    throw error
  }

  return data as Contact
}

