'use client'

import { useState, useEffect } from 'react'
import HeroCtaTabs from './HeroCtaTabs'

type Mode = 'buyer' | 'seller'

export default function Hero() {
  const [mode, setMode] = useState<Mode>('buyer')

  // Initialize mode from URL or localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const urlMode = params.get('mode')
    
    if (urlMode === 'buyer' || urlMode === 'seller') {
      setMode(urlMode)
    } else {
      const savedMode = localStorage.getItem('nestfinder_mode') as Mode | null
      if (savedMode === 'buyer' || savedMode === 'seller') {
        setMode(savedMode)
      }
    }
  }, [])

  return (
    <section className="relative">
      {/* Background Map Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/map-background.png')"
        }}
      ></div>
      
      {/* White overlay for readability */}
      <div className="absolute inset-0 bg-white/70" aria-hidden="true" />
      
      {/* Bottom fade to blend into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-nest-sageBg" />

      <div className="relative nf-container pt-20 sm:pt-24 lg:pt-28 pb-20 text-center">
        <div className="text-center max-w-2xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#101314]">
            NestFinder
          </h1>
          
          {/* Subheading */}
          <p className="mt-3 text-lg sm:text-xl text-[#2B3135]">
            {mode === 'buyer' 
              ? "Upload your property brief and let homeowners come to you."
              : "Browse buyer interest in your area before going to market."
            }
          </p>

          {/* Tabbed CTA */}
          <div className="mt-8">
            <HeroCtaTabs onModeChange={setMode} initialMode={mode} />
          </div>
        </div>
      </div>
    </section>
  )
}