'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react'

// Zod validation schema
const introFormSchema = z.object({
  sellerEmail: z.string({
    required_error: 'Email is required'
  }).email('Please enter a valid email address'),
  
  message: z.string({
    required_error: 'Message is required'
  }).min(10, 'Please provide at least 10 characters').max(800, 'Message must be 800 characters or less')
})

type IntroFormData = z.infer<typeof introFormSchema>

export default function IntroPage() {
  const searchParams = useSearchParams()
  const [buyerWantId, setBuyerWantId] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<IntroFormData>({
    resolver: zodResolver(introFormSchema),
    defaultValues: {
      sellerEmail: '',
      message: ''
    }
  })

  const watchedMessage = watch('message')

  useEffect(() => {
    const buyerId = searchParams.get('buyerWantId')
    if (buyerId) {
      setBuyerWantId(buyerId)
    }
  }, [searchParams])

  const onSubmit = async (data: IntroFormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Intro form data:', {
      ...data,
      buyerWantId
    })
    
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              Intro submitted — the buyer will receive your message.
            </h1>
            
            <p className="text-lg text-slate-600 mb-8">
              We've sent your message to the buyer. They'll be able to contact you directly using the email address you provided.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/market"
                className="btn-primary inline-flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to market
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors"
              >
                Return to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="container-custom py-8 sm:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              Contact buyer
            </h1>
            <p className="text-lg text-slate-600">
              Send a message to this buyer about your property
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Hidden buyerWantId field */}
              {buyerWantId && (
                <input
                  type="hidden"
                  {...register('buyerWantId' as any)}
                  value={buyerWantId}
                />
              )}

              {/* Seller Email */}
              <div>
                <label htmlFor="sellerEmail" className="block text-sm font-medium text-slate-700 mb-2">
                  Your email address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('sellerEmail')}
                    type="email"
                    id="sellerEmail"
                    className={`input-primary pl-10 ${errors.sellerEmail ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="your@email.com"
                    aria-describedby={errors.sellerEmail ? 'sellerEmail-error' : 'sellerEmail-help'}
                  />
                </div>
                {errors.sellerEmail && (
                  <p id="sellerEmail-error" className="mt-1 text-sm text-red-600">
                    {errors.sellerEmail.message}
                  </p>
                )}
                <p id="sellerEmail-help" className="mt-1 text-xs text-slate-500">
                  The buyer will use this to contact you directly
                </p>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message to buyer *
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={6}
                  className={`input-primary resize-none ${errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Tell the buyer about your property..."
                  aria-describedby={errors.message ? 'message-error' : 'message-help'}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
                <div className="flex justify-between items-center mt-1">
                  <p id="message-help" className="text-xs text-slate-500">
                    Include details about your property that match their requirements
                  </p>
                  <p className="text-xs text-slate-400">
                    {watchedMessage?.length || 0}/800
                  </p>
                </div>
              </div>

              {/* Buyer ID Display (if available) */}
              {buyerWantId && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Contacting buyer:</span> {buyerWantId}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending message...
                    </div>
                  ) : (
                    'Send message to buyer'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Back to Market Link */}
          <div className="text-center mt-6">
            <Link
              href="/market"
              className="inline-flex items-center text-slate-600 hover:text-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to market
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
