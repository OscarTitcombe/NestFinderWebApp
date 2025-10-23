'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home } from 'lucide-react'
import { PrimaryButton, GhostButton } from '@/components/Buttons'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-nest-sageBg flex items-center justify-center">
      <div className="nf-container">
        <div className="text-center max-w-2xl mx-auto">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Something went wrong.
          </h1>
          
          {/* Subtext */}
          <p className="text-lg text-slate-600 mb-8">
            We're sorry, but something unexpected happened. Please try again or return to the homepage.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton onClick={reset}>
              Try again
            </PrimaryButton>
            
            <GhostButton asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go home
              </Link>
            </GhostButton>
          </div>

          {/* Error Details (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                Error details (development only)
              </summary>
              <div className="mt-4 p-4 bg-slate-100 rounded-lg">
                <pre className="text-xs text-slate-600 whitespace-pre-wrap">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

