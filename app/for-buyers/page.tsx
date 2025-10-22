import Link from 'next/link'
import { FileText, Shield, Mail, Users, Home, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: 1,
    icon: FileText,
    title: 'Post your brief',
    description: 'Budget, bedrooms, area',
    details: 'Tell us exactly what you\'re looking for and where you want to buy.'
  },
  {
    number: 2,
    icon: Users,
    title: 'Verified sellers see your request',
    description: 'Sellers browse by postcode',
    details: 'Property owners in your areas can see your requirements and contact you directly.'
  },
  {
    number: 3,
    icon: Mail,
    title: 'Receive intros via secure email relay',
    description: 'No spam, no phone sharing',
    details: 'Get messages from interested sellers through our secure email system.'
  }
]

const benefits = [
  {
    icon: Shield,
    title: 'Privacy Protected',
    description: 'Your contact details stay private until you choose to share them'
  },
  {
    icon: Home,
    title: 'Quality Matches',
    description: 'Only verified sellers can see and respond to your brief'
  },
  {
    icon: CheckCircle,
    title: 'No Spam',
    description: 'Secure email relay prevents unwanted contact and protects your inbox'
  }
]

export default function ForBuyersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-light py-16 sm:py-24">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="heading-primary mb-6">
              House-hunt anonymously.
            </h1>
            
            <p className="subheading max-w-2xl mx-auto mb-8">
              Post your brief and get matched with off-market sellers — before listings go public.
            </p>

            <Link
              href="/buy"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center"
            >
              Create your private brief
              <FileText className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to connect with the right sellers
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
                    <p className="text-primary font-medium mb-2">
                      {step.description}
                    </p>
                    <p className="text-slate-600 text-sm">
                      {step.details}
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

      {/* Benefits Section */}
      <section className="py-16 section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-4">
              Why choose NestFinder?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've designed the process to be safe, simple, and effective for buyers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div key={index} className="card group hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-4">
              Ready to find your perfect property?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Post your brief today and let sellers come to you
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/buy"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
              >
                Create your private brief
                <FileText className="w-5 h-5 ml-2" />
              </Link>
              
              <Link
                href="/market"
                className="inline-flex items-center justify-center px-8 py-4 text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors"
              >
                Explore pre-market
                <Home className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
