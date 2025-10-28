import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { PrimaryButton } from './Buttons'

export default function CTASection() {
  return (
    <section className="bg-nest-sageAlt py-16 sm:py-20">
      <div className="nf-container">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#101314] text-center">
            Check pre-market demand near you.
          </h2>
          <p className="mt-2 text-slate-600">
            Explore interest before listings go live.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
            {/* For Sellers */}
            <div className="rounded-2xl border border-nest-line bg-white p-6 shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-[#101314] mb-2">For Sellers</h3>
              <p className="text-sm text-slate-600 mb-4">
                Browse real buyer demand in your area and connect privately with interested buyers.
              </p>
              <PrimaryButton asChild>
                <Link href="/market">
                  Explore pre-market demand
                </Link>
              </PrimaryButton>
            </div>

            {/* For Buyers */}
            <div className="rounded-2xl border border-nest-line bg-white p-6 shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-[#101314] mb-2">For Buyers</h3>
              <p className="text-sm text-slate-600 mb-4">
                Post your property brief and let sellers find you. Connect privately and explore your options.
              </p>
              <PrimaryButton asChild>
                <Link href="/buy">
                  Create your private brief
                </Link>
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
