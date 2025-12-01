'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, X, Home, MapPin, Calendar, Heart, Mail, Info } from 'lucide-react'
import { normalizePostcode } from '@/lib/postcode'
import { useToast } from '@/lib/toast'
import { useAuth } from '@/lib/auth-context'
import { analytics } from '@/lib/analytics'

// Function to parse budget input with k/m/b suffixes
const parseBudgetInput = (input: string | number | undefined): number | undefined => {
  if (input === undefined || input === null || input === '') return undefined
  
  // If it's already a number, return it
  if (typeof input === 'number') return input
  
  const str = String(input).trim().toLowerCase().replace(/[£,\s]/g, '')
  
  if (!str) return undefined
  
  // Check for suffixes
  if (str.endsWith('k')) {
    const num = parseFloat(str.slice(0, -1))
    return isNaN(num) ? undefined : Math.round(num * 1000)
  } else if (str.endsWith('m')) {
    const num = parseFloat(str.slice(0, -1))
    return isNaN(num) ? undefined : Math.round(num * 1000000)
  } else if (str.endsWith('b')) {
    const num = parseFloat(str.slice(0, -1))
    return isNaN(num) ? undefined : Math.round(num * 1000000000)
  }
  
  // Try to parse as regular number
  const num = parseFloat(str)
  return isNaN(num) ? undefined : Math.round(num)
}

// Enhanced Zod validation schema
const buyerFormSchema = z.object({
  budgetMin: z.union([
    z.number().min(50000, 'Minimum budget must be at least £50,000'),
    z.string().min(1, 'Minimum budget is required')
  ]).refine((val) => {
    if (typeof val === 'string') {
      const parsed = parseBudgetInput(val)
      return parsed !== undefined && parsed >= 50000
    }
    return true
  }, 'Minimum budget must be at least £50,000'),
  
  budgetMax: z.union([
    z.number().min(100000, 'Maximum budget must be at least £100,000'),
    z.string().min(1, 'Maximum budget is required')
  ]).refine((val) => {
    if (typeof val === 'string') {
      const parsed = parseBudgetInput(val)
      return parsed !== undefined && parsed >= 100000
    }
    return true
  }, 'Maximum budget must be at least £100,000'),
  
  bedsMin: z.number({
    required_error: 'Minimum bedrooms is required',
    invalid_type_error: 'Please enter a valid number'
  }).min(1, 'Must have at least 1 bedroom').max(10, 'Maximum 10 bedrooms'),
  
  bedsMax: z.number({
    required_error: 'Maximum bedrooms is required',
    invalid_type_error: 'Please enter a valid number'
  }).min(1, 'Must have at least 1 bedroom').max(10, 'Maximum 10 bedrooms'),
  
  propertyType: z.enum(['flat', 'house', 'maisonette', 'bungalow', 'other', 'any'], {
    required_error: 'Please select a property type'
  }),
  
  areas: z.string({
    required_error: 'Areas are required'
  }).min(2, 'Please enter at least one area').max(500, 'Areas list is too long'),
  
  notes: z.string({
    required_error: 'Additional details are required'
  }).min(20, 'Please provide at least 20 characters to help sellers understand your needs').max(1000, 'Notes must be 1000 characters or less'),
  
  accountEmail: z.string({
    required_error: 'Account email address is required'
  }).email('Please enter a valid email address'),
  
  timeframe: z.enum(['immediately', '1-3-months', '3-6-months', '6-12-months', '12-plus-months', 'flexible'], {
    required_error: 'Please select when you plan to move'
  }).optional(),
  
  features: z.array(z.string()).optional()
}).refine((data) => {
  const min = typeof data.budgetMin === 'string' ? parseBudgetInput(data.budgetMin) : data.budgetMin
  const max = typeof data.budgetMax === 'string' ? parseBudgetInput(data.budgetMax) : data.budgetMax
  return min !== undefined && max !== undefined && max >= min
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
}).refine((data) => data.bedsMax >= data.bedsMin, {
  message: 'Maximum bedrooms must be greater than or equal to minimum bedrooms',
  path: ['bedsMax']
})

type BuyerFormData = z.infer<typeof buyerFormSchema>

const PROPERTY_TYPES = [
  { value: 'house', label: 'House', icon: '🏠' },
  { value: 'flat', label: 'Flat/Apartment', icon: '🏢' },
  { value: 'maisonette', label: 'Maisonette', icon: '🏘️' },
  { value: 'bungalow', label: 'Bungalow', icon: '🏡' },
  { value: 'any', label: 'Any Type', icon: '🏛️' },
  { value: 'other', label: 'Other', icon: '🏗️' }
] as const

