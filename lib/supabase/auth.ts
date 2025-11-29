import { createClient } from './client'

// Request OTP code (6-digit code that works cross-device)
export async function requestOtpCode(email: string) {
  const supabase = createClient()
  
  // Request OTP without emailRedirectTo - Supabase will send a 6-digit code
  // This works cross-device and is more reliable than magic links
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      // Don't set emailRedirectTo - this tells Supabase to send a code instead of a link
    },
  })

  if (error) {
    console.error('Error requesting OTP code:', error)
    throw error
  }

  return data
}

export async function signOut() {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export async function verifyOtp(email: string, token: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }

  return data
}

// Verify OTP code (6-digit code)
export async function verifyOtpCode(email: string, code: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'email',
  })

  if (error) {
    console.error('Error verifying OTP code:', error)
    throw error
  }

  return data
}

export async function getCurrentUser() {
  const supabase = createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting current user:', error)
    return null
  }

  return user
}

export async function getSession() {
  const supabase = createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error)
    return null
  }

  return session
}




