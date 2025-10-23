import Link from 'next/link'
import { Search, Eye, Mail, MapPin, DollarSign, Shield, HelpCircle } from 'lucide-react'
import { PrimaryButton, GhostButton } from '@/components/Buttons'

const steps = [
  {
    number: 1,
    icon: Search,
    title: 'Search your postcode',
    description: 'Enter your area to see demand',
    details: 'Browse buyer interest in your specific postcode areas.'
  },
  {
    number: 2,
    icon: Eye,
    title: 'View real buyer interest',
    description: 'See what buyers are looking for',
    details: 'Check budgets, requirements, and property types in your area.'
  },
  {
    number: 3,
    icon: Mail,
    title: 'Send an intro if you have a match',
    description: 'Connect directly with buyers',
    details: 'Message interested buyers through our secure email system.'
  }
]

const benefits = [
  {
    icon: DollarSign,
    title: 'No Commission Fees',
    description: 'Save thousands by cutting out estate agent fees'
  },
  {
    icon: Shield,
    title: 'Direct Contact',
    description: 'Connect with buyers without middlemen'
  },
  {
    icon: MapPin,
    title: 'Local Demand',
    description: 'See exactly what buyers want in your area'
  }
]

const faqs = [
  {
    question: 'Do I need an estate agent?',
    answer: 'No — you can contact buyers privately. NestFinder connects you with verified buyers in your area, eliminating the need for traditional estate agents and their fees.'
  },
  {
    question: 'Is it free?',
    answer: 'Yes, posting and browsing are free while we\'re in beta. You can search buyer demand and contact interested buyers at no cost.'
  }
]

export default function ForSellersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-nest-sageBg py-16 sm:py-24">
        <div className="nf-container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              See real buyers — before you list.
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Join the pre-market. Connect privately, sell faster, skip the noise.
            </p>

            <PrimaryButton asChild>
              <Link href="/market">
                Explore your area
                <Search className="w-5 h-5 ml-2" />
              </Link>
            </PrimaryButton>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="nf-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to connect with buyers in your area
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={index} className="text-center flex flex-col h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-nest-mint/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-nest-mint" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-nest-mint font-medium mb-2">
                      {step.description}
                    </p>
                    <p className="text-slate-600 text-sm">
                      {step.details}
                    </p>
                  </div>

                  {/* Step Number - Fixed at bottom */}
                  <div className="w-16 h-16 bg-nest-mint text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mt-6">
                    {step.number}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-nest-sageBg">
        <div className="nf-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Why choose NestFinder?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We've designed the platform to save you money and time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div key={index} className="rounded-2xl border border-nest-line bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                      <IconComponent className="w-6 h-6 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">
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

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="nf-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Common questions about selling on NestFinder
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-2xl border border-nest-line bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-nest-mint/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <HelpCircle className="w-4 h-4 text-nest-mint" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-nest-sageAlt">
        <div className="nf-container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Ready to see buyer demand in your area?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Start browsing buyer interest and connect privately with potential buyers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton asChild>
                <Link href="/market">
                  Explore pre-market demand
                  <Search className="w-5 h-5 ml-2" />
                </Link>
              </PrimaryButton>
              
              <GhostButton asChild>
                <Link href="/">
                  Return to homepage
                </Link>
              </GhostButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
