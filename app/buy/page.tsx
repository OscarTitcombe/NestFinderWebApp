'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { normalizePostcode } from '@/lib/postcode'
import { useToast } from '@/lib/toast'
import { useAuth } from '@/lib/auth-context'

// Zod validation schema
const buyerFormSchema = z.object({
  budgetMin: z.number({
    required_error: 'Minimum budget is required',
    invalid_type_error: 'Please enter a valid number'
  }).min(50000, 'Minimum budget must be at least £50,000'),
  
  budgetMax: z.number({
    required_error: 'Maximum budget is required',
    invalid_type_error: 'Please enter a valid number'
  }).min(100000, 'Maximum budget must be at least £100,000'),
  
  bedsMin: z.number({
    required_error: 'Number of bedrooms is required',
    invalid_type_error: 'Please enter a valid number'
  }).min(1, 'Must have at least 1 bedroom').max(10, 'Maximum 10 bedrooms'),
  
  propertyType: z.enum(['flat', 'house', 'maisonette', 'other'], {
    required_error: 'Please select a property type'
  }),
  
  areas: z.string({
    required_error: 'Areas are required'
  }).min(2, 'Please enter at least one area').max(200, 'Areas list is too long'),
  
  notes: z.string({
    required_error: 'Notes are required'
  }).min(10, 'Please provide at least 10 characters').max(800, 'Notes must be 800 characters or less'),
  
  accountEmail: z.string({
    required_error: 'Account email address is required'
  }).email('Please enter a valid email address'),
  
  buyerContactEmail: z.string({
    required_error: 'Buyer contact email is required'
  }).email('Please enter a valid email address')
})

type BuyerFormData = z.infer<typeof buyerFormSchema>

