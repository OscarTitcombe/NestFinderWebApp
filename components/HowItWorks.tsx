'use client'

import { FileText, Search, Mail } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: FileText,
    title: 'Post privately',
    description: 'Share what you\'re looking for or what you might sell'
  },
  {
    number: 2,
    icon: Search,
    title: 'Get matched',
    description: 'See real demand and potential buyers in your area'
  },
  {
    number: 3,
    icon: Mail,
    title: 'Connect securely',
    description: 'Chat via email relay, no public listings or spam'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="nf-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101314] mb-4">
            How it works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three simple steps to connect buyers and sellers
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="absolute left-1/2 -translate-x-1/2 top-10 w-full max-w-4xl h-px bg-slate-200 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div 
                  key={index} 
                  className="text-center"
                >
                  {/* Number badge */}
                  <div className="h-10 w-10 rounded-full bg-nest-sageBg text-nest-sea flex items-center justify-center font-semibold mb-3 mx-auto">
                    {step.number}
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-semibold text-[#101314] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}