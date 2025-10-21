import { FileText, Search, Mail } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: FileText,
    title: 'Buyers post their brief',
    description: 'Budget, bedrooms, areas'
  },
  {
    number: 2,
    icon: Search,
    title: 'Sellers search by postcode',
    description: 'See real demand nearby'
  },
  {
    number: 3,
    icon: Mail,
    title: 'Connect via secure email relay',
    description: 'No phone numbers shown'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-4">
            How it works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three simple steps to connect buyers and sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div key={index} className="text-center">
                <div className="relative">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 relative z-10">
                    {step.number}
                  </div>
                  
                  {/* Connecting Line (hidden on last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 -z-10">
                      <div className="absolute right-0 top-0 w-1/2 h-full bg-primary"></div>
                    </div>
                  )}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-dark mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
