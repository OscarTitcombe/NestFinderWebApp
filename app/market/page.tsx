'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MarketPage() {
  const searchParams = useSearchParams()
  const [postcode, setPostcode] = useState<string | null>(null)

  useEffect(() => {
    const postcodeParam = searchParams.get('postcode')
    setPostcode(postcodeParam)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-light">
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">
            Market Overview
          </h1>
          {postcode ? (
            <p className="text-lg text-slate-600 mb-8">
              Showing buyer interest for postcode: <span className="font-semibold text-primary">{postcode}</span>
            </p>
          ) : (
            <p className="text-lg text-slate-600 mb-8">
              No postcode specified
            </p>
          )}
          
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
            <p className="text-slate-600">
              This is a placeholder for the market page. In a real implementation, 
              this would show buyer demand data for the specified postcode.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
