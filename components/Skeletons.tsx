'use client'

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-slate-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-64 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-32"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-slate-200 rounded"></div>
          <div className="w-8 h-8 bg-slate-200 rounded"></div>
          <div className="w-8 h-8 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mt-2"></div>
    </div>
  )
}

// Buyer Card Skeleton
export function BuyerCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-8 bg-slate-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>
        <div className="h-3 bg-slate-200 rounded w-16"></div>
      </div>
      <div className="mb-4">
        <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-slate-200 rounded w-12"></div>
          <div className="h-6 bg-slate-200 rounded w-12"></div>
          <div className="h-6 bg-slate-200 rounded w-12"></div>
        </div>
      </div>
      <div className="mb-6">
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="h-10 bg-slate-200 rounded-xl"></div>
    </div>
  )
}

// Dashboard List Skeleton
export function DashboardListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// Market Grid Skeleton
export function MarketGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BuyerCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Inbox Skeleton
export function InboxSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Messages List */}
      <div className="lg:col-span-1 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 animate-pulse">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-slate-200 rounded-full"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
              </div>
              <div className="h-3 bg-slate-200 rounded w-12"></div>
            </div>
            <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      
      {/* Message Detail */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-32 mb-6"></div>
          <div className="h-32 bg-slate-200 rounded mb-6"></div>
          <div className="h-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

// Form Skeleton
export function FormSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-pulse">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
            <div className="h-10 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div>
          <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
          <div className="h-10 bg-slate-200 rounded"></div>
        </div>
        <div>
          <div className="h-4 bg-slate-200 rounded w-40 mb-2"></div>
          <div className="h-24 bg-slate-200 rounded"></div>
        </div>
        <div className="h-12 bg-slate-200 rounded"></div>
      </div>
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-slate-200">
        <div className="h-5 bg-slate-200 rounded w-32"></div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-slate-200 last:border-b-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-32"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Page Header Skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-96"></div>
    </div>
  )
}




