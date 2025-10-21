import { TrendingUp, Users, Shield } from 'lucide-react'

const trustItems = [
  {
    icon: TrendingUp,
    label: 'Demand-first',
    description: 'See real buyer interest'
  },
  {
    icon: Users,
    label: 'Direct connections',
    description: 'Connect without middlemen'
  },
  {
    icon: Shield,
    label: 'Free to start',
    description: 'No upfront costs'
  }
]

export default function TrustStrip() {
  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div key={index} className="flex items-center justify-center md:justify-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-dark text-sm">
                    {item.label}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
