'use client'

import { motion } from 'framer-motion'
import PostcodeSearch from './PostcodeSearch'

export default function Hero() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="nf-container">
        <div className="text-center max-w-2xl mx-auto">
          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[#101314]"
          >
            Private, pre-market, home discovery
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-3 text-lg sm:text-xl text-[#2B3135]"
          >
            Find real buyers before you list — or sellers before they go live. NestFinder connects people quietly, before the market does.
          </motion.p>

          {/* Postcode Search with depth */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8"
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6 max-w-lg mx-auto">
              <PostcodeSearch 
                buttonLabel="Explore your area"
              />
            </div>
            
            {/* Social proof */}
            <p className="mt-3 text-sm text-slate-500">
              Join 1,200+ buyers and sellers exploring off-market homes.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
