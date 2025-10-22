'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { normalizePostcode } from '@/lib/postcode'
import PropertyQuiz from '@/components/PropertyQuiz'
import CalculatingScreen from '@/components/CalculatingScreen'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface QuizAnswers {
  propertyType: string
  budget: string
  bedrooms: string
  timeframe: string
  features: string[]
}

export default function QuizPage() {
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

  const handleCalculatingComplete = () => {
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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
