'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { normalizePostcode } from '@/lib/postcode'
import PropertyQuiz from '@/components/PropertyQuiz'
import CalculatingScreen from '@/components/CalculatingScreen'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Loader2 } from 'lucide-react'

interface QuizAnswers {
  propertyType: string
  budget: string
  bedrooms: string
  timeframe: string
  features: string[]
}

function QuizPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [postcode, setPostcode] = useState<string | null>(null)
  const [normalizedPostcode, setNormalizedPostcode] = useState<string | null>(null)
  const [showCalculating, setShowCalculating] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null)

  useEffect(() => {
    const postcodeParam = searchParams.get('postcode')
    if (postcodeParam) {
      const result = normalizePostcode(postcodeParam)
      if (result.ok && result.district) {
        setPostcode(postcodeParam)
        setNormalizedPostcode(result.district)
      } else {
        // Invalid postcode, redirect back to home
        router.push('/')
      }
    } else {
      // No postcode provided, redirect back to home
      router.push('/')
    }
  }, [searchParams, router])

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers)
    setShowCalculating(true)
  }

  const handleCalculatingComplete = async () => {
    // Save seller property to Supabase
    if (quizAnswers && normalizedPostcode) {
      try {
        const { createSellerProperty } = await import('@/lib/supabase/queries')
        
        // Map quiz answers to database format
        const priceRanges: Record<string, { min: number; max: number }> = {
          'under-300k': { min: 0, max: 300000 },
          '300k-500k': { min: 300000, max: 500000 },
          '500k-750k': { min: 500000, max: 750000 },
          '750k-1m': { min: 750000, max: 1000000 },
          'over-1m': { min: 1000000, max: 10000000 },
          'any-budget': { min: 0, max: 10000000 }
        }
        
        const priceRange = priceRanges[quizAnswers.budget] || { min: 0, max: 10000000 }
        const bedrooms = quizAnswers.bedrooms === '0' ? null : parseInt(quizAnswers.bedrooms) || null
        
        await createSellerProperty({
          postcode_district: normalizedPostcode,
          property_type: (quizAnswers.propertyType === 'any' ? 'any' : quizAnswers.propertyType) as 'house' | 'flat' | 'bungalow' | 'any' | 'other',
          expected_price_min: priceRange.min,
          expected_price_max: priceRange.max,
          bedrooms: bedrooms,
          timeframe: quizAnswers.timeframe as 'immediately' | '1-3-months' | '3-6-months' | '6-12-months' | 'just-browsing' | null,
          features: quizAnswers.features.length > 0 ? quizAnswers.features : null,
          status: 'active'
        })
      } catch (err: any) {
        console.error('Error saving seller property:', err)
        // Continue to market page even if save fails
      }
    }
    
    // Navigate to market page with postcode and quiz answers as URL params
    const params = new URLSearchParams({
      postcode: normalizedPostcode!,
      propertyType: quizAnswers!.propertyType,
      budget: quizAnswers!.budget,
      bedrooms: quizAnswers!.bedrooms,
      timeframe: quizAnswers!.timeframe,
      features: quizAnswers!.features.join(',')
    })
    
    router.push(`/market?${params.toString()}`)
  }

  const handleBackToPostcode = () => {
    router.push('/')
  }

  // Loading state while validating postcode
  if (!postcode || !normalizedPostcode) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600">Validating postcode...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Show calculating screen after quiz completion
  if (showCalculating) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1">
          <CalculatingScreen
            postcode={normalizedPostcode}
            onComplete={handleCalculatingComplete}
            duration={3000}
          />
        </div>
        <Footer />
      </div>
    )
  }

  // Show quiz
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1">
        <PropertyQuiz
          postcode={normalizedPostcode}
          onComplete={handleQuizComplete}
          onBack={handleBackToPostcode}
        />
      </div>
      <Footer />
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-nest-mint animate-spin mx-auto mb-3" />
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  )
}
