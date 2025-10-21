import Link from 'next/link'
import { Mail, Home } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto">
          {/* Coming Soon Icon */}
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-dark mb-4">
            Sign-in with magic links coming soon.
          </h1>
          
          {/* Subtext */}
          <p className="text-lg text-slate-600 mb-8">
            We're working on a seamless sign-in experience. For now, you can browse buyer demand and post your brief without an account.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/market"
              className="btn-primary inline-flex items-center justify-center"
            >
              Browse market
            </Link>
            
            <Link
              href="/buy"
              className="inline-flex items-center justify-center px-6 py-3 text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors"
            >
              Post your brief
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
