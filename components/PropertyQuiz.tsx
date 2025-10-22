'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    } else {
      onBack()
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

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <div className="container-custom max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-slate-500">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="quiz-title mb-4">
              {currentStepData.title}
            </h1>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 w-full max-w-[800px] mx-auto">
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
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark">
                        {option.label}
                      </h3>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              {currentStep === 0 ? 'Back to postcode' : 'Previous'}
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSkip}
                className="px-6 py-3 text-slate-500 hover:text-slate-700 transition-colors font-medium"
              >
                Skip
              </button>
              
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
                  canProceed()
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length - 1 ? 'Find buyers' : 'Next'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}
