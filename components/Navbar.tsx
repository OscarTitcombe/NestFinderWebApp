'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            className="text-2xl font-bold text-[#101314] hover:text-nest-mint transition-colors focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg"
          >
            NestFinder
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/market" 
              className="text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-1"
            >
              Explore your area
            </Link>
            <Link 
              href="/for-buyers" 
              className="text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-1"
            >
              For Buyers
            </Link>
            <Link 
              href="/for-sellers" 
              className="text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-1"
            >
              For Sellers
            </Link>
            <Link 
              href="/signin" 
              className="text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-1"
            >
              Sign in
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-nest-sea transition-colors focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg p-2"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="nf-container py-4 space-y-4">
              <Link 
                href="/market" 
                className="block text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore your area
              </Link>
              <Link 
                href="/for-buyers" 
                className="block text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                For Buyers
              </Link>
              <Link 
                href="/for-sellers" 
                className="block text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                For Sellers
              </Link>
              <Link 
                href="/signin" 
                className="block text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
