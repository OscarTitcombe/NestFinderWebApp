'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuizAnswers {
  propertyType: string
  budget: string
  bedrooms: string
  timeframe: string
  features: string[]
}

interface PropertyQuizProps {
  postcode: string
  onComplete: (answers: QuizAnswers) => void
  onBack: () => void
}

export default function PropertyQuiz({ postcode, onComplete, onBack }: PropertyQuizProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({
    propertyType: '',
    budget: '',
    bedrooms: '',
    timeframe: '',
    features: []
  })

  const steps = [
    {
      title: "What type of property are you selling?",
      options: [
        { value: 'house', label: 'House' },
        { value: 'flat', label: 'Flat/Apartment' },
        { value: 'bungalow', label: 'Bungalow' },
        { value: 'any', label: 'Other' }
      ]
    },
    {
      title: "What's your expected sale price?",
      options: [
        { value: 'under-300k', label: 'Under £300k' },
        { value: '300k-500k', label: '£300k - £500k' },
        { value: '500k-750k', label: '£500k - £750k' },
        { value: '750k-1m', label: '£750k - £1M' },
        { value: 'over-1m', label: 'Over £1M' }
      ]
    },
    {
      title: "How many bedrooms?",
      options: [
        { value: '1', label: '1 bedroom' },
        { value: '2', label: '2 bedrooms' },
        { value: '3', label: '3 bedrooms' },
        { value: '4', label: '4 bedrooms' },
        { value: '5+', label: '5+ bedrooms' }
      ]
    },
    {
      title: "When do you want to sell?",
      options: [
        { value: 'immediately', label: 'Immediately' },
        { value: '1-3-months', label: '1-3 months' },
        { value: '3-6-months', label: '3-6 months' },
        { value: '6-12-months', label: '6-12 months' },
        { value: 'just-browsing', label: 'Just exploring' }
      ]
    },
    {
      title: "What features does your property have?",
      options: [
        { value: 'garden', label: 'Garden' },
        { value: 'parking', label: 'Parking' },
        { value: 'transport', label: 'Near transport' },
        { value: 'schools', label: 'Near good schools' },
        { value: 'shopping', label: 'Near shops' },
        { value: 'period', label: 'Period features' }
      ],
      multiSelect: true
    }
  ]

  const handleAnswer = (value: string) => {
    const step = steps[currentStep]
    
    if (step.multiSelect) {
      // Handle multi-select for features
      const newFeatures = answers.features.includes(value)
        ? answers.features.filter(f => f !== value)
        : [...answers.features, value]
      
      setAnswers(prev => ({ ...prev, features: newFeatures }))
    } else {
      // Handle single select
      const fieldName = currentStep === 0 ? 'propertyType' :
                       currentStep === 1 ? 'budget' :
                       currentStep === 2 ? 'bedrooms' : 'timeframe'
      
      setAnswers(prev => ({ ...prev, [fieldName]: value }))
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete(answers)
    }
  }

  const handleSkip = () => {
    // Set default values for skipped questions
    const step = steps[currentStep]
    if (step.multiSelect) {
      // For features, leave empty array (no features selected)
      setAnswers(prev => ({ ...prev, features: [] }))
    } else {
      // Set default values for other questions
      const fieldName = currentStep === 0 ? 'propertyType' :
                       currentStep === 1 ? 'budget' :
                       currentStep === 2 ? 'bedrooms' : 'timeframe'
      
      let defaultValue = ''
      if (currentStep === 1) {
        // For budget, set to no limits
        defaultValue = 'any-budget'
      } else if (currentStep === 2) {
        // For bedrooms, set to any
        defaultValue = '0'
      } else {
        // For other questions, set to 'any' or 'any-type'
        defaultValue = currentStep === 0 ? 'any' : 'any-timeframe'
      }
      
      setAnswers(prev => ({ ...prev, [fieldName]: defaultValue }))
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete(answers)
    }
  }


  const canProceed = () => {
    const step = steps[currentStep]
    if (step.multiSelect) {
      return answers.features.length > 0
    } else {
      const fieldName = currentStep === 0 ? 'propertyType' :
                       currentStep === 1 ? 'budget' :
                       currentStep === 2 ? 'bedrooms' : 'timeframe'
      return answers[fieldName as keyof QuizAnswers] !== ''
    }
  }

  const currentStepData = steps[currentStep]

  const progress = Math.round(((currentStep + 1) / steps.length) * 100)
  const totalSteps = steps.length

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-nest-sageBg">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-nest-line p-8 sm:p-10">
        {/* Progress indicator */}
        <p className="text-slate-500 text-sm text-center mb-2">
          Step {currentStep + 1} of {totalSteps} • {progress}% complete
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-nest-sageBg rounded-full mt-6 mb-4 overflow-hidden">
          <div
            className="h-2 bg-nest-mint transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-8">
          {currentStepData.title}
        </h1>

        {/* Options with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {currentStepData.options.map((option) => {
                const isSelected = currentStepData.multiSelect 
                  ? answers.features.includes(option.value)
                  : answers[currentStepData.multiSelect ? 'features' : 
                    (currentStep === 0 ? 'propertyType' :
                     currentStep === 1 ? 'budget' :
                     currentStep === 2 ? 'bedrooms' : 'timeframe') as keyof QuizAnswers] === option.value

                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`p-4 sm:p-6 rounded-xl border-2 text-left transition-all duration-200 min-h-[60px] sm:min-h-[80px] flex items-center ${
                      isSelected
                        ? 'border-nest-mint bg-nest-mint/5 shadow-md'
                        : 'border-nest-line hover:border-nest-mint hover:shadow-sm active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
                          {option.label}
                        </h3>
                      </div>
                      {isSelected && (
                        <div className="ml-2">
                          <svg className="w-5 h-5 text-nest-mint" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex justify-between items-center">
          <button 
            onClick={handleSkip}
            className="text-slate-500 hover:text-slate-700 transition"
          >
            Skip
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-nest-mint hover:bg-nest-mint/90 text-white font-semibold rounded-xl px-6 py-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? 'Find buyers' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
