'use client'

import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'

interface FilterBarProps {
  onFilterChange: (filters: {
    minBudget: number
    maxBudget: number
    beds: number
    propertyType: string
  }) => void
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [minBudget, setMinBudget] = useState(0)
  const [maxBudget, setMaxBudget] = useState(1000000)
  const [beds, setBeds] = useState(1)
  const [propertyType, setPropertyType] = useState('Any')

  useEffect(() => {
    onFilterChange({
      minBudget,
      maxBudget,
      beds,
      propertyType
    })
  }, [minBudget, maxBudget, beds, propertyType])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 mb-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <h2 className="text-lg font-semibold text-dark">Filter buyers</h2>
      </div>

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
            <option value={1}>1+ beds</option>
            <option value={2}>2+ beds</option>
            <option value={3}>3+ beds</option>
            <option value={4}>4+ beds</option>
            <option value={5}>5+ beds</option>
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
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            Min: {formatCurrency(minBudget)}
          </span>
        )}
        {maxBudget < 2000000 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            Max: {formatCurrency(maxBudget)}
          </span>
        )}
        {beds > 1 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {beds}+ beds
          </span>
        )}
        {propertyType !== 'Any' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {propertyType}
          </span>
        )}
      </div>
    </div>
  )
}
