'use client'

import { useState, useEffect, useRef } from 'react'
import PostcodeSearch from './PostcodeSearch'

type Mode = 'buyer' | 'seller'

interface HeroCtaTabsProps {
  onModeChange?: (mode: Mode) => void
  initialMode?: Mode
}

// Analytics helper (fire functions if available; else console.log)
function trackEvent(event: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Check if analytics function exists (e.g., gtag, analytics, etc.)
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', event, data)
    } else if (typeof (window as any).analytics === 'function') {
      (window as any).analytics.track(event, data)
    } else {
      console.log(`[Analytics] ${event}`, data || {})
    }
  }
}

export default function HeroCtaTabs({ onModeChange, initialMode }: HeroCtaTabsProps = {}) {
  const [mode, setMode] = useState<Mode>(initialMode || 'buyer')
  const buyerTabRef = useRef<HTMLButtonElement>(null)
  const sellerTabRef = useRef<HTMLButtonElement>(null)

  // Initialize mode from URL or localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const urlMode = params.get('mode')
    
    let finalMode: Mode = initialMode || 'buyer'
    
    if (urlMode === 'buyer' || urlMode === 'seller') {
      finalMode = urlMode
    } else {
      // Fallback to localStorage
      const savedMode = localStorage.getItem('nestfinder_mode') as Mode | null
      if (savedMode === 'buyer' || savedMode === 'seller') {
        finalMode = savedMode
      }
    }
    
    setMode(finalMode)
    onModeChange?.(finalMode)
  }, [initialMode, onModeChange])

  // Update URL when mode changes
  const updateMode = (newMode: Mode) => {
    setMode(newMode)
    onModeChange?.(newMode)
    
    // Update URL without reload
    const url = new URL(window.location.href)
    url.searchParams.set('mode', newMode)
    window.history.pushState({}, '', url.toString())
    
    // Persist to localStorage
    localStorage.setItem('nestfinder_mode', newMode)
    
    // Track analytics
    trackEvent('cta_tab_selected', { mode: newMode })
  }

  // Handle keyboard navigation for tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, currentMode: Mode) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const newMode = currentMode === 'buyer' ? 'seller' : 'buyer'
      updateMode(newMode)
      // Focus the newly selected tab
      setTimeout(() => {
        if (newMode === 'buyer') {
          buyerTabRef.current?.focus()
        } else {
          sellerTabRef.current?.focus()
        }
      }, 0)
    }
  }

  const tabId = `tab-${mode}`
  const panelId = `panel-${mode}`

  return (
    <div className="max-w-xl mx-auto">
      {/* Tabs - separate island hovering above */}
      <div 
        role="tablist" 
        aria-label="Choose your role"
        className="inline-flex rounded-xl p-1 bg-white/70 backdrop-blur border border-nest-line shadow-sm mb-3"
      >
        <button
          ref={buyerTabRef}
          role="tab"
          id="tab-buyer"
          aria-selected={mode === 'buyer'}
          aria-controls="panel-buyer"
          tabIndex={mode === 'buyer' ? 0 : -1}
          onClick={() => updateMode('buyer')}
          onKeyDown={(e) => handleTabKeyDown(e, 'buyer')}
          className={`
            px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:ring-offset-2
            ${mode === 'buyer' 
              ? 'bg-white shadow text-[#101314] font-semibold' 
              : 'text-slate-600 hover:text-[#101314]'
            }
          `}
        >
          For Buyers
        </button>
        <button
          ref={sellerTabRef}
          role="tab"
          id="tab-seller"
          aria-selected={mode === 'seller'}
          aria-controls="panel-seller"
          tabIndex={mode === 'seller' ? 0 : -1}
          onClick={() => updateMode('seller')}
          onKeyDown={(e) => handleTabKeyDown(e, 'seller')}
          className={`
            px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nest-sea focus-visible:ring-offset-2
            ${mode === 'seller' 
              ? 'bg-white shadow text-[#101314] font-semibold' 
              : 'text-slate-600 hover:text-[#101314]'
            }
          `}
        >
          For Sellers
        </button>
      </div>

      {/* Content Panel */}
      <div 
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
      >
        {/* Postcode Search with depth */}
        <div className="mx-auto max-w-xl rounded-2xl border border-nest-line bg-white shadow-sm p-2 sm:p-3">
          <PostcodeSearch 
            buttonLabel={mode === 'buyer' ? "Create your brief" : "Explore your area"}
            mode={mode}
          />
        </div>
        
        {/* Social proof */}
        <p className="mt-3 text-sm text-slate-600">
          Join 1,200+ buyers and sellers exploring off-market homes.
        </p>
      </div>
    </div>
  )
}

