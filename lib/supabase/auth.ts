import { createClient } from './client'

export async function signInWithEmail(email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/verify`,
      shouldCreateUser: true,
    },
  })

  if (error) {
    console.error('Error signing in:', error)
    throw error
  }

  return data
}

// Request OTP code (6-digit code that works cross-device)
export async function requestOtpCode(email: string) {
  const supabase = createClient()
  
  // Request OTP without emailRedirectTo - Supabase will send a 6-digit code
  // Note: This requires Supabase to be configured to send codes (not just links)
  // In Supabase Dashboard: Authentication > Email Templates > Magic Link
  // Make sure "Enable email OTP" is enabled
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      // Don't set emailRedirectTo - this tells Supabase to send a code
      // If emailRedirectTo is set, it sends a magic link instead
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




