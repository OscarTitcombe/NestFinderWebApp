'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { normalizePostcode } from '@/lib/postcode'

interface PostcodeSearchProps {
  buttonLabel?: string
  placeholder?: string
  showHelperText?: boolean
  className?: string
}

export default function PostcodeSearch({ 
  buttonLabel = "Browse buyer interest",
  placeholder = "Enter postcode (e.g., SW1A)",
  showHelperText = true,
  className = ""
}: PostcodeSearchProps) {
  const [postcode, setPostcode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = normalizePostcode(postcode)
      
      if (!result.ok) {
        setError(result.error || 'Invalid postcode')
        return
      }

      // Navigate to market page with normalized postcode
      router.push(`/market?postcode=${encodeURIComponent(result.district!)}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostcode(e.target.value)
    if (error) setError('') // Clear error when user starts typing
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md mx-auto ${className}`} role="search">
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
            className={`input-primary ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            aria-describedby={showHelperText ? "postcode-helper" : undefined}
            aria-invalid={error ? 'true' : 'false'}
            disabled={isLoading}
            autoComplete="postal-code"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !postcode.trim()}
          className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Loading...
            </div>
          ) : (
            buttonLabel
          )}
        </button>
      </div>
      
      {showHelperText && (
        <p id="postcode-helper" className="mt-3 text-sm text-slate-600 text-center">
          Free to browse. No sign-up required for sellers.
        </p>
      )}
    </form>
  )
}
