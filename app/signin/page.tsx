'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Home, ArrowRight, CheckCircle, AlertCircle, Loader2, Sparkles, Copy, RefreshCw } from 'lucide-react'
import { PrimaryButton, GhostButton } from '@/components/Buttons'
import { signInWithEmail } from '@/lib/supabase/auth'

function SignInPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailCopied, setEmailCopied] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)

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

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError(null)
    return true
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
    
    // Auto-focus email input
    if (emailInputRef.current && !emailParam) {
      emailInputRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setEmailError(null)

    // Validate email
    if (!validateEmail(email)) {
      return
    }

    setIsLoading(true)

    try {
      await signInWithEmail(email)
      setIsSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setEmailError(null)
    setError(null)
    // Real-time validation
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Please enter a valid email address')
    }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy email:', err)
    }
  }

  const handleResendLink = () => {
    setEmailCopied(false)
    setIsSubmitted(false)
    // Auto-focus the email input after a brief delay
    setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus()
        emailInputRef.current.select()
      }
    }, 100)
  }

  if (isSubmitted) {
    return (
      <div className="w-full py-8 sm:py-12">
        <div className="max-w-md mx-auto px-3 sm:px-4 lg:px-8 w-full">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-nest-mint/10 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 animate-scale-in">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-nest-mint" />
            </div>
            
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-3 sm:mb-4">
              Check your email
            </h1>
            
            {/* Email Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6 sm:mb-8 shadow-sm">
              <p className="text-sm sm:text-base text-slate-600 mb-3">
                We've sent a magic link to
              </p>
              
              {/* Email Display */}
              <div className="bg-slate-50 rounded-lg p-3 sm:p-4 mb-4 border border-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-base sm:text-lg font-semibold text-dark break-all text-left flex-1">
                    {email}
                  </p>
                  <button
                    onClick={handleCopyEmail}
                    className="flex-shrink-0 p-2 text-slate-600 hover:text-nest-mint hover:bg-nest-mint/5 rounded-lg transition-colors"
                    title="Copy email"
                  >
                    {emailCopied ? (
                      <CheckCircle className="w-5 h-5 text-nest-mint" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-600">
                Click the link in the email to sign in. The link expires in 5 minutes.
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={handleResendLink}
                className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4" />
                Send another link
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full py-6 sm:py-8 lg:py-12">
      <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-nest-mint/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-nest-mint" />
            </div>
            
            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-dark mb-2 sm:mb-4">
              Sign in with magic link
            </h1>
            
            {/* Subtext */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8 max-w-md mx-auto">
              Enter your email address and we'll send you a secure link to sign in. No password needed.
            </p>

            {/* Sign In Form */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-700 mb-2 text-left">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      ref={emailInputRef}
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => validateEmail(email)}
                      placeholder="your@email.com"
                      className={`input-primary w-full text-sm sm:text-base pr-10 ${
                        emailError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                      }`}
                      required
                      disabled={isLoading}
                      aria-invalid={emailError ? 'true' : 'false'}
                      aria-describedby={emailError ? 'email-error' : undefined}
                    />
                    {email && !emailError && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-nest-mint" />
                      </div>
                    )}
                  </div>
                  {emailError && (
                    <p id="email-error" className="mt-1.5 text-xs text-red-600 text-left flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{emailError}</span>
                    </p>
                  )}
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-red-600 text-xs sm:text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="text-left">{error}</span>
                  </div>
                )}

                <PrimaryButton
                  type="submit"
                  disabled={isLoading || !email || !!emailError}
                  className="w-full min-h-[44px] text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send magic link
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </PrimaryButton>
              </form>
            </div>

            {/* Benefits */}
            <div className="mt-6 sm:mt-8 max-w-md mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-nest-mint" />
                  <span>No password needed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-nest-mint" />
                  <span>Secure & instant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="w-full py-6 sm:py-8 lg:py-12">
        <div className="max-w-2xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-nest-mint animate-spin mx-auto mb-3" />
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SignInPageContent />
    </Suspense>
  )
}