const TIMEFRAME_OPTIONS = [
  { value: 'immediately', label: 'Immediately', description: 'Ready to move now' },
  { value: '1-3-months', label: '1-3 months', description: 'Looking to move soon' },
  { value: '3-6-months', label: '3-6 months', description: 'Planning ahead' },
  { value: '6-12-months', label: '6-12 months', description: 'Early planning' },
  { value: '12-plus-months', label: '12+ months', description: 'Long-term planning' },
  { value: 'flexible', label: 'Flexible', description: 'No specific timeline' }
] as const

const FEATURE_OPTIONS = [
  { value: 'garden', label: 'Garden', icon: '🌳' },
  { value: 'parking', label: 'Parking', icon: '🚗' },
  { value: 'transport', label: 'Near Transport', icon: '🚇' },
  { value: 'schools', label: 'Good Schools', icon: '🎓' },
  { value: 'shopping', label: 'Near Shops', icon: '🛒' },
  { value: 'period', label: 'Period Features', icon: '🏛️' },
  { value: 'modern', label: 'Modern Kitchen', icon: '🍳' },
  { value: 'bathroom', label: 'Modern Bathroom', icon: '🚿' },
  { value: 'quiet', label: 'Quiet Area', icon: '🔇' },
  { value: 'family', label: 'Family Friendly', icon: '👨‍👩‍👧‍👦' }
] as const

const BUDGET_OPTIONS = [
  { value: 100000, label: '£100k' },
  { value: 200000, label: '£200k' },
  { value: 300000, label: '£300k' },
  { value: 400000, label: '£400k' },
  { value: 500000, label: '£500k' },
  { value: 600000, label: '£600k' },
  { value: 700000, label: '£700k' },
  { value: 800000, label: '£800k' },
  { value: 900000, label: '£900k' },
  { value: 1000000, label: '£1M' },
] as const

