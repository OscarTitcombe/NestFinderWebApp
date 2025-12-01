'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

interface QuizAnswers {
  propertyType: string
  bedrooms: string
  propertyCondition: string
  budget: string
  timeframe: string
  motivation: string
  features: string[]
}

interface PropertyQuizProps {
  postcode: string
  onComplete: (answers: QuizAnswers) => void
  onBack: () => void
}

interface StepOption {
  value: string
  label: string
}

interface QuizStep {
  title: string
  options?: StepOption[]
  multiSelect?: boolean
  inputType?: 'slider' | 'number' | 'price'
}

export default function PropertyQuiz({ postcode, onComplete, onBack }: PropertyQuizProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({
    propertyType: '',
    bedrooms: '',
    propertyCondition: '',
    budget: '',
    timeframe: '',
    motivation: '',
    features: []
  })

  const steps: QuizStep[] = [
    {
      title: "What type of property are you selling?",
      options: [
        { value: 'house', label: 'House' },
        { value: 'flat', label: 'Flat / Apartment' },
        { value: 'bungalow', label: 'Bungalow' },
        { value: 'any', label: 'Other' }
      ]
    },
    {
      title: "How many bedrooms?",
      inputType: 'number'
    },
    {
      title: "What condition is your property in?",
      options: [
        { value: 'move-in-ready', label: 'Move-in Ready' },
        { value: 'good-condition', label: 'Good Condition' },
        { value: 'needs-updating', label: 'Needs Updating' },
        { value: 'renovation-project', label: 'Renovation Project' }
      ]
    },
    {
      title: "What's your expected sale price?",
      inputType: 'price'
    },
    {
      title: "When do you need to sell?",
      options: [
        { value: 'immediately', label: 'Immediately / ASAP' },
        { value: '1-3-months', label: 'Within 1-3 months' },
        { value: '3-6-months', label: '3-6 months' },
        { value: '6-12-months', label: '6-12 months' },
        { value: 'just-browsing', label: 'Just exploring' }
      ]
    },
    {
      title: "What's your main reason for selling?",
      options: [
        { value: 'relocating', label: 'Relocating' },
        { value: 'upsizing', label: 'Upsizing' },
        { value: 'downsizing', label: 'Downsizing' },
        { value: 'investment', label: 'Investment Sale' },
        { value: 'divorce', label: 'Life Change' },
        { value: 'other', label: 'Other Reason' }
      ]
    },
    {
      title: "What are your property's key features?",
      options: [
        { value: 'garden', label: 'Garden / Outdoor Space' },
        { value: 'parking', label: 'Parking Available' },
        { value: 'transport', label: 'Excellent Transport Links' },
        { value: 'schools', label: 'Near Good Schools' },
        { value: 'shopping', label: 'Near Shops & Amenities' },
        { value: 'period', label: 'Period Features' },
        { value: 'modern', label: 'Modern & Updated' },
        { value: 'quiet', label: 'Quiet Location' },
        { value: 'family', label: 'Family Friendly' }
      ],
      multiSelect: true
    }
  ]

  const getFieldName = (stepIndex: number): keyof QuizAnswers => {
    if (stepIndex === 0) return 'propertyType'
    if (stepIndex === 1) return 'bedrooms'
    if (stepIndex === 2) return 'propertyCondition'
    if (stepIndex === 3) return 'budget'
    if (stepIndex === 4) return 'timeframe'
    if (stepIndex === 5) return 'motivation'
    return 'features'
  }

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
      const fieldName = getFieldName(currentStep)
      setAnswers(prev => ({ ...prev, [fieldName]: value }))
    }
  }

  const handleNumberChange = (value: string) => {
    const fieldName = getFieldName(currentStep)
    setAnswers(prev => ({ ...prev, [fieldName]: value }))
  }

  const handlePriceChange = (value: number) => {
    setAnswers(prev => ({ ...prev, budget: value.toString() }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete(answers)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    // Set default values for skipped questions
    const step = steps[currentStep]
    if (step.multiSelect) {
      // For features, leave empty array (no features selected)
      setAnswers(prev => ({ ...prev, features: [] }))
    } else {
      const fieldName = getFieldName(currentStep)
      let defaultValue = ''
      
      if (currentStep === 0) {
        defaultValue = 'any'
      } else if (currentStep === 1) {
        defaultValue = '3' // Default to 3 bedrooms
      } else if (currentStep === 2) {
        defaultValue = 'good-condition'
      } else if (currentStep === 3) {
        defaultValue = '500000' // Default to £500k
      } else if (currentStep === 4) {
        defaultValue = 'just-browsing'
      } else {
        defaultValue = 'other'
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
      return true
    } else if (step.inputType) {
      const fieldName = getFieldName(currentStep)
      const value = answers[fieldName as keyof QuizAnswers]
      return value !== ''
    } else {
      const fieldName = getFieldName(currentStep)
      return answers[fieldName as keyof QuizAnswers] !== ''
    }
  }

  const currentStepData = steps[currentStep]
  const progress = Math.round(((currentStep + 1) / steps.length) * 100)
  const totalSteps = steps.length

  // Format price for display
  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `£${(value / 1000000).toFixed(1)}M`
    }
    return `£${(value / 1000).toFixed(0)}k`
  }

  return (
    <div className="min-h-screen bg-white flex items-start sm:items-center justify-center px-4 py-10 sm:py-16">
      <div className="max-w-3xl w-full">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <p className="text-slate-600 text-sm font-medium">
              Step {currentStep + 1} of {totalSteps}
            </p>
            <p className="text-slate-600 text-sm font-medium">
              {progress}% complete
            </p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full">
            <div
              className="h-1.5 bg-nest-mint rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 sm:mb-12">
          {currentStepData.title}
        </h1>

        {/* Content based on input type */}
        {currentStepData.inputType === 'number' && (
          <div className="mb-16">
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberChange(num.toString())}
                  className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 text-xl sm:text-2xl font-bold transition-all ${
                    answers.bedrooms === num.toString()
                      ? 'border-nest-mint bg-nest-mint/5 text-slate-900'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => handleNumberChange('7')}
                className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 text-xl sm:text-2xl font-bold transition-all ${
                  answers.bedrooms === '7'
                    ? 'border-nest-mint bg-nest-mint/5 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                7+
              </button>
            </div>
            <p className="text-slate-500 text-sm mt-4">Select number of bedrooms</p>
          </div>
        )}

        {currentStepData.inputType === 'price' && (
          <div className="mb-16">
            <div className="max-w-lg">
              <div className="mb-6">
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="10000"
                  value={answers.budget || '500000'}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #8FD5C7 0%, #8FD5C7 ${((parseInt(answers.budget || '500000') - 50000) / (2000000 - 50000)) * 100}%, #f1f5f9 ${((parseInt(answers.budget || '500000') - 50000) / (2000000 - 50000)) * 100}%, #f1f5f9 100%)`
                  }}
                />
              </div>
              <div className="text-6xl font-bold text-slate-900 mb-4">
                {formatPrice(parseInt(answers.budget || '500000'))}
              </div>
              <div className="flex justify-between text-sm text-slate-400 mt-3">
                <span>£50k</span>
                <span>£2M</span>
              </div>
            </div>
          </div>
        )}

        {currentStepData.options && (
          <div className={`grid gap-4 mb-16 ${
            currentStepData.options.length <= 4 
              ? 'grid-cols-1 sm:grid-cols-2' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {currentStepData.options.map((option) => {
              const fieldName = getFieldName(currentStep)
              const isSelected = currentStepData.multiSelect 
                ? answers.features.includes(option.value)
                : answers[fieldName as keyof QuizAnswers] === option.value

              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-nest-mint bg-nest-mint/5 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={`font-medium text-base ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-8 border-t border-slate-100">
          <div className="flex gap-2 order-2 sm:order-1 justify-between sm:justify-start">
            {currentStep > 0 && (
              <button 
                onClick={handleBack}
                className="text-slate-500 hover:text-slate-700 font-medium transition-colors px-4 py-2 hover:bg-slate-50 rounded-lg"
              >
                ← Back
              </button>
            )}
            <button 
              onClick={handleSkip}
              className="text-slate-400 hover:text-slate-600 font-medium transition-colors px-4 py-2 hover:bg-slate-50 rounded-lg"
            >
              Skip
            </button>
          </div>
          
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-nest-mint hover:bg-nest-mint/90 text-white font-bold text-lg rounded-xl px-12 py-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto order-1 sm:order-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Explore buyers
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
