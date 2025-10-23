'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Mail, User, MessageSquare } from 'lucide-react'

// Zod validation schema
const contactFormSchema = z.object({
  name: z.string({
    required_error: 'Name is required'
  }).min(2, 'Name must be at least 2 characters').max(100, 'Name must be 100 characters or less'),
  
  email: z.string({
    required_error: 'Email is required'
  }).email('Please enter a valid email address'),
  
  message: z.string({
    required_error: 'Message is required'
  }).min(10, 'Please provide at least 10 characters').max(800, 'Message must be 800 characters or less')
})

type ContactFormData = z.infer<typeof contactFormSchema>

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: ''
    }
  })

  const watchedMessage = watch('message')

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Contact form data:', data)
    
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
              Message sent — we'll get back to you soon.
            </h1>
            
            <p className="text-lg text-slate-600 mb-8">
              Thank you for contacting us. We typically respond within 24 hours and will get back to you as soon as possible.
            </p>
            
            <Link
              href="/"
              className="btn-primary inline-flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
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
              Contact us
            </h1>
            <p className="text-lg text-slate-600">
              Have a question or need help? We'd love to hear from you.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Your name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className={`input-primary pl-10 ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="John Doe"
                    aria-describedby={errors.name ? 'name-error' : 'name-help'}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
                <p id="name-help" className="mt-1 text-xs text-slate-500">
                  How should we address you?
                </p>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className={`input-primary pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="your@email.com"
                    aria-describedby={errors.email ? 'email-error' : 'email-help'}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
                <p id="email-help" className="mt-1 text-xs text-slate-500">
                  We'll use this to respond to your message
                </p>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={6}
                    className={`input-primary resize-none pl-10 ${errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    placeholder="Tell us how we can help you..."
                    aria-describedby={errors.message ? 'message-error' : 'message-help'}
                  />
                </div>
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
                <div className="flex justify-between items-center mt-1">
                  <p id="message-help" className="text-xs text-slate-500">
                    Please provide as much detail as possible
                  </p>
                  <p className="text-xs text-slate-400">
                    {watchedMessage?.length || 0}/800
                  </p>
                </div>
              </div>

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
                    'Send message'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

