'use client'

import { useState, useEffect } from 'react'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'

interface FilterBarProps {
  onFilterChange: (filters: {
    minBudget: number
    maxBudget: number
    beds: number
    propertyType: string
  }) => void
  initialValues?: {
    propertyType: string
    budget: string
    bedrooms: string
    timeframe: string
    features: string[]
  } | null
}

export default function FilterBar({ onFilterChange, initialValues }: FilterBarProps) {
  // Helper function to convert quiz budget to filter values
  const getBudgetRange = (budget: string) => {
    switch (budget) {
      case 'under-300k': return { min: 0, max: 300000 }
      case '300k-500k': return { min: 300000, max: 500000 }
      case '500k-750k': return { min: 500000, max: 750000 }
      case '750k-1m': return { min: 750000, max: 1000000 }
      case 'over-1m': return { min: 1000000, max: 2000000 }
      case 'any-budget': return { min: 0, max: 2000000 }
      default: return { min: 0, max: 1000000 }
    }
  }

  // Helper function to convert quiz bedrooms to filter value
  const getBedrooms = (bedrooms: string) => {
    return parseInt(bedrooms) || 0
  }

  // Helper function to convert quiz property type to filter value
  const getPropertyType = (type: string) => {
    switch (type) {
      case 'house': return 'House'
      case 'flat': return 'Flat'
      case 'bungalow': return 'Bungalow'
      case 'any': return 'Any'
      default: return 'Any'
    }
  }

  const initialBudget = initialValues ? getBudgetRange(initialValues.budget) : { min: 0, max: 1000000 }
  const initialBeds = initialValues ? getBedrooms(initialValues.bedrooms) : 0
  const initialPropertyType = initialValues ? getPropertyType(initialValues.propertyType) : 'Any'

  const [minBudget, setMinBudget] = useState(initialBudget.min)
  const [maxBudget, setMaxBudget] = useState(initialBudget.max)
  const [beds, setBeds] = useState(initialBeds)
  const [propertyType, setPropertyType] = useState(initialPropertyType)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  useEffect(() => {
    onFilterChange({
      minBudget,
      maxBudget,
      beds,
      propertyType
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minBudget, maxBudget, beds, propertyType])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Count active filters for mobile button
  const activeFiltersCount = [
    minBudget > 0,
    maxBudget < 2000000,
    beds > 0,
    propertyType !== 'Any'
  ].filter(Boolean).length

  return (
    <div className="bg-white">
      {/* Mobile: Filter Button */}
      <button
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        className="md:hidden w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-slate-600" />
          <span className="text-base font-semibold text-dark">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-nest-mint text-white text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {isMobileFiltersOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {/* Desktop: Filter Header */}
      <div className="hidden md:flex items-center gap-4 mb-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <h2 className="text-lg font-semibold text-dark">Filter buyers</h2>
      </div>

      {/* Filters - Hidden on mobile by default, shown when button clicked */}
      <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Budget Range */}
        <div className="space-y-2">
          <label htmlFor="min-budget" className="block text-sm font-medium text-slate-700">
            Min Budget
          </label>
          <select
            id="min-budget"
            value={minBudget}
            onChange={(e) => setMinBudget(Number(e.target.value))}
            className="input-primary text-sm"
            aria-label="Minimum budget"
          >
            <option value={0}>No minimum</option>
            <option value={200000}>£200k</option>
            <option value={300000}>£300k</option>
            <option value={400000}>£400k</option>
            <option value={500000}>£500k</option>
            <option value={600000}>£600k</option>
            <option value={700000}>£700k</option>
            <option value={800000}>£800k</option>
            <option value={900000}>£900k</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="max-budget" className="block text-sm font-medium text-slate-700">
            Max Budget
          </label>
          <select
            id="max-budget"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="input-primary text-sm"
            aria-label="Maximum budget"
          >
            <option value={300000}>£300k</option>
            <option value={400000}>£400k</option>
            <option value={500000}>£500k</option>
            <option value={600000}>£600k</option>
            <option value={700000}>£700k</option>
            <option value={750000}>£750k</option>
            <option value={800000}>£800k</option>
            <option value={900000}>£900k</option>
            <option value={1000000}>£1M</option>
            <option value={1500000}>£1.5M</option>
            <option value={2000000}>£2M+</option>
          </select>
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <label htmlFor="beds" className="block text-sm font-medium text-slate-700">
            Bedrooms
          </label>
          <select
            id="beds"
            value={beds}
            onChange={(e) => setBeds(Number(e.target.value))}
            className="input-primary text-sm"
            aria-label="Number of bedrooms"
          >
            <option value={0}>Any</option>
            <option value={1}>1 bed</option>
            <option value={2}>2 beds</option>
            <option value={3}>3 beds</option>
            <option value={4}>4 beds</option>
            <option value={5}>5 beds</option>
          </select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label htmlFor="property-type" className="block text-sm font-medium text-slate-700">
            Property Type
          </label>
          <select
            id="property-type"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="input-primary text-sm"
            aria-label="Property type"
          >
            <option value="Any">Any type</option>
            <option value="Flat">Flat</option>
            <option value="House">House</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Maisonette">Maisonette</option>
          </select>
        </div>
        </div>

        {/* Active Filters Display */}
        <div className="mt-4 flex flex-wrap gap-2">
          {minBudget > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-nest-mint/10 text-nest-mint">
              Min: {formatCurrency(minBudget)}
            </span>
          )}
          {maxBudget < 2000000 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-nest-mint/10 text-nest-mint">
              Max: {formatCurrency(maxBudget)}
            </span>
          )}
          {beds > 1 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-nest-mint/10 text-nest-mint">
              {beds}+ beds
            </span>
          )}
          {propertyType !== 'Any' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-nest-mint/10 text-nest-mint">
              {propertyType}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