export default function BuyPage() {
  const toast = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const [postcodeTags, setPostcodeTags] = useState<string[]>([])
  const [postcodeInput, setPostcodeInput] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerFormSchema),
    defaultValues: {
      budgetMin: undefined,
      budgetMax: undefined,
      bedsMin: undefined,
      bedsMax: undefined,
      propertyType: undefined,
      areas: '',
      notes: '',
      accountEmail: '',
      timeframe: undefined,
      features: []
    }
  })

  // Auto-fill account email when user is signed in (after auth loads)
  useEffect(() => {
    if (!authLoading) {
      if (user?.email) {
        setValue('accountEmail', user.email)
      } else {
        setValue('accountEmail', '')
      }
    }
  }, [user, authLoading, setValue])

  // Reset form to empty when component mounts (only once)
  useEffect(() => {
    reset({
      budgetMin: undefined,
      budgetMax: undefined,
      bedsMin: undefined,
      bedsMax: undefined,
      propertyType: undefined,
      areas: '',
      notes: '',
      accountEmail: '',
      timeframe: undefined,
      features: []
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync postcode tags with form
  useEffect(() => {
    setValue('areas', postcodeTags.join(', '))
  }, [postcodeTags, setValue])

  // Sync features with form
  useEffect(() => {
    setValue('features', selectedFeatures)
  }, [selectedFeatures, setValue])

  const watchedBudgetMin = watch('budgetMin')
  const watchedBudgetMax = watch('budgetMax')
  const watchedBedsMin = watch('bedsMin')
  const watchedBedsMax = watch('bedsMax')
  const watchedNotes = watch('notes')
  const watchedPropertyType = watch('propertyType')
  const watchedTimeframe = watch('timeframe')

  const handleAddPostcode = () => {
    const trimmed = postcodeInput.trim().toUpperCase()
    if (!trimmed) return

    const result = normalizePostcode(trimmed)
    if (result.ok && result.district) {
      const district = result.district
      if (!postcodeTags.includes(district)) {
        setPostcodeTags([...postcodeTags, district])
        setPostcodeInput('')
      } else {
        toast.showToast('This postcode district is already added', 'info')
      }
    } else {
      toast.showToast('Please enter a valid UK postcode (e.g., SW1A, E1, N1)', 'error')
    }
  }

  const handleRemovePostcode = (tag: string) => {
    setPostcodeTags(postcodeTags.filter(t => t !== tag))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddPostcode()
    }
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const onSubmit = async (data: BuyerFormData) => {
    setIsSubmitting(true)
    
    try {
      if (postcodeTags.length === 0) {
        throw new Error('Please add at least one postcode district')
      }

      // Build enhanced description with features and timeframe
      let description = data.notes
      if (selectedFeatures.length > 0) {
        const featureLabels = selectedFeatures.map(f => 
          FEATURE_OPTIONS.find(opt => opt.value === f)?.label || f
        ).join(', ')
        description += `\n\nDesired features: ${featureLabels}`
      }
      if (data.timeframe) {
        const timeframeLabel = TIMEFRAME_OPTIONS.find(opt => opt.value === data.timeframe)?.label || data.timeframe
        description += `\n\nMove-in timeframe: ${timeframeLabel}`
      }

      // Parse budget inputs (handle k/m/b suffixes)
      const budgetMin = typeof data.budgetMin === 'string' ? parseBudgetInput(data.budgetMin) : data.budgetMin
      const budgetMax = typeof data.budgetMax === 'string' ? parseBudgetInput(data.budgetMax) : data.budgetMax
      
      if (budgetMin === undefined || budgetMax === undefined) {
        throw new Error('Please enter valid budget amounts')
      }

      // Create buyer request in Supabase
      const { createBuyerRequest } = await import('@/lib/supabase/queries')
      
      await createBuyerRequest({
        budget_min: budgetMin,
        budget_max: budgetMax,
        beds_min: data.bedsMin,
        beds_max: data.bedsMax,
        property_type: data.propertyType as 'flat' | 'house' | 'maisonette' | 'bungalow' | 'other' | 'any',
        postcode_districts: postcodeTags,
        description: description,
        email: data.accountEmail,
        status: 'active'
      })

      // Track buyer request posted
      analytics.buyerRequestPosted({
        budget_min: budgetMin,
        budget_max: budgetMax,
        beds_min: data.bedsMin,
        beds_max: data.bedsMax,
        property_type: data.propertyType,
        postcode_districts: postcodeTags
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
        }

        setNeedsVerification(true)
        setSubmittedEmail(data.accountEmail)
      }

      setIsSubmitted(true)
      toast.showToast('Your property brief has been posted successfully!', 'success')
    } catch (err: any) {
      console.error('Error creating buyer request:', err)
      toast.showToast(err.message || 'Failed to post your brief. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return ''
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
              
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
                <p className="text-sm text-primary">
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
              Create Your Property Brief
            </h1>
            <p className="text-lg text-slate-600">
              Tell sellers exactly what you're looking for and let them find you
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-fade-in">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Account Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5" style={{ color: '#91C8ED' }} />
                  <h2 className="text-xl font-semibold text-dark">Account Information</h2>
                </div>
                
                <div>
                  <label htmlFor="accountEmail" className="block text-sm font-medium text-slate-700 mb-2">
                    Account Email Address *
                  </label>
                  <input
                    {...register('accountEmail')}
                    type="email"
                    id="accountEmail"
                    className={`input-primary !focus:ring-[#91C8ED] !focus:border-[#91C8ED] ${errors.accountEmail ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
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

              </div>

              <div className="border-t border-slate-200"></div>

              {/* Budget Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Home className="w-5 h-5" style={{ color: '#91C8ED' }} />
                  <h2 className="text-xl font-semibold text-dark">Budget & Property Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="budgetMin" className="block text-sm font-medium text-slate-700 mb-2">
                      Minimum Budget (£) *
                    </label>
                    <div className="space-y-2">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10">£</span>
                        <input
                          {...register('budgetMin')}
                          type="text"
                          id="budgetMin"
                          className={`input-primary pl-8 !focus:ring-[#91C8ED] !focus:border-[#91C8ED] ${errors.budgetMin ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          placeholder="e.g., 100K, 1M"
                          aria-describedby={errors.budgetMin ? 'budgetMin-error' : 'budgetMin-help'}
                        />
                      </div>
                      {errors.budgetMin && (
                        <p id="budgetMin-error" className="mt-1 text-sm text-red-600">
                          {errors.budgetMin.message}
                        </p>
                      )}
                      <p id="budgetMin-help" className="text-xs text-slate-500">
                        Enter amount with K/M suffix (e.g., 300K, 1M)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budgetMax" className="block text-sm font-medium text-slate-700 mb-2">
                      Maximum Budget (£) *
                    </label>
                    <div className="space-y-2">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10">£</span>
                        <input
                          {...register('budgetMax')}
                          type="text"
                          id="budgetMax"
                          className={`input-primary pl-8 !focus:ring-[#91C8ED] !focus:border-[#91C8ED] ${errors.budgetMax ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                          placeholder="e.g., 100K, 1M"
                          aria-describedby={errors.budgetMax ? 'budgetMax-error' : 'budgetMax-help'}
                        />
                      </div>
                      {errors.budgetMax && (
                        <p id="budgetMax-error" className="mt-1 text-sm text-red-600">
                          {errors.budgetMax.message}
                        </p>
                      )}
                      <p id="budgetMax-help" className="text-xs text-slate-500">
                        Enter amount with K/M suffix (e.g., 500K, 1M)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget Range Display */}
                {watchedBudgetMin && watchedBudgetMax && (() => {
                  const min = typeof watchedBudgetMin === 'string' ? parseBudgetInput(watchedBudgetMin) : watchedBudgetMin
                  const max = typeof watchedBudgetMax === 'string' ? parseBudgetInput(watchedBudgetMax) : watchedBudgetMax
                  if (min && max) {
                    return (
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">Your budget range:</span>{' '}
                          <span className="font-semibold" style={{ color: '#91C8ED' }}>
                            {formatCurrency(min)} - {formatCurrency(max)}
                          </span>
                        </p>
                      </div>
                    )
                  }
                  return null
                })()}

                {/* Bedrooms Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="bedsMin" className="block text-sm font-medium text-slate-700 mb-2">
                      Minimum Bedrooms *
                    </label>
                    <input
                      {...register('bedsMin', { valueAsNumber: true })}
                      type="number"
                      id="bedsMin"
                      min="1"
                      max="10"
                      className={`input-primary !focus:ring-[#91C8ED] !focus:border-[#91C8ED] ${errors.bedsMin ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="e.g., 2"
                      aria-describedby={errors.bedsMin ? 'bedsMin-error' : 'bedsMin-help'}
                    />
                    {errors.bedsMin && (
                      <p id="bedsMin-error" className="mt-1 text-sm text-red-600">
                        {errors.bedsMin.message}
                      </p>
                    )}
                    <p id="bedsMin-help" className="mt-1 text-xs text-slate-500">
                      Enter the minimum number of bedrooms you need
                    </p>
                  </div>

                  <div>
                    <label htmlFor="bedsMax" className="block text-sm font-medium text-slate-700 mb-2">
                      Maximum Bedrooms *
                    </label>
                    <input
                      {...register('bedsMax', { valueAsNumber: true })}
                      type="number"
                      id="bedsMax"
                      min="1"
                      max="10"
                      className={`input-primary !focus:ring-[#91C8ED] !focus:border-[#91C8ED] ${errors.bedsMax ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="e.g., 4"
                      aria-describedby={errors.bedsMax ? 'bedsMax-error' : 'bedsMax-help'}
                    />
                    {errors.bedsMax && (
                      <p id="bedsMax-error" className="mt-1 text-sm text-red-600">
                        {errors.bedsMax.message}
                      </p>
                    )}
                    <p id="bedsMax-help" className="mt-1 text-xs text-slate-500">
                      Enter the maximum number of bedrooms you need
                    </p>
                  </div>
                </div>

                {/* Bedroom Range Display */}
                {watchedBedsMin && watchedBedsMax && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Bedroom range:</span>{' '}
                      <span className="font-semibold" style={{ color: '#91C8ED' }}>
                        {watchedBedsMin} - {watchedBedsMax} {watchedBedsMax === 1 ? 'bedroom' : 'bedrooms'}
                      </span>
                    </p>
                  </div>
                )}

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Property Type *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setValue('propertyType', type.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          watchedPropertyType === type.value
                            ? 'shadow-md'
                            : 'border-slate-200 hover:shadow-sm'
                        }`}
                        style={watchedPropertyType === type.value ? {
                          borderColor: '#91C8ED',
                          backgroundColor: 'rgba(145, 200, 237, 0.05)'
                        } : {
                          borderColor: undefined
                        }}
                        onMouseEnter={(e) => {
                          if (watchedPropertyType !== type.value) {
                            e.currentTarget.style.borderColor = 'rgba(145, 200, 237, 0.5)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (watchedPropertyType !== type.value) {
                            e.currentTarget.style.borderColor = ''
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{type.icon}</span>
                          <span className="font-medium text-slate-900">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <input
                    type="hidden"
                    {...register('propertyType')}
                  />
                  {errors.propertyType && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.propertyType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200"></div>

              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5" style={{ color: '#91C8ED' }} />
                  <h2 className="text-xl font-semibold text-dark">Location</h2>
                </div>

                <div>
                  <label htmlFor="postcodeInput" className="block text-sm font-medium text-slate-700 mb-2">
                    Postcode Districts *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="postcodeInput"
                      value={postcodeInput}
                      onChange={(e) => setPostcodeInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="input-primary flex-1 !focus:ring-[#91C8ED] !focus:border-[#91C8ED]"
                      placeholder="Enter postcode (e.g., SW1A, E1, N1)"
                    />
                    <button
                      type="button"
                      onClick={handleAddPostcode}
                      className="btn-primary whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter UK postcode districts and click Add. You can add multiple areas.
                  </p>
                  
                  {/* Postcode Tags */}
                  {postcodeTags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {postcodeTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
                          style={{ backgroundColor: 'rgba(145, 200, 237, 0.1)', color: '#91C8ED' }}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemovePostcode(tag)}
                            className="transition-colors"
                            style={{ color: '#91C8ED' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(145, 200, 237, 0.7)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#91C8ED' }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {errors.areas && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.areas.message}
                    </p>
                  )}
                  {postcodeTags.length === 0 && (
                    <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      Please add at least one postcode district
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200"></div>

              {/* Preferences Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5" style={{ color: '#91C8ED' }} />
                  <h2 className="text-xl font-semibold text-dark">Preferences</h2>
                </div>

                {/* Timeframe */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    When do you plan to move? (Optional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TIMEFRAME_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setValue('timeframe', option.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          watchedTimeframe === option.value
                            ? 'shadow-md'
                            : 'border-slate-200 hover:shadow-sm'
                        }`}
                        style={watchedTimeframe === option.value ? {
                          borderColor: '#91C8ED',
                          backgroundColor: 'rgba(145, 200, 237, 0.05)'
                        } : {
                          borderColor: undefined
                        }}
                        onMouseEnter={(e) => {
                          if (watchedTimeframe !== option.value) {
                            e.currentTarget.style.borderColor = 'rgba(145, 200, 237, 0.5)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (watchedTimeframe !== option.value) {
                            e.currentTarget.style.borderColor = ''
                          }
                        }}
                      >
                        <div className="font-medium text-slate-900">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Desired Features (Optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {FEATURE_OPTIONS.map((feature) => (
                      <button
                        key={feature.value}
                        type="button"
                        onClick={() => toggleFeature(feature.value)}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                          selectedFeatures.includes(feature.value)
                            ? 'shadow-md'
                            : 'border-slate-200 hover:shadow-sm'
                        }`}
                        style={selectedFeatures.includes(feature.value) ? {
                          borderColor: '#91C8ED',
                          backgroundColor: 'rgba(145, 200, 237, 0.05)'
                        } : {
                          borderColor: undefined
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedFeatures.includes(feature.value)) {
                            e.currentTarget.style.borderColor = 'rgba(145, 200, 237, 0.5)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedFeatures.includes(feature.value)) {
                            e.currentTarget.style.borderColor = ''
                          }
                        }}
                      >
                        <div className="text-2xl mb-1">{feature.icon}</div>
                        <div className="text-xs font-medium text-slate-900">{feature.label}</div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Select any features that are important to you
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200"></div>

              {/* Additional Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5" style={{ color: '#91C8ED' }} />
                  <h2 className="text-xl font-semibold text-dark">Additional Details</h2>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                    Tell sellers more about what you're looking for *
                  </label>
                  <textarea
                    {...register('notes')}
                    id="notes"
                    rows={6}
                    className={`input-primary resize-none !focus:ring-[#91C8ED] !focus:border-[#91C8ED] ${errors.notes ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="Describe your ideal property, must-haves, deal-breakers, lifestyle needs, and any specific requirements. The more detail you provide, the better sellers can match your needs..."
                    aria-describedby={errors.notes ? 'notes-error' : 'notes-help'}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    {errors.notes ? (
                      <p id="notes-error" className="text-sm text-red-600">
                        {errors.notes.message}
                      </p>
                    ) : (
                      <p id="notes-help" className="text-xs text-slate-500">
                        Be specific about what matters to you - location preferences, lifestyle needs, must-haves, etc.
                      </p>
                    )}
                    <p className={`text-xs ${(watchedNotes?.length || 0) > 900 ? 'text-red-600' : 'text-slate-500'}`}>
                      {(watchedNotes?.length || 0)} / 1000 characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting || postcodeTags.length === 0}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Posting your brief...
                    </>
                  ) : (
                    'Post Your Property Brief'
                  )}
                </button>
                <p className="mt-3 text-xs text-center text-slate-500">
                  By posting your brief, you agree to receive messages from verified sellers through our secure email relay system.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
