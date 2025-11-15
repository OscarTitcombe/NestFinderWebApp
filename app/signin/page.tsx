'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Home, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { PrimaryButton, GhostButton } from '@/components/Buttons'
import { signInWithEmail } from '@/lib/supabase/auth'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAutoRequest = async (emailToUse: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await signInWithEmail(emailToUse)
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Pre-fill email from URL params and auto-request if needed
  useEffect(() => {
    const emailParam = searchParams.get('email')
    const autoRequest = searchParams.get('autoRequest')
    
    if (emailParam) {
      setEmail(emailParam)
      
      // Auto-request magic link if requested
      if (autoRequest === 'true' && emailParam) {
        handleAutoRequest(emailParam)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await signInWithEmail(email)
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-nest-sageBg flex items-center justify-center">
        <div className="nf-container">
          <div className="text-center max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Check your email
            </h1>
            
            {/* Subtext */}
            <p className="text-lg text-slate-600 mb-8">
              We've sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GhostButton asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go home
                </Link>
              </GhostButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nest-sageBg flex items-center justify-center">
      <div className="nf-container">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="w-20 h-20 bg-nest-mint/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-nest-mint" />
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Sign in with magic link
          </h1>
          
          {/* Subtext */}
          <p className="text-lg text-slate-600 mb-8">
            Enter your email address and we'll send you a secure link to sign in. No password needed.
          </p>

          {/* Sign In Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-nest-line p-6 sm:p-8 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2 text-left">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-primary w-full"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <PrimaryButton
                type="submit"
                disabled={isLoading || !email}
                className="w-full"
              >
                Send magic link
                <ArrowRight className="w-4 h-4 ml-2" />
              </PrimaryButton>
            </form>
          </div>

          {/* Alternative Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <GhostButton asChild>
              <Link href="/market">
                Browse market
              </Link>
            </GhostButton>
            
            <GhostButton asChild>
              <Link href="/buy">
                Post your brief
              </Link>
            </GhostButton>
            
            <GhostButton asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go home
              </Link>
            </GhostButton>
          </div>
        </div>
      </div>
    </div>
  )
}

