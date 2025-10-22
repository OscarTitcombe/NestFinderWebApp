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
              <div key={index} className="text-center flex flex-col h-full">
                {/* Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-dark mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">
                    {step.description}
                  </p>
                </div>

                {/* Step Number - Fixed at bottom */}
                <div className="w-16 h-16 bg-primary/80 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mt-6">
                  {step.number}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
