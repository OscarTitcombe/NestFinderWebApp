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
  bedrooms: string
  propertyCondition: string
  budget: string
  timeframe: string
  motivation: string
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
          'under-200k': { min: 0, max: 200000 },
          '200k-350k': { min: 200000, max: 350000 },
          '350k-500k': { min: 350000, max: 500000 },
          '500k-750k': { min: 500000, max: 750000 },
          '750k-1m': { min: 750000, max: 1000000 },
          'over-1m': { min: 1000000, max: 10000000 },
          'any-budget': { min: 0, max: 10000000 },
          // Legacy support for old price ranges
          'under-250k': { min: 0, max: 250000 },
          '250k-400k': { min: 250000, max: 400000 },
          '400k-600k': { min: 400000, max: 600000 },
          '600k-800k': { min: 600000, max: 800000 },
          '800k-1m': { min: 800000, max: 1000000 }
        }
        
        // Handle price - if it's a number string (from slider), use it directly; otherwise use range mapping
        let priceRange = { min: 0, max: 10000000 }
        if (quizAnswers.budget) {
          const priceNum = parseInt(quizAnswers.budget)
          if (!isNaN(priceNum) && priceNum > 0 && !quizAnswers.budget.includes('-') && !quizAnswers.budget.includes('k') && !quizAnswers.budget.includes('m')) {
            // Direct price value from slider - create a range around it (±15%)
            priceRange = {
              min: Math.max(0, Math.floor(priceNum * 0.85)),
              max: Math.ceil(priceNum * 1.15)
            }
          } else {
            // Try range mapping for legacy values
            priceRange = priceRanges[quizAnswers.budget] || { min: 0, max: 10000000 }
          }
        }
        
        // Handle bedrooms - "7" means "7+" in the UI
        const bedrooms = quizAnswers.bedrooms === '' ? null : parseInt(quizAnswers.bedrooms) || null
        
        // Combine property condition and motivation into features array for storage
        // (since schema doesn't have separate fields, we'll store them as features)
        const allFeatures = [...quizAnswers.features]
        if (quizAnswers.propertyCondition) {
          allFeatures.push(`condition:${quizAnswers.propertyCondition}`)
        }
        if (quizAnswers.motivation) {
          allFeatures.push(`motivation:${quizAnswers.motivation}`)
        }
        
        await createSellerProperty({
          postcode_district: normalizedPostcode,
          property_type: (quizAnswers.propertyType === 'any' ? 'any' : quizAnswers.propertyType) as 'house' | 'flat' | 'bungalow' | 'any' | 'other',
          expected_price_min: priceRange.min,
          expected_price_max: priceRange.max,
          bedrooms: bedrooms,
          timeframe: quizAnswers.timeframe as 'immediately' | '1-3-months' | '3-6-months' | '6-12-months' | 'just-browsing' | null,
          features: allFeatures.length > 0 ? allFeatures : null,
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
      bedrooms: quizAnswers!.bedrooms,
      propertyCondition: quizAnswers!.propertyCondition || '',
      budget: quizAnswers!.budget,
      timeframe: quizAnswers!.timeframe,
      motivation: quizAnswers!.motivation || '',
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
