'use client'

import { MapPin, Home, Calendar } from 'lucide-react'

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

interface BuyerCardProps {
  buyer: Buyer
  onContact: () => void
}

export default function BuyerCard({ buyer, onContact }: BuyerCardProps) {
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

  return (
    <div className="card group hover:shadow-lg transition-all duration-200">
      {/* Header with budget and property type */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-2xl font-bold text-dark mb-1">
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

      {/* Areas */}
      <div className="mb-4">
        <div className="flex items-center text-sm text-slate-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          Looking in:
        </div>
        <div className="flex flex-wrap gap-1">
          {buyer.areas.map((area, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-sm text-slate-600 line-clamp-3">
          {buyer.description}
        </p>
      </div>

      {/* Contact Button */}
      <button
        onClick={onContact}
        className="w-full btn-primary text-sm py-2.5 group-hover:bg-[#7A9A3A] transition-colors"
        aria-label={`Contact buyer looking for ${buyer.propertyType} up to ${formatCurrency(buyer.budget)}`}
      >
        I might have a property
      </button>
    </div>
  )
}
