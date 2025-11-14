import { createClient } from './client'

export async function signInWithEmail(email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/verify`,
    },
  })

  if (error) {
    console.error('Error signing in:', error)
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


