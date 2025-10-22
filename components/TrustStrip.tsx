'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Shield } from 'lucide-react'

const trustItems = [
  {
    icon: TrendingUp,
    label: 'Private by default',
    description: 'No spam, no agents'
  },
  {
    icon: Users,
    label: 'Real demand',
    description: 'Every brief is verified'
  },
  {
    icon: Shield,
    label: 'Off-market first',
    description: 'Discover homes before they\'re public'
  }
]

export default function TrustStrip() {
  return (
    <section className="bg-[#F9FAFB] py-8">
      <div className="nf-container">
        {/* Label */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-4"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Why NestFinder
          </p>
        </motion.div>
        
        {/* Trust items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-3">
                  <IconComponent className="h-5 w-5 text-[#B2BEA4]" />
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
    </section>
  )
}
