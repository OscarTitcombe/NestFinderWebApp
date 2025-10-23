'use client'

import PostcodeSearch from './PostcodeSearch'

export default function Hero() {
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
            Private, pre-market, home discovery
          </h1>
          
          {/* Subheading */}
          <p className="mt-3 text-lg sm:text-xl text-[#2B3135]">
            Find real buyers before you list — or sellers before they go live. NestFinder connects people quietly, before the market does.
          </p>

          {/* Postcode Search with depth */}
          <div className="mt-6">
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-nest-line bg-white shadow-sm p-2 sm:p-3">
              <PostcodeSearch 
                buttonLabel="Explore your area"
              />
            </div>
            
            {/* Social proof */}
            <p className="mt-3 text-sm text-slate-600">
              Join 1,200+ buyers and sellers exploring off-market homes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}