'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { normalizePostcode } from '@/lib/postcode'
import PostcodeSearch from '@/components/PostcodeSearch'
import FilterBar from '@/components/FilterBar'
import BuyerCard from '@/components/BuyerCard'
import ContactModal from '@/components/ContactModal'

interface Buyer {
  id: string
  budget: number
  minBeds: number
  maxBeds: number
  propertyType: string
  areas: string[]
  description: string
  postedDate: string
}

// Mock buyer data
const mockBuyers: Buyer[] = [
  {
    id: '1',
    budget: 450000,
    minBeds: 2,
    maxBeds: 3,
    propertyType: 'Flat',
    areas: ['SW1A', 'SW1B', 'SW1C'],
    description: 'Looking for a modern flat near transport links. Must have parking.',
    postedDate: '2 days ago'
  },
  {
    id: '2',
    budget: 750000,
    minBeds: 3,
    maxBeds: 4,
    propertyType: 'House',
    areas: ['SW1A', 'SW1B'],
    description: 'Family home with garden preferred. Good schools nearby essential.',
    postedDate: '1 day ago'
  },
  {
    id: '3',
    budget: 320000,
    minBeds: 1,
    maxBeds: 2,
    propertyType: 'Flat',
    areas: ['SW1A'],
    description: 'First-time buyer looking for a starter home. Help to Buy eligible.',
    postedDate: '3 days ago'
  },
  {
    id: '4',
    budget: 650000,
    minBeds: 2,
    maxBeds: 3,
    propertyType: 'House',
    areas: ['SW1A', 'SW1B', 'SW1C'],
    description: 'Professional couple seeking period property with character.',
    postedDate: '1 day ago'
  },
  {
    id: '5',
    budget: 850000,
    minBeds: 4,
    maxBeds: 5,
    propertyType: 'House',
    areas: ['SW1A', 'SW1B'],
    description: 'Large family needing space. Garden and parking required.',
    postedDate: '4 days ago'
  },
  {
    id: '6',
    budget: 280000,
    minBeds: 1,
    maxBeds: 1,
    propertyType: 'Flat',
    areas: ['SW1A'],
    description: 'Studio or 1-bed flat for young professional. Near tube station.',
    postedDate: '2 days ago'
  },
  {
    id: '7',
    budget: 550000,
    minBeds: 2,
    maxBeds: 3,
    propertyType: 'Flat',
    areas: ['SW1A', 'SW1B'],
    description: 'Modern apartment with balcony. No chain, ready to move quickly.',
    postedDate: '1 day ago'
  },
  {
    id: '8',
    budget: 950000,
    minBeds: 3,
    maxBeds: 4,
    propertyType: 'House',
    areas: ['SW1A'],
    description: 'Victorian or Edwardian house with period features. Must be freehold.',
    postedDate: '3 days ago'
  }
]

export default function MarketPage() {
  const searchParams = useSearchParams()
  const [postcode, setPostcode] = useState<string | null>(null)
  const [normalizedPostcode, setNormalizedPostcode] = useState<string | null>(null)
  const [filteredBuyers, setFilteredBuyers] = useState<Buyer[]>(mockBuyers)
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<{
    propertyType: string
    budget: string
    bedrooms: string
    timeframe: string
    features: string[]
  } | null>(null)

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
    const filtered = mockBuyers.filter(buyer => {
      return (
        buyer.budget >= filters.minBudget &&
        buyer.budget <= filters.maxBudget &&
        (filters.beds === 0 || (buyer.minBeds <= filters.beds && buyer.maxBeds >= filters.beds)) &&
        (filters.propertyType === 'Any' || buyer.propertyType === filters.propertyType)
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
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-dark mb-4">
              Find buyer interest
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Enter a postcode to see what buyers are looking for in your area
            </p>
            <PostcodeSearch 
              buttonLabel="Browse buyer interest"
              className="max-w-md"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
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
        {filteredBuyers.length === 0 ? (
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
            {filteredBuyers.map((buyer) => (
              <BuyerCard
                key={buyer.id}
                buyer={buyer}
                onContact={() => handleContactBuyer(buyer)}
              />
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
