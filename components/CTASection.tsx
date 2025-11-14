import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { PrimaryButton } from './Buttons'

export default function CTASection() {
  return (
    <section className="relative py-16 sm:py-20">
      {/* Background Map Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/mapforexploreyourarea.png')"
        }}
      ></div>
      
      {/* White overlay for readability - same opacity as homepage */}
      <div className="absolute inset-0 bg-white/70" aria-hidden="true" />
      
      <div className="relative nf-container">
        <div className="text-center max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* For Buyers */}
            <div className="rounded-2xl border border-nest-line bg-white p-6 shadow-sm hover:shadow-md transition">
              <h3 className="font-semibold text-[#101314] mb-2">For Buyers</h3>
              <p className="text-sm text-slate-600 mb-4">
                Post your property brief and let sellers find you. Connect privately and explore your options.
              </p>
              <PrimaryButton asChild className="!bg-nest-sea hover:!bg-nest-seaHover focus-visible:!ring-nest-sea">
                <Link href="/buy">
                  Create your private brief
                </Link>
              </PrimaryButton>
            </div>

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
          </div>
        </div>
      </div>
    </section>
  )
}
