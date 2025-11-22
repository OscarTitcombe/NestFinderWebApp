'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { normalizePostcode } from '@/lib/postcode'
import PostcodeSearch from '@/components/PostcodeSearch'
import FilterBar from '@/components/FilterBar'
import BuyerCard from '@/components/BuyerCard'
import ContactModal from '@/components/ContactModal'
import { getBuyerRequests } from '@/lib/supabase/queries'
import type { Database } from '@/lib/types/database'
import { MarketGridSkeleton } from '@/components/Skeletons'
import { analytics } from '@/lib/analytics'

type BuyerRequest = Database['public']['Tables']['buyer_requests']['Row']

interface Buyer {
  id: string
  budget: number
  budgetMin: number
  budgetMax: number
  minBeds: number
  maxBeds: number
  propertyType: string
  areas: string[]
  description: string
  postedDate: string
  email?: string // Buyer's email for notifications
}

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''} ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} week${Math.floor(diffInSeconds / 604800) > 1 ? 's' : ''} ago`
  return `${Math.floor(diffInSeconds / 2592000)} month${Math.floor(diffInSeconds / 2592000) > 1 ? 's' : ''} ago`
}

// Convert database buyer request to component buyer format
function convertBuyerRequest(request: BuyerRequest): Buyer {
  return {
    id: request.id,
    budget: request.budget_max, // Use max budget for display
    budgetMin: request.budget_min,
    budgetMax: request.budget_max,
    minBeds: request.beds_min,
    maxBeds: request.beds_max || request.beds_min,
    propertyType: request.property_type.charAt(0).toUpperCase() + request.property_type.slice(1),
    areas: request.postcode_districts,
    description: request.description,
    postedDate: formatRelativeTime(request.created_at),
    email: request.email // Include email for notifications
  }
}

function MarketPageContent() {
  const searchParams = useSearchParams()
  const [postcode, setPostcode] = useState<string | null>(null)
  const [normalizedPostcode, setNormalizedPostcode] = useState<string | null>(null)
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [filteredBuyers, setFilteredBuyers] = useState<Buyer[]>([])
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<{
    propertyType: string
    budget: string
    bedrooms: string
    timeframe: string
    features: string[]
  } | null>(null)

  // Fetch buyer requests from Supabase
  useEffect(() => {
    const fetchBuyers = async () => {
      if (!normalizedPostcode) return

      setIsLoading(true)
      setError(null)

      try {
        const requests = await getBuyerRequests(normalizedPostcode)
        const convertedBuyers = requests.map(convertBuyerRequest)
        setBuyers(convertedBuyers)
        setFilteredBuyers(convertedBuyers)
        
        // Track market page viewed
        analytics.marketPageViewed(normalizedPostcode, convertedBuyers.length)
      } catch (err: any) {
        console.error('Error fetching buyers:', err)
        setError('Failed to load buyer requests. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuyers()
  }, [normalizedPostcode])

  useEffect(() => {
    const postcodeParam = searchParams.get('postcode')
    const propertyType = searchParams.get('propertyType')
    const budget = searchParams.get('budget')
    const bedrooms = searchParams.get('bedrooms')
    const timeframe = searchParams.get('timeframe')
    const features = searchParams.get('features')

    if (postcodeParam) {
      const result = normalizePostcode(postcodeParam)
      if (result.ok && result.district) {
        setPostcode(postcodeParam)
        setNormalizedPostcode(result.district)
        
        // Set quiz answers if they exist
        if (propertyType && budget && bedrooms && timeframe && features) {
          setQuizAnswers({
            propertyType,
            budget,
            bedrooms,
            timeframe,
            features: features.split(',')
          })
        }
      }
    }
  }, [searchParams])

  const handleFilterChange = (filters: {
    minBudget: number
    maxBudget: number
    beds: number
    propertyType: string
  }) => {
    const filtered = buyers.filter(buyer => {
      return (
        buyer.budgetMax >= filters.minBudget &&
        buyer.budgetMin <= filters.maxBudget &&
        (filters.beds === 0 || (buyer.minBeds <= filters.beds && buyer.maxBeds >= filters.beds)) &&
        (filters.propertyType === 'Any' || buyer.propertyType.toLowerCase() === filters.propertyType.toLowerCase())
      )
    })
    setFilteredBuyers(filtered)
  }

  const handleContactBuyer = (buyer: Buyer) => {
    setSelectedBuyer(buyer)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedBuyer(null)
  }

  // Empty state - no postcode provided
  if (!postcode || !normalizedPostcode) {
    return (
      <div className="min-h-screen relative">
        {/* Background Map Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/mapforexploreyourarea.png')"
          }}
        ></div>
        
        {/* White overlay for readability - same opacity as homepage */}
        <div className="absolute inset-0 bg-white/70" aria-hidden="true" />
        
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-dark mb-4">
                Explore buyer interest
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Enter a postcode to see what buyers are looking for in your area
              </p>
              <div className="mx-auto max-w-xl rounded-2xl border border-nest-line bg-white shadow-sm p-2 sm:p-3">
                <PostcodeSearch 
                  buttonLabel="Browse buyer interest"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header with Background Map */}
      <section className="relative isolate">
        {/* Background Map Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/mapforexploreyourarea.png')"
          }}
        ></div>
        
        {/* White overlay for readability - same opacity as homepage */}
        <div className="absolute inset-0 bg-white/70" aria-hidden="true" />
        
        <div className="relative">
          <div className="container-custom py-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-2">
                Buyer interest near {normalizedPostcode}
              </h1>
              <p className="text-lg text-slate-600">
                {filteredBuyers.length} buyers looking in your area
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container-custom py-6">
          <FilterBar 
            onFilterChange={handleFilterChange} 
            initialValues={quizAnswers}
          />
        </div>
      </div>

      {/* Buyer Grid */}
      <div className="container-custom py-8">
        {isLoading ? (
          <MarketGridSkeleton count={6} />
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-dark mb-2">Error loading buyers</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try again
            </button>
          </div>
        ) : filteredBuyers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-dark mb-2">No buyers found</h3>
            <p className="text-slate-600">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuyers.map((buyer, index) => (
              <div
                key={buyer.id}
                style={{
                  animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                }}
              >
                <BuyerCard
                  buyer={buyer}
                  onContact={() => handleContactBuyer(buyer)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {isModalOpen && selectedBuyer && (
        <ContactModal
          buyer={selectedBuyer}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

export default function MarketPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-light">
        <div className="container-custom py-8">
          <MarketGridSkeleton count={6} />
        </div>
      </div>
    }>
      <MarketPageContent />
    </Suspense>
  )
}
