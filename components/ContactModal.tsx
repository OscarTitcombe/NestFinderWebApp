'use client'

import { useState } from 'react'
import { X, Mail, Home, Calendar } from 'lucide-react'

interface Buyer {
  id: string
  budget: number
  minBeds: number
  maxBeds: number
  propertyType: string
  areas: string[]
  description: string
  postedDate: string
}

interface ContactModalProps {
  buyer: Buyer
  onClose: () => void
}

export default function ContactModal({ buyer, onClose }: ContactModalProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getBedroomText = (min: number, max: number) => {
    if (min === max) return `${min} bed${min > 1 ? 's' : ''}`
    return `${min}-${max} beds`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form and close modal
    setEmail('')
    setMessage('')
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-semibold text-dark">Contact Buyer</h2>
              <p className="text-sm text-slate-600 mt-1">
                Send a message about your property
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Buyer Info */}
          <div className="p-6 border-b border-slate-200 bg-[#F5F5F5]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-lg font-semibold text-dark">
                  {formatCurrency(buyer.budget)}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Home className="w-4 h-4 mr-1" />
                  {buyer.propertyType} • {getBedroomText(buyer.minBeds, buyer.maxBeds)}
                </div>
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <Calendar className="w-3 h-3 mr-1" />
                {buyer.postedDate}
              </div>
            </div>
            <p className="text-sm text-slate-600">{buyer.description}</p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Your email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-primary pl-10"
                    required
                    aria-describedby="email-help"
                  />
                </div>
                <p id="email-help" className="mt-1 text-xs text-slate-500">
                  We'll use this to connect you with the buyer
                </p>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message to buyer
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the buyer about your property..."
                  rows={4}
                  className="input-primary resize-none"
                  required
                  aria-describedby="message-help"
                />
                <p id="message-help" className="mt-1 text-xs text-slate-500">
                  Include details about your property that match their requirements
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-[#F5F5F5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !email.trim() || !message.trim()}
                className="flex-1 bg-nest-mint hover:bg-nest-mintHover text-white text-sm py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send message'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

