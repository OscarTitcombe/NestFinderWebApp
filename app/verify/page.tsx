'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Home } from 'lucide-react'
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
            title: 'That link has expired',
            message: 'Email verification links expire after a short time for security. Please request a new magic link.',
            icon: AlertTriangle,
            iconColor: 'text-yellow-600',
            iconBgColor: 'bg-yellow-100',
            buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
            buttonHoverColor: 'hover:bg-yellow-700'
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
        icon: CheckCircle,
        iconColor: 'text-slate-600',
        iconBgColor: 'bg-slate-100',
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
            title: 'Email verified — you\'re signed in!',
            message: 'Your email has been verified and you\'re now signed in. You can now post your brief or browse the market.',
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
            buttonColor: 'bg-primary hover:bg-[#7A9A3A]',
            buttonHoverColor: 'hover:bg-[#7A9A3A]'
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
      <div className="min-h-screen bg-nest-sageBg flex items-center justify-center">
        <div className="nf-container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nest-mint mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  const IconComponent = verificationState.icon

  return (
    <div className="min-h-screen bg-nest-sageBg flex items-center justify-center">
      <div className="nf-container">
        <div className="max-w-md mx-auto">
          {/* Verification Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-nest-line p-8 text-center">
            {/* Icon */}
            <div className={`w-16 h-16 ${verificationState.iconBgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <IconComponent className={`w-8 h-8 ${verificationState.iconColor}`} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              {verificationState.title}
            </h1>

            {/* Message */}
            <p className="text-slate-600 mb-8 leading-relaxed">
              {verificationState.message}
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              {verificationState.status === 'success' && (
                <>
                  <PrimaryButton asChild className="w-full">
                    <Link href="/market">
                      Browse market
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </PrimaryButton>
                  
                  <GhostButton asChild className="w-full">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Link>
                  </GhostButton>
                </>
              )}

              {verificationState.status === 'expired' && (
                <>
                  <PrimaryButton 
                    asChild
                    className="w-full"
                  >
                    <Link href="/signin">
                      Request new magic link
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </PrimaryButton>
                  
                  <GhostButton asChild className="w-full">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Link>
                  </GhostButton>
                </>
              )}

              {verificationState.status === 'invalid' && (
                <>
                  <PrimaryButton asChild className="w-full">
                    <Link href="/signin">
                      Try signing in again
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </PrimaryButton>
                  
                  <GhostButton asChild className="w-full">
                    <Link href="/">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Link>
                  </GhostButton>
                </>
              )}

              {verificationState.status === 'loading' && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-nest-mint mr-3"></div>
                  <span className="text-slate-600">Verifying...</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Help */}
          {verificationState.status !== 'success' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Need help?{' '}
                <a 
                  href="/contact" 
                  className="text-primary hover:text-[#7A9A3A] transition-colors font-medium"
                >
                  Contact support
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

