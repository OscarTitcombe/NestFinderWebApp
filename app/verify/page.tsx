'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Home, Mail, Sparkles, Loader2, Clock } from 'lucide-react'
import { PrimaryButton, GhostButton } from '@/components/Buttons'
import { verifyOtp } from '@/lib/supabase/auth'

type VerificationStatus = 'success' | 'expired' | 'invalid' | 'loading'

interface VerificationState {
  status: VerificationStatus
  title: string
  message: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBgColor: string
  buttonColor: string
  buttonHoverColor: string
}

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verificationState, setVerificationState] = useState<VerificationState | null>(null)

  useEffect(() => {
    const handleVerification = async () => {
      // Parse hash fragment (Supabase magic links use hash fragments)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const error = hashParams.get('error') || searchParams.get('error')
      const errorCode = hashParams.get('error_code') || searchParams.get('error_code')
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description')
      
      // Handle errors from Supabase
      if (error) {
        console.error('Auth error:', { error, errorCode, errorDescription })
        
        if (errorCode === 'otp_expired' || errorCode === 'expired_token') {
          setVerificationState({
            status: 'expired',
            title: 'Link has expired',
            message: 'This magic link has expired. Magic links expire after 1 hour for security. Request a new one to continue.',
            icon: Clock,
            iconColor: 'text-amber-600',
            iconBgColor: 'bg-amber-100',
            buttonColor: 'bg-nest-mint hover:bg-nest-mintHover',
            buttonHoverColor: 'hover:bg-nest-mintHover'
          })
        } else {
          setVerificationState({
            status: 'invalid',
            title: 'Verification failed',
            message: errorDescription || 'The verification link appears to be invalid. Please try signing in again.',
            icon: XCircle,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100',
            buttonColor: 'bg-red-600 hover:bg-red-700',
            buttonHoverColor: 'hover:bg-red-700'
          })
        }
        return
      }

      // Check for token in hash fragment (Supabase magic links)
      const token = hashParams.get('access_token') || hashParams.get('token') || searchParams.get('token')
      const email = hashParams.get('email') || searchParams.get('email')
      const type = hashParams.get('type') || searchParams.get('type')

      // Supabase magic links automatically create a session when the user clicks the link
      // So we should check if we have a session first
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      
      setVerificationState({
        status: 'loading',
        title: 'Verifying your email...',
        message: 'Please wait while we verify your email address.',
        icon: Loader2,
        iconColor: 'text-nest-mint',
        iconBgColor: 'bg-nest-mint/10',
        buttonColor: 'bg-slate-600 hover:bg-slate-700',
        buttonHoverColor: 'hover:bg-slate-700'
      })

      // Check if session already exists (Supabase handles this automatically)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (session && !sessionError) {
        // Session exists, verification successful
        setVerificationState({
          status: 'success',
          title: 'Email verified — you\'re signed in!',
          message: 'Your email has been verified and you\'re now signed in. You can now post your brief or browse the market.',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          iconBgColor: 'bg-green-100',
          buttonColor: 'bg-primary hover:bg-[#7A9A3A]',
          buttonHoverColor: 'hover:bg-[#7A9A3A]'
        })
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/market')
        }, 2000)
        return
      }

      // If no session and we have a token, try explicit verification
      if (token && email) {
        try {
          await verifyOtp(email, token)
          setVerificationState({
            status: 'success',
            title: 'You\'re signed in!',
            message: 'Welcome to NestFinder! Your email has been verified and you\'re ready to start.',
            icon: CheckCircle,
            iconColor: 'text-nest-mint',
            iconBgColor: 'bg-nest-mint/10',
            buttonColor: 'bg-nest-mint hover:bg-nest-mintHover',
            buttonHoverColor: 'hover:bg-nest-mintHover'
          })
          // Redirect after a short delay
          setTimeout(() => {
            router.push('/market')
          }, 2000)
        } catch (error: any) {
          console.error('Verification error:', error)
          setVerificationState({
            status: 'invalid',
            title: 'Verification failed',
            message: error.message || 'The verification link appears to be invalid or expired. Please try signing in again.',
            icon: XCircle,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100',
            buttonColor: 'bg-red-600 hover:bg-red-700',
            buttonHoverColor: 'hover:bg-red-700'
          })
        }
        return
      }

      // No token or session found - check if we're just waiting
      // Sometimes Supabase needs a moment to process
      setTimeout(async () => {
        const { data: { session: retrySession } } = await supabase.auth.getSession()
        if (retrySession) {
          setVerificationState({
            status: 'success',
            title: 'You\'re signed in!',
            message: 'Welcome to NestFinder! Your email has been verified and you\'re ready to start.',
            icon: CheckCircle,
            iconColor: 'text-nest-mint',
            iconBgColor: 'bg-nest-mint/10',
            buttonColor: 'bg-nest-mint hover:bg-nest-mintHover',
            buttonHoverColor: 'hover:bg-nest-mintHover'
          })
          setTimeout(() => {
            router.push('/market')
          }, 2000)
        } else {
          // No token found
          setVerificationState({
            status: 'invalid',
            title: 'Invalid verification link',
            message: 'The verification link is missing required information. Please try signing in again.',
            icon: XCircle,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100',
            buttonColor: 'bg-red-600 hover:bg-red-700',
            buttonHoverColor: 'hover:bg-red-700'
          })
        }
      }, 1000)
    }

    handleVerification()
  }, [searchParams, router])

  if (!verificationState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-nest-mint animate-spin mx-auto mb-3" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  const IconComponent = verificationState.icon
  const isSuccess = verificationState.status === 'success'
  const isExpired = verificationState.status === 'expired'
  const isLoading = verificationState.status === 'loading'

  return (
    <div className="w-full py-8 sm:py-12">
      <div className="max-w-lg mx-auto px-3 sm:px-4 lg:px-8 w-full">
        {/* Verification Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center animate-fade-in">
          {/* Icon */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 ${verificationState.iconBgColor} rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 ${
            isLoading ? 'animate-pulse' : 'animate-scale-in'
          }`}>
            {isLoading ? (
              <Loader2 className={`w-8 h-8 sm:w-10 sm:h-10 ${verificationState.iconColor} animate-spin`} />
            ) : (
              <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${verificationState.iconColor}`} />
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-3 sm:mb-4">
            {verificationState.title}
          </h1>

          {/* Message */}
          <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto">
            {verificationState.message}
          </p>

          {/* Success-specific content */}
          {isSuccess && (
            <div className="bg-nest-sageBg rounded-lg p-4 sm:p-5 mb-6 sm:mb-8 border border-nest-line">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-nest-mint" />
                  <span>Ready to get started</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-nest-mint" />
                  <span>Email verified</span>
                </div>
              </div>
            </div>
          )}

          {/* Expired-specific content */}
          {isExpired && (
            <div className="bg-amber-50 rounded-lg p-4 sm:p-5 mb-6 sm:mb-8 border border-amber-200">
              <p className="text-xs sm:text-sm text-amber-800 mb-2 font-medium">
                Why did this happen?
              </p>
              <p className="text-xs sm:text-sm text-amber-700 text-left">
                Magic links expire after 1 hour for security. This helps protect your account from unauthorized access.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {!isLoading && (
            <div className="space-y-3">
              {isSuccess && (
                <>
                  <PrimaryButton asChild className="w-full text-sm sm:text-base">
                    <Link href="/dashboard">
                      Go to dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </PrimaryButton>
                  
                  <GhostButton asChild className="w-full text-sm sm:text-base">
                    <Link href="/market">
                      Browse market
                    </Link>
                  </GhostButton>
                </>
              )}

              {isExpired && (
                <>
                  <PrimaryButton asChild className="w-full text-sm sm:text-base">
                    <Link href="/signin">
                      <Mail className="w-4 h-4 mr-2" />
                      Request new magic link
                    </Link>
                  </PrimaryButton>
                  
                  <GhostButton asChild className="w-full text-sm sm:text-base">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Go home
                    </Link>
                  </GhostButton>
                </>
              )}

              {verificationState.status === 'invalid' && (
                <>
                  <PrimaryButton asChild className="w-full text-sm sm:text-base">
                    <Link href="/signin">
                      Try signing in again
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </PrimaryButton>
                  
                  <GhostButton asChild className="w-full text-sm sm:text-base">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Go home
                    </Link>
                  </GhostButton>
                </>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm sm:text-base">Verifying...</span>
            </div>
          )}
        </div>

        {/* Additional Help */}
        {!isSuccess && !isLoading && (
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              Need help?{' '}
              <Link 
                href="/contact" 
                className="text-nest-mint hover:text-nest-mintHover transition-colors font-medium"
              >
                Contact support
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

