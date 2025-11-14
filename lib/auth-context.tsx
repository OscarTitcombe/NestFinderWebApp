'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

// Cache key for localStorage
const USER_CACHE_KEY = 'nestfinder_user_cache'

// Helper to get cached user
function getCachedUser(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const cached = localStorage.getItem(USER_CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      // Check if cache is still valid (less than 5 minutes old)
      if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
        return parsed.user
      }
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return null
}

// Helper to cache user
function cacheUser(user: User | null) {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify({
        user,
        timestamp: Date.now()
      }))
    } else {
      localStorage.removeItem(USER_CACHE_KEY)
    }
  } catch (e) {
    // Ignore localStorage errors
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always start with null to match server render (prevents hydration error)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return
    hasInitialized.current = true

    let supabase
    try {
      supabase = createClient()
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error)
      setIsLoading(false)
      return
    }

    // Load cached user immediately on client (after hydration)
    // This happens synchronously so there's no flash
    const cachedUser = getCachedUser()
    if (cachedUser) {
      setUser(cachedUser)
      setIsLoading(false)
    }

    // Check session in background
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        setUser(currentUser)
        cacheUser(currentUser)
      } catch (error) {
        console.error('Error checking session:', error)
        setUser(null)
        cacheUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    // If we have cached user, verify in background
    if (cachedUser) {
      // Verify session in background without blocking
      checkSession()
    } else {
      // No cache, check immediately
      checkSession()
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      cacheUser(currentUser)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

