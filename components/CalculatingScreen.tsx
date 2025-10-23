'use client'

import { useEffect, useState } from 'react'
import { Search, TrendingUp, Users, MapPin } from 'lucide-react'

interface CalculatingScreenProps {
  postcode: string
  onComplete: () => void
  duration?: number // Duration in milliseconds, defaults to 3000
}

export default function CalculatingScreen({ 
  postcode, 
  onComplete, 
  duration = 3000 
}: CalculatingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      icon: Search,
      title: "Searching your area",
      description: "Finding all active buyers near your postcode",
      duration: 800
    },
    {
      icon: TrendingUp,
      title: "Analyzing market data",
      description: "Processing recent sales and demand patterns",
      duration: 1000
    },
    {
      icon: Users,
      title: "Matching preferences",
      description: "Connecting you with relevant buyers",
      duration: 800
    },
    {
      icon: MapPin,
      title: "Finalizing results",
      description: "Preparing your personalized buyer list",
      duration: 400
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100))
        if (newProgress >= 100) {
          clearInterval(timer)
          onComplete()
          return 100
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(timer)
  }, [duration, onComplete])

  useEffect(() => {
    let stepTimer: NodeJS.Timeout
    let currentStepIndex = 0

    const runSteps = () => {
      if (currentStepIndex < steps.length) {
        setCurrentStep(currentStepIndex)
        stepTimer = setTimeout(() => {
          currentStepIndex++
          runSteps()
        }, steps[currentStepIndex].duration)
      }
    }

    runSteps()

    return () => {
      if (stepTimer) clearTimeout(stepTimer)
    }
  }, [])

  const currentStepData = steps[currentStep] || steps[steps.length - 1]
  const IconComponent = currentStepData.icon

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <div className="container-custom max-w-2xl text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 className="quiz-title mb-4">
              Finding buyers in your area
            </h1>
          </div>

          {/* Main Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-slate-200 rounded-full h-4 mb-4">
              <div 
                className="bg-nest-mint h-4 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-600">
              {Math.round(progress)}% complete
            </p>
          </div>

      </div>
    </div>
  )
}
