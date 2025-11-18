'use client'

import { Home, Share2, Shield, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Home,
    title: 'For Sellers',
    bullets: [
      'Browse buyer interest in your area — see who\'s already looking for a home like yours before you list'
    ]
  },
  {
    icon: Share2,
    title: 'For Buyers',
    bullets: [
      'Upload your property brief and let homeowners come to you. Tell us what you\'re searching for and get matched with sellers exploring interest'
    ]
  },
  {
    icon: MapPin,
    title: 'Anonymous connections',
    bullets: [
      'Your contact details stay private until you choose to share'
    ]
  },
  {
    icon: Shield,
    title: 'Smart matching',
    bullets: [
      'We score every match by location, price, and type — so you only see what fits'
    ]
  }
]

export default function FeatureGrid() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="nf-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101314] mb-4">
            How NestFinder works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Browse buyer interest in your area or upload your property brief. Connect buyers and sellers before properties are listed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div 
                key={index} 
                className="rounded-2xl border border-nest-line bg-white p-6 shadow-sm hover:shadow-md transition"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon pill */}
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-nest-sageBg text-nest-mint mb-3 flex-shrink-0">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-[#101314] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {feature.bullets[0]}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}