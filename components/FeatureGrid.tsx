'use client'

import { motion } from 'framer-motion'
import { Home, Share2, Shield, MapPin } from 'lucide-react'

const features = [
  {
    icon: Home,
    title: 'For Sellers',
    bullets: [
      'See who\'s already looking for a home like yours — before you list'
    ]
  },
  {
    icon: Share2,
    title: 'For Buyers',
    bullets: [
      'Tell us what you\'re searching for and get matched with off-market sellers'
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
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F7F9FC]">
      <div className="nf-container">
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101314] mb-4">
            How NestFinder works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A new way to connect buyers and sellers in the property market
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon pill */}
                  <div className="inline-flex items-center justify-center h-9 w-9 rounded-xl bg-[#F7F9FC] text-primary mb-3 flex-shrink-0">
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
