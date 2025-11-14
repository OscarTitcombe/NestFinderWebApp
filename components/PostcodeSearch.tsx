'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { normalizePostcode } from '@/lib/postcode'
import { PrimaryButton } from './Buttons'

interface PostcodeSearchProps {
  buttonLabel?: string
  placeholder?: string
  showHelperText?: boolean
  className?: string
  mode?: 'buyer' | 'seller'
}

export default function PostcodeSearch({ 
  buttonLabel = "Explore pre-market demand",
  placeholder = "Enter postcode (e.g., SW1A)",
  showHelperText = true,
  className = "",
  mode = 'seller'
}: PostcodeSearchProps) {
  const [postcode, setPostcode] = useState('')
  const [showHighlight, setShowHighlight] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowHighlight(false)
    setIsLoading(true)

    try {
      // Buyer mode: navigate directly to /buy page (no postcode required)
      if (mode === 'buyer') {
        router.push('/buy')
        return
      }

      // Seller mode: validate postcode and navigate to quiz
      if (!postcode.trim()) {
        setShowHighlight(true)
        setIsLoading(false)
        return
      }

      const result = normalizePostcode(postcode)
      
      if (!result.ok) {
        setShowHighlight(true)
        setIsLoading(false)
        return
      }

      // Navigate to quiz page with normalized postcode
      router.push(`/quiz?postcode=${encodeURIComponent(result.district!)}`)
    } catch (err) {
      setShowHighlight(true)
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value)
    if (showHighlight) setShowHighlight(false) // Clear highlight when user starts typing
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`} role="search">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="postcode-input" className="sr-only">
            Enter your postcode
          </label>
          <input
            id="postcode-input"
            type="text"
            value={postcode}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`input-primary ${
              showHighlight 
                ? mode === 'buyer' 
                  ? 'border-nest-sea focus:ring-nest-sea focus:border-nest-sea' 
                  : 'border-nest-mint focus:ring-nest-mint focus:border-nest-mint'
                : ''
            }`}
            aria-describedby={showHelperText ? "postcode-helper" : undefined}
            disabled={isLoading}
            autoComplete="postal-code"
          />
        </div>
        <PrimaryButton
          type="submit"
          disabled={isLoading}
          className={`
            whitespace-nowrap disabled:cursor-not-allowed
            ${mode === 'buyer' 
              ? '!bg-nest-sea hover:!bg-nest-seaHover focus-visible:!ring-nest-sea' 
              : ''
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </div>
          ) : (
            buttonLabel
          )}
        </PrimaryButton>
      </div>
      
      {showHelperText && (
        <p id="postcode-helper" className="mt-3 text-sm text-slate-600 text-center">
          {mode === 'buyer' 
            ? (
              <>
                <span className="sm:hidden">Let homeowners know what you're searching for.</span>
                <span className="hidden sm:inline">Let homeowners know what you're searching for — privately and securely.</span>
              </>
            )
            : "Free to browse. No sign-up required for sellers."
          }
        </p>
      )}
    </form>
  )
}
