'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signOut } from '@/lib/supabase/auth'
import { useAuth } from '@/lib/auth-context'
import { User, LogOut, Menu, X, Shield } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { user, isLoading } = useAuth()

  // Check admin status
  useEffect(() => {
    if (user) {
      fetch('/api/admin/check')
        .then(res => res.json())
        .then(data => setIsAdmin(data.isAdmin || false))
        .catch(() => setIsAdmin(false))
    } else {
      setIsAdmin(false)
    }
  }, [user])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen && !(event.target as Element).closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsUserMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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
            className="flex items-center text-[27px] font-bold text-[#689674] focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg"
          >
            <span>NestFinder</span>
            <div 
              className="-ml-3 w-[60px] h-[60px]"
              style={{ 
                backgroundColor: '#689674',
                maskImage: 'url(/nestfinderlogo4.png)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskImage: 'url(/nestfinderlogo4.png)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center'
              }}
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
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
            
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-1"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 animate-scale-in">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/inbox"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Inbox
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors flex items-center space-x-2"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/signin" 
                className="text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-1"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <Link
                href="/dashboard"
                className="p-2 text-slate-600 hover:text-nest-sea transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-nest-sea transition-colors focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg p-2"
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
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
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="block text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/inbox" 
                    className="block text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Inbox
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="block text-purple-700 hover:text-purple-800 transition-colors font-medium focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none rounded-lg px-2 py-2 flex items-center space-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full text-left text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-2"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link 
                  href="/signin" 
                  className="block text-slate-600 hover:text-nest-sea transition-colors font-medium focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:outline-none rounded-lg px-2 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
