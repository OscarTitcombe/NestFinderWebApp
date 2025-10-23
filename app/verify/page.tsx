'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertTriangle, XCircle, ArrowRight, Home } from 'lucide-react'
import { PrimaryButton, GhostButton } from '@/components/Buttons'

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
  const [verificationState, setVerificationState] = useState<VerificationState | null>(null)

  useEffect(() => {
    const status = searchParams.get('status') as VerificationStatus
    
    const states: Record<VerificationStatus, VerificationState> = {
      success: {
        status: 'success',
        title: 'Email verified — your brief is now visible.',
        message: 'Your property brief has been verified and is now live on the market. Sellers can now see your requirements and contact you directly.',
        icon: CheckCircle,
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100',
        buttonColor: 'bg-primary hover:bg-[#7A9A3A]',
        buttonHoverColor: 'hover:bg-[#7A9A3A]'
      },
      expired: {
        status: 'expired',
        title: 'That link has expired. Request a new one.',
        message: 'Email verification links expire after 24 hours for security. Please request a new verification email to activate your property brief.',
        icon: AlertTriangle,
        iconColor: 'text-yellow-600',
        iconBgColor: 'bg-yellow-100',
        buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
        buttonHoverColor: 'hover:bg-yellow-700'
      },
      invalid: {
        status: 'invalid',
        title: 'That link looks invalid.',
        message: 'The verification link you clicked appears to be corrupted or malformed. Please check your email for the correct verification link.',
        icon: XCircle,
        iconColor: 'text-red-600',
        iconBgColor: 'bg-red-100',
        buttonColor: 'bg-red-600 hover:bg-red-700',
        buttonHoverColor: 'hover:bg-red-700'
      },
      loading: {
        status: 'loading',
        title: 'Verifying your email...',
        message: 'Please wait while we verify your email address.',
        icon: CheckCircle,
        iconColor: 'text-slate-600',
        iconBgColor: 'bg-slate-100',
        buttonColor: 'bg-slate-600 hover:bg-slate-700',
        buttonHoverColor: 'hover:bg-slate-700'
      }
    }

    if (status && states[status]) {
      setVerificationState(states[status])
    } else {
      // Default to invalid if no status or unrecognized status
      setVerificationState(states.invalid)
    }
  }, [searchParams])

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
                  <PrimaryButton className="w-full">
                    Request new verification
                    <ArrowRight className="w-4 h-4 ml-2" />
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
                    <Link href="/buy">
                      Post your brief again
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

