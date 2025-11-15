'use client'

import { TrendingUp, Users, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const trustItems = [
  {
    icon: TrendingUp,
    label: 'Private by default',
    description: 'No spam, secure connections'
  },
  {
    icon: Users,
    label: 'Real demand',
    description: 'Every brief is verified'
  },
  {
    icon: Shield,
    label: 'Pre-market first',
    description: 'Discover interest before listings go public'
  }
]

export default function TrustStrip() {
  return (
    <motion.section 
      className="bg-nest-sageBg py-10 sm:py-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="nf-container">
        {/* Label */}
        <div className="text-center mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Why NestFinder
          </p>
        </div>
        
        {/* Trust items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-3">
                  <IconComponent className="h-5 w-5 text-nest-mint" />
                </div>
                <h3 className="font-medium text-[#101314] mb-1">
                  {item.label}
                </h3>
                <p className="text-sm text-slate-600">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}