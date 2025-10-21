import { Home, Share2, Shield, MapPin } from 'lucide-react'

const features = [
  {
    icon: Home,
    title: 'For Sellers',
    bullets: [
      'Spot real demand by postcode',
      'Message buyers who fit your property'
    ]
  },
  {
    icon: Share2,
    title: 'For Buyers',
    bullets: [
      'Post your brief once',
      'Let sellers come to you'
    ]
  },
  {
    icon: MapPin,
    title: 'Simple Matching',
    bullets: [
      'Filters by budget, beds, and type',
      'Save time on cold outreach'
    ]
  },
  {
    icon: Shield,
    title: 'Privacy-first',
    bullets: [
      'Email relay protects your details',
      'No spam, no phone sharing'
    ]
  }
]

export default function FeatureGrid() {
  return (
    <section className="py-16 section-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-4">
            How NestFinder works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A new way to connect buyers and sellers in the property market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="card group hover:shadow-lg transition-all duration-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-dark mb-3">
                    {feature.title}
                  </h3>
                  <ul className="space-y-2">
                    {feature.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="text-sm text-slate-600 flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
