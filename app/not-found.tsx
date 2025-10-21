import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import PostcodeSearch from '@/components/PostcodeSearch'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Icon/Number */}
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="w-12 h-12 text-primary" />
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-dark mb-4">
            Can't find that page.
          </h1>
          
          {/* Subtext */}
          <p className="text-lg text-slate-600 mb-8">
            Try searching your postcode below.
          </p>

          {/* Postcode Search */}
          <div className="mb-8">
            <PostcodeSearch 
              buttonLabel="Browse buyer interest"
              className="max-w-md mx-auto"
            />
          </div>

          {/* Go Home Button */}
          <Link
            href="/"
            className="btn-primary inline-flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
