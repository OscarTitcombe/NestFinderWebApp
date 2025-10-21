'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-dark hover:text-primary transition-colors">
            NestFinder
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/market" 
              className="text-slate-600 hover:text-dark transition-colors font-medium"
            >
              Explore pre-market
            </Link>
            <Link 
              href="/for-buyers" 
              className="text-slate-600 hover:text-dark transition-colors font-medium"
            >
              For Buyers
            </Link>
            <Link 
              href="/for-sellers" 
              className="text-slate-600 hover:text-dark transition-colors font-medium"
            >
              For Sellers
            </Link>
            <Link 
              href="/signin" 
              className="text-slate-600 hover:text-dark transition-colors font-medium"
            >
              Sign in
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-slate-600 hover:text-dark transition-colors"
              aria-label="Open mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
