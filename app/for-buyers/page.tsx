import Link from 'next/link'
import { FileText, Shield, Mail, Users, Home, CheckCircle } from 'lucide-react'
import { PrimaryButton, GhostButton } from '@/components/Buttons'

const steps = [
  {
    icon: FileText,
    title: 'Post your brief',
    description: 'Budget, bedrooms, area',
    details: 'Tell us exactly what you\'re looking for and where you want to buy.'
  },
  {
    icon: Users,
    title: 'Verified sellers see your request',
    description: 'Sellers browse by postcode',
    details: 'Property owners in your areas can see your requirements and contact you directly.'
  },
  {
    icon: Mail,
    title: 'Receive intros via secure email relay',
    description: 'No spam, no phone sharing',
    details: 'Get messages from interested sellers through our private relay.'
  }
]

const benefits = [
  {
    icon: Shield,
    title: 'Privacy Protected',
    description: 'Your contact details stay private until you choose to share them.'
  },
  {
    icon: Home,
    title: 'Quality Matches',
    description: 'Only verified sellers can see and respond to your brief.'
  },
  {
    icon: CheckCircle,
    title: 'No Spam',
    description: 'Secure email relay prevents unwanted contact and protects your inbox.'
  }
]

export default function ForBuyersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-nest-sageBg">
        <div className="nf-container py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            House-hunt anonymously.
          </h1>
          
          <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
            Post your brief and get matched with off-market sellers — before listings go public.
          </p>

          <div className="mt-8">
            <PrimaryButton asChild>
              <Link href="/buy">
                Create your private brief
              </Link>
            </PrimaryButton>
            
            <Link
              href="#how-it-works"
              className="text-nest-sea hover:underline block mt-2"
            >
              Learn how it works
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white">
        <div className="nf-container py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to connect with the right sellers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={index} className="rounded-2xl border border-nest-line bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-nest-sageBg text-nest-mint mb-3">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
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
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-nest-sageBg">
        <div className="nf-container py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Why choose NestFinder?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
            We've designed the process to be safe, simple, and effective for buyers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div key={index} className="rounded-2xl border border-nest-line bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-400 mb-3">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-nest-sageAlt">
        <div className="nf-container py-14 sm:py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Ready to find your match?
          </h2>
          <p className="mt-2 text-slate-600">
            Post your brief today and let sellers come to you
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <PrimaryButton asChild>
              <Link href="/buy">
                Create your private brief
              </Link>
            </PrimaryButton>
            
            <GhostButton asChild className="ml-3 mt-3 sm:mt-0">
              <Link href="/market">
                Explore pre-market
              </Link>
            </GhostButton>
          </div>
        </div>
      </section>
    </div>
  )
}