export default function BuyPage() {
  const toast = useToast()
  const { user } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerFormSchema),
    defaultValues: {
      budgetMin: 300000,
      budgetMax: 500000,
      bedsMin: 2,
      propertyType: 'flat',
      areas: '',
      notes: '',
      accountEmail: user?.email || '',
      buyerContactEmail: user?.email || ''
    }
  })

  // Auto-fill emails when user signs in
  useEffect(() => {
    if (user?.email) {
      setValue('accountEmail', user.email)
      setValue('buyerContactEmail', user.email)
    }
  }, [user, setValue])

  const watchedBudgetMin = watch('budgetMin')
  const watchedBudgetMax = watch('budgetMax')

  const onSubmit = async (data: BuyerFormData) => {
    setIsSubmitting(true)
    
    try {
      // Parse postcode districts from comma-separated string
      const districts = data.areas
        .split(',')
        .map(area => {
          const result = normalizePostcode(area.trim())
          return result.ok ? result.district : null
        })
        .filter((district): district is string => district !== null)

      if (districts.length === 0) {
        throw new Error('Please enter at least one valid postcode district')
      }

      // Create buyer request in Supabase
      const { createBuyerRequest } = await import('@/lib/supabase/queries')
      
      await createBuyerRequest({
        budget_min: data.budgetMin,
        budget_max: data.budgetMax,
        beds_min: data.bedsMin,
        beds_max: data.bedsMin, // Default to same as min, can be updated later
        property_type: data.propertyType as 'flat' | 'house' | 'maisonette' | 'bungalow' | 'other' | 'any',
        postcode_districts: districts,
        description: data.notes,
        email: data.buyerContactEmail,
        status: 'active'
      })

      // If user is not authenticated, send verification email
      if (!user) {
        try {
          const response = await fetch('/api/send-verification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: data.accountEmail,
            }),
          })

          if (!response.ok) {
            console.error('Failed to send verification email')
          }
        } catch (emailError) {
          console.error('Error sending verification email:', emailError)
          // Don't fail the submission if email fails
        }

        setNeedsVerification(true)
        setSubmittedEmail(data.accountEmail)
      }

      setIsSubmitted(true)
      toast.showToast('Your buyer request has been posted successfully!', 'success')
    } catch (err: any) {
      console.error('Error creating buyer request:', err)
      toast.showToast(err.message || 'Failed to post your brief. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isSubmitted) {
    if (needsVerification && submittedEmail) {
      return (
        <div className="min-h-screen bg-light flex items-center justify-center">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
                Check your email to verify your account
              </h1>
              
              <p className="text-lg text-slate-600 mb-4">
                We've received your property brief and sent a verification email to <strong>{submittedEmail}</strong>.
              </p>
              
              <p className="text-base text-slate-500 mb-8">
                Please check your inbox and click the verification link to activate your account. Once verified, sellers will be able to contact you about your brief.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-blue-800">
                  <strong>Didn't receive the email?</strong> Check your spam folder or try resending the verification email.
                </p>
              </div>
              
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
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              Your brief has been posted!
            </h1>
            
            <p className="text-lg text-slate-600 mb-8">
              We've received your property brief and will start matching you with sellers in your areas.
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              Post your property brief
            </h1>
            <p className="text-lg text-slate-600">
              Let sellers know what you're looking for and explore your options
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-fade-in">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Account Email - At the top */}
              <div>
                <label htmlFor="accountEmail" className="block text-sm font-medium text-slate-700 mb-2">
                  Account Email Address *
                </label>
                <input
                  {...register('accountEmail')}
                  type="email"
                  id="accountEmail"
                  className={`input-primary ${errors.accountEmail ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="your@email.com"
                  aria-describedby={errors.accountEmail ? 'accountEmail-error' : 'accountEmail-help'}
                  disabled={!!user?.email}
                />
                {errors.accountEmail && (
                  <p id="accountEmail-error" className="mt-1 text-sm text-red-600">
                    {errors.accountEmail.message}
                  </p>
                )}
                <p id="accountEmail-help" className="mt-1 text-xs text-slate-500">
                  {user?.email 
                    ? 'Your account email (you can change this in your account settings)'
                    : 'We\'ll send a verification email to this address to activate your account'
                  }
                </p>
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budgetMin" className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Budget *
                  </label>
                  <input
                    {...register('budgetMin', { valueAsNumber: true })}
                    type="number"
                    id="budgetMin"
                    className={`input-primary ${errors.budgetMin ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="300000"
                    aria-describedby={errors.budgetMin ? 'budgetMin-error' : 'budgetMin-help'}
                  />
                  {errors.budgetMin && (
                    <p id="budgetMin-error" className="mt-1 text-sm text-red-600">
                      {errors.budgetMin.message}
                    </p>
                  )}
                  <p id="budgetMin-help" className="mt-1 text-xs text-slate-500">
                    Minimum amount you can spend
                  </p>
                </div>

                <div>
                  <label htmlFor="budgetMax" className="block text-sm font-medium text-slate-700 mb-2">
                    Maximum Budget *
                  </label>
                  <input
                    {...register('budgetMax', { valueAsNumber: true })}
                    type="number"
                    id="budgetMax"
                    className={`input-primary ${errors.budgetMax ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="500000"
                    aria-describedby={errors.budgetMax ? 'budgetMax-error' : 'budgetMax-help'}
                  />
                  {errors.budgetMax && (
                    <p id="budgetMax-error" className="mt-1 text-sm text-red-600">
                      {errors.budgetMax.message}
                    </p>
                  )}
                  <p id="budgetMax-help" className="mt-1 text-xs text-slate-500">
                    Maximum amount you can spend
                  </p>
                </div>
              </div>

              {/* Budget Range Display */}
              {watchedBudgetMin && watchedBudgetMax && (
                <div className="bg-[#F5F5F5] rounded-lg p-4">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Budget range:</span> {formatCurrency(watchedBudgetMin)} - {formatCurrency(watchedBudgetMax)}
                  </p>
                </div>
              )}

              {/* Bedrooms and Property Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bedsMin" className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Bedrooms *
                  </label>
                  <select
                    {...register('bedsMin', { valueAsNumber: true })}
                    id="bedsMin"
                    className={`input-primary ${errors.bedsMin ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    aria-describedby={errors.bedsMin ? 'bedsMin-error' : undefined}
                  >
                    <option value={1}>1 bedroom</option>
                    <option value={2}>2 bedrooms</option>
                    <option value={3}>3 bedrooms</option>
                    <option value={4}>4 bedrooms</option>
                    <option value={5}>5+ bedrooms</option>
                  </select>
                  {errors.bedsMin && (
                    <p id="bedsMin-error" className="mt-1 text-sm text-red-600">
                      {errors.bedsMin.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    {...register('propertyType')}
                    id="propertyType"
                    className={`input-primary ${errors.propertyType ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    aria-describedby={errors.propertyType ? 'propertyType-error' : undefined}
                  >
                    <option value="flat">Flat</option>
                    <option value="house">House</option>
                    <option value="maisonette">Maisonette</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.propertyType && (
                    <p id="propertyType-error" className="mt-1 text-sm text-red-600">
                      {errors.propertyType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Areas */}
              <div>
                <label htmlFor="areas" className="block text-sm font-medium text-slate-700 mb-2">
                  Areas (Postcode Districts) *
                </label>
                <input
                  {...register('areas')}
                  type="text"
                  id="areas"
                  className={`input-primary ${errors.areas ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="SW1, SW3, E1, N1"
                  aria-describedby={errors.areas ? 'areas-error' : 'areas-help'}
                />
                {errors.areas && (
                  <p id="areas-error" className="mt-1 text-sm text-red-600">
                    {errors.areas.message}
                  </p>
                )}
                <p id="areas-help" className="mt-1 text-xs text-slate-500">
                  Separate multiple postcodes with commas (e.g., SW1, SW3, E1)
                </p>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes *
                </label>
                <textarea
                  {...register('notes')}
                  id="notes"
                  rows={4}
                  className={`input-primary resize-none ${errors.notes ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Tell sellers more about what you're looking for..."
                  aria-describedby={errors.notes ? 'notes-error' : 'notes-help'}
                />
                {errors.notes && (
                  <p id="notes-error" className="mt-1 text-sm text-red-600">
                    {errors.notes.message}
                  </p>
                )}
                <p id="notes-help" className="mt-1 text-xs text-slate-500">
                  Describe your ideal property, must-haves, and any specific requirements
                </p>
              </div>

              {/* Buyer Contact Email - At the bottom */}
              <div>
                <label htmlFor="buyerContactEmail" className="block text-sm font-medium text-slate-700 mb-2">
                  Buyer Contact Email *
                </label>
                <input
                  {...register('buyerContactEmail')}
                  type="email"
                  id="buyerContactEmail"
                  className={`input-primary ${errors.buyerContactEmail ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="contact@email.com"
                  aria-describedby={errors.buyerContactEmail ? 'buyerContactEmail-error' : 'buyerContactEmail-help'}
                />
                {errors.buyerContactEmail && (
                  <p id="buyerContactEmail-error" className="mt-1 text-sm text-red-600">
                    {errors.buyerContactEmail.message}
                  </p>
                )}
                <p id="buyerContactEmail-help" className="mt-1 text-xs text-slate-500">
                  This is the email address sellers will use to contact you about your brief
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post your property brief
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

