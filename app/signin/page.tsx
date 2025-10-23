import Link from 'next/link'
import { Mail, Home } from 'lucide-react'
import { PrimaryButton, GhostButton } from '@/components/Buttons'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-nest-sageBg flex items-center justify-center">
      <div className="nf-container">
        <div className="text-center max-w-2xl mx-auto">
          {/* Coming Soon Icon */}
          <div className="w-20 h-20 bg-nest-mint/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-nest-mint" />
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Sign-in with magic links coming soon.
          </h1>
          
          {/* Subtext */}
          <p className="text-lg text-slate-600 mb-8">
            We're working on a seamless sign-in experience. For now, you can browse buyer demand and post your brief without an account.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton asChild>
              <Link href="/market">
                Browse market
              </Link>
            </PrimaryButton>
            
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

