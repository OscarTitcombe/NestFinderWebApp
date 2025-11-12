'use client'

import { useState } from 'react'
import { MapPin, Home } from 'lucide-react'
import clsx from 'clsx'

interface Buyer {
  id: string
  budget: number
  budgetMin?: number
  budgetMax?: number
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
  const [expanded, setExpanded] = useState(false)

  // Format money helper - returns number with commas, no currency symbol
  const fmt = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const budgetMin = buyer.budgetMin ?? buyer.budget
  const budgetMax = buyer.budgetMax ?? buyer.budget
  const bedsMin = buyer.minBeds
  const bedsMax = buyer.maxBeds
  const notes = buyer.description

  return (
    <div className="rounded-2xl border border-nest-line bg-white shadow-sm hover:shadow-md hover:-translate-y-[1px] hover:border-slate-300 transition p-5 sm:p-6 relative">
      {/* Price - H1 large, tight, single line with en-dash */}
      <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
        £{fmt(budgetMin)}–£{fmt(budgetMax)}
      </h3>

      {/* Fit summary row - icon + compact meta */}
      <div className="mt-1 flex items-center gap-3 text-slate-700">
        <Home className="h-4 w-4 text-nest-mint" />
        <span className="text-sm sm:text-base">
          {buyer.propertyType} • {bedsMin}{bedsMax && bedsMax !== bedsMin ? `–${bedsMax}` : ''} beds
        </span>
      </div>

      {/* Divider */}
      <div className="mt-4 h-px bg-nest-line/60" />

      {/* Areas row */}
      <div className="mt-4">
        <div className="flex items-center gap-2 text-slate-700 mb-2">
          <MapPin className="h-4 w-4 text-nest-mint" />
          <span className="text-sm font-medium">Areas</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {buyer.areas.map((pc, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-nest-sageBg text-slate-700 text-xs font-medium px-2.5 py-1 border border-nest-line"
            >
              {pc}
            </span>
          ))}
        </div>
      </div>

      {/* Notes - 2-line clamp + expand */}
      <p
        className={clsx(
          'mt-4 text-slate-700 text-sm sm:text-base',
          expanded ? '' : 'line-clamp-2'
        )}
      >
        {notes}
      </p>
      {notes && notes.length > 90 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-nest-sea text-sm hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      {/* CTA footer - inside card, sticky feel */}
      <div className="mt-5">
        <button
          onClick={onContact}
          className="w-full rounded-xl bg-nest-mint hover:bg-nest-mintHover text-white font-semibold py-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nest-sea"
        >
          I might have a property
        </button>
      </div>
    </div>
  )
}
