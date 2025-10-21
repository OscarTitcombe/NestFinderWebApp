import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 section-light">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-dark mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-600 mb-12">
            Choose your path to connect in the property market
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* For Sellers */}
            <Link 
              href="/for-sellers"
              className="group block p-8 bg-white rounded-2xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-dark">For Sellers</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Browse real buyer demand in your area and connect directly with interested buyers.
              </p>
              <div className="flex items-center text-primary font-medium group-hover:text-[#7A9A3A] transition-colors">
                Start browsing demand
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* For Buyers */}
            <Link 
              href="/for-buyers"
              className="group block p-8 bg-white rounded-2xl border border-slate-200 hover:border-accent hover:shadow-lg transition-all duration-200 text-left"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4 group-hover:bg-accent/20 transition-colors">
                  <Home className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-dark">For Buyers</h3>
              </div>
              <p className="text-slate-600 mb-6">
                Post your property brief and let sellers find you. No more cold calling or endless searching.
              </p>
              <div className="flex items-center text-accent font-medium group-hover:text-[#D18B4A] transition-colors">
                Post your brief
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
