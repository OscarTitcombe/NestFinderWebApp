'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${
      isHome 
        ? 'bg-white border-b border-slate-200' 
        : 'bg-white/90 backdrop-blur shadow-sm'
    }`}>
      <div className="nf-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-[#101314] hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg"
          >
            NestFinder
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/market" 
              className="text-slate-600 hover:text-[#101314] transition-colors font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg px-2 py-1"
            >
              Explore your area
            </Link>
            <Link 
              href="/for-buyers" 
              className="text-slate-600 hover:text-[#101314] transition-colors font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg px-2 py-1"
            >
              For Buyers
            </Link>
            <Link 
              href="/for-sellers" 
              className="text-slate-600 hover:text-[#101314] transition-colors font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg px-2 py-1"
            >
              For Sellers
            </Link>
            <Link 
              href="/signin" 
              className="text-slate-600 hover:text-[#101314] transition-colors font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg px-2 py-1"
            >
              Sign in
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-slate-600 hover:text-[#101314] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg p-2"
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
