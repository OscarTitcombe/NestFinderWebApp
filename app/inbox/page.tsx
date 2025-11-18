'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getBuyerContacts, markContactAsRead } from '@/lib/supabase/queries'
import { getCurrentUser } from '@/lib/supabase/auth'
import { Mail, Calendar, Home, MapPin, ArrowLeft, Search, Filter, ChevronDown, X } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useToast } from '@/lib/toast'
import { InboxSkeleton, PageHeaderSkeleton } from '@/components/Skeletons'
import { analytics } from '@/lib/analytics'

interface BuyerContact {
  id: string
  seller_id: string
  buyer_request_id: string
  seller_email: string
  message: string
  status: 'pending' | 'sent' | 'read' | 'replied'
  created_at: string
  updated_at: string
  buyer_requests: {
    id: string
    budget_min: number
    budget_max: number
    beds_min: number
    beds_max: number | null
    property_type: string
    postcode_districts: string[]
    description: string
  }
}

type FilterType = 'all' | 'unread' | 'read'
type SortType = 'newest' | 'oldest' | 'sender'

export default function InboxPage() {
  const router = useRouter()
  const toast = useToast()
  const [user, setUser] = useState<any>(null)
  const [contacts, setContacts] = useState<BuyerContact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<BuyerContact | null>(null)
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<SortType>('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/signin')
        return
      }

      setUser(currentUser)

      try {
        const data = await getBuyerContacts()
        setContacts(data as BuyerContact[])
      } catch (error: any) {
        console.error('Error loading inbox:', error)
        toast.showToast('Failed to load messages', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router, toast])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const handleMarkAsRead = async (contactId: string) => {
    setMarkingAsRead(contactId)
    try {
      await markContactAsRead(contactId)
      
      // Track message read
      analytics.messageRead(contactId)
      
      // Update local state
      setContacts(prev => prev.map(c => 
        c.id === contactId ? { ...c, status: 'read' as const } : c
      ))
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, status: 'read' })
      }
      toast.showToast('Marked as read', 'success')
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to mark as read', 'error')
    } finally {
      setMarkingAsRead(null)
    }
  }

  // Get initials for avatar
  const getInitials = (email: string) => {
    const name = email.split('@')[0]
    return name.substring(0, 2).toUpperCase()
  }

  // Filter and sort contacts
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = [...contacts]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(contact =>
        contact.seller_email.toLowerCase().includes(query) ||
        contact.message.toLowerCase().includes(query) ||
        contact.buyer_requests.postcode_districts.some(pc => pc.toLowerCase().includes(query))
      )
    }

    // Apply status filter
    if (filter === 'unread') {
      filtered = filtered.filter(c => c.status !== 'read' && c.status !== 'replied')
    } else if (filter === 'read') {
      filtered = filtered.filter(c => c.status === 'read' || c.status === 'replied')
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'sender':
          return a.seller_email.localeCompare(b.seller_email)
        default:
          return 0
      }
    })

    return filtered
  }, [contacts, searchQuery, filter, sortBy])

  const unreadCount = contacts.filter(c => c.status !== 'read' && c.status !== 'replied').length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
            <PageHeaderSkeleton />
            <InboxSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-1.5 sm:mb-2">Inbox</h1>
                <p className="text-sm sm:text-base text-slate-600">
                  Messages from sellers about your buyer requests
                </p>
              </div>
              {unreadCount > 0 && (
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-nest-mint text-white rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                  {unreadCount} {unreadCount === 1 ? 'unread' : 'unread'}
                </div>
              )}
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm sm:text-base text-slate-600 hover:text-nest-mint transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" />
              Back to dashboard
            </Link>
          </div>

          {contacts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 lg:p-16 text-center shadow-sm">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-nest-sageBg rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-nest-mint" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-dark mb-2 sm:mb-3">No messages yet</h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                When sellers contact you about your buyer requests, their messages will appear here.
              </p>
              <Link href="/market" className="btn-primary inline-flex items-center text-sm sm:text-base">
                Browse market
              </Link>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Search and Filter Bar */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search messages, sellers, or postcodes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-10 sm:pr-4 py-2.5 sm:py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-nest-sea focus:border-nest-sea outline-none transition-all text-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        aria-label="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 rounded-lg p-1">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-2.5 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
                        filter === 'all'
                          ? 'bg-white text-nest-mint shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      All ({contacts.length})
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`px-2.5 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all relative min-h-[44px] ${
                        filter === 'unread'
                          ? 'bg-white text-nest-mint shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Unread
                      {unreadCount > 0 && (
                        <span className="ml-1 sm:ml-2 px-1.5 py-0.5 bg-nest-mint text-white text-xs rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setFilter('read')}
                      className={`px-2.5 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all min-h-[44px] ${
                        filter === 'read'
                          ? 'bg-white text-nest-mint shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Read
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSortMenu(!showSortMenu)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs sm:text-sm font-medium text-slate-700 min-h-[44px] w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {sortBy === 'newest' && 'Newest first'}
                        {sortBy === 'oldest' && 'Oldest first'}
                        {sortBy === 'sender' && 'By sender'}
                      </span>
                      <span className="sm:hidden">Sort</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showSortMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowSortMenu(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20 animate-scale-in">
                          <button
                            onClick={() => {
                              setSortBy('newest')
                              setShowSortMenu(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              sortBy === 'newest'
                                ? 'bg-nest-sageBg text-nest-mint font-medium'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            Newest first
                          </button>
                          <button
                            onClick={() => {
                              setSortBy('oldest')
                              setShowSortMenu(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              sortBy === 'oldest'
                                ? 'bg-nest-sageBg text-nest-mint font-medium'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            Oldest first
                          </button>
                          <button
                            onClick={() => {
                              setSortBy('sender')
                              setShowSortMenu(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              sortBy === 'sender'
                                ? 'bg-nest-sageBg text-nest-mint font-medium'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            By sender
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Results count */}
                {(searchQuery || filter !== 'all') && (
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-200">
                    <p className="text-xs sm:text-sm text-slate-600">
                      Showing {filteredAndSortedContacts.length} of {contacts.length} messages
                    </p>
                  </div>
                )}
              </div>

              {/* Messages Grid */}
              {filteredAndSortedContacts.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 text-center">
                  <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-dark mb-2">No messages found</h3>
                  <p className="text-sm sm:text-base text-slate-600 px-4">
                    {searchQuery
                      ? 'Try adjusting your search terms'
                      : filter === 'unread'
                      ? 'You have no unread messages'
                      : 'You have no read messages'}
                  </p>
                  {(searchQuery || filter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setFilter('all')
                      }}
                      className="mt-4 text-sm text-nest-mint hover:text-nest-mintHover font-medium min-h-[44px] px-4 py-2"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Messages List */}
                  <div className="lg:col-span-1 space-y-2 sm:space-y-3 max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-300px)] overflow-y-auto pr-1 sm:pr-2">
                    {filteredAndSortedContacts.map((contact, index) => {
                      const isUnread = contact.status !== 'read' && contact.status !== 'replied'
                      return (
                        <button
                          key={contact.id}
                          onClick={() => {
                            setSelectedContact(contact)
                            // Auto-mark as read when opened
                            if (isUnread) {
                              handleMarkAsRead(contact.id)
                            }
                          }}
                          className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 relative min-h-[80px] ${
                            selectedContact?.id === contact.id
                              ? 'border-nest-mint bg-nest-mint/10 shadow-lg ring-2 ring-nest-mint/20'
                              : isUnread
                              ? 'border-slate-200 bg-white hover:border-nest-mint/50 hover:shadow-md'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                          }`}
                          style={{
                            animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                          }}
                        >
                          {/* Unread indicator */}
                          {isUnread && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-nest-mint rounded-l-xl" />
                          )}

                          <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                              isUnread
                                ? 'bg-nest-mint text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                              {getInitials(contact.seller_email)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1 gap-2">
                                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                                  <span className={`text-xs sm:text-sm font-semibold truncate ${
                                    isUnread ? 'text-dark' : 'text-slate-700'
                                  }`}>
                                    {contact.seller_email.split('@')[0]}
                                  </span>
                                  {isUnread && (
                                    <span className="flex-shrink-0 w-2 h-2 bg-nest-mint rounded-full" />
                                  )}
                                </div>
                                <span className="text-xs text-slate-500 flex-shrink-0">
                                  {formatDate(contact.created_at)}
                                </span>
                              </div>
                              <p className={`text-xs sm:text-sm line-clamp-2 mb-1.5 sm:mb-2 ${
                                isUnread ? 'text-slate-800 font-medium' : 'text-slate-600'
                              }`}>
                                {contact.message}
                              </p>
                              <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-500 flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                  <span className="truncate">
                                    {formatCurrency(contact.buyer_requests.budget_min)} - {formatCurrency(contact.buyer_requests.budget_max)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                  <span className="truncate max-w-[80px] sm:max-w-[100px]">
                                    {contact.buyer_requests.postcode_districts[0]}
                                    {contact.buyer_requests.postcode_districts.length > 1 && '+'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Message Detail */}
                  <div className="lg:col-span-2">
                    {selectedContact ? (
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in">
                        {/* Message Header */}
                        <div className="border-b border-slate-200 p-4 sm:p-6 bg-slate-50/50">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                              {/* Avatar */}
                              <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold ${
                                selectedContact.status !== 'read' && selectedContact.status !== 'replied'
                                  ? 'bg-nest-mint text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}>
                                {getInitials(selectedContact.seller_email)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                                  <h2 className="text-lg sm:text-xl font-bold text-dark truncate">
                                    {selectedContact.seller_email.split('@')[0]}
                                  </h2>
                                  {selectedContact.status !== 'read' && selectedContact.status !== 'replied' && (
                                    <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-nest-mint text-white rounded-full text-xs font-semibold flex-shrink-0">
                                      New
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center text-xs sm:text-sm text-slate-600 gap-2 sm:gap-4">
                                  <div className="flex items-center gap-1 sm:gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="break-words">
                                      {new Date(selectedContact.created_at).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                  </div>
                                  <div className="hidden sm:block text-slate-400">•</div>
                                  <span className="text-slate-500 break-all">{selectedContact.seller_email}</span>
                                </div>
                              </div>
                            </div>
                            {selectedContact.status !== 'read' && selectedContact.status !== 'replied' && (
                              <button
                                onClick={() => handleMarkAsRead(selectedContact.id)}
                                disabled={markingAsRead === selectedContact.id}
                                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 font-medium min-h-[44px] w-full sm:w-auto"
                              >
                                {markingAsRead === selectedContact.id ? 'Marking...' : 'Mark as read'}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">

                          {/* Buyer Request Info */}
                          <div className="bg-nest-sageBg rounded-xl p-4 sm:p-5 border border-nest-line">
                            <h3 className="text-xs sm:text-sm font-bold text-dark mb-2 sm:mb-3 flex items-center gap-2">
                              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nest-mint flex-shrink-0" />
                              About your request
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-slate-700">
                                <span className="font-medium text-slate-500">Budget:</span>
                                <span className="font-semibold break-words">
                                  {formatCurrency(selectedContact.buyer_requests.budget_min)} - {formatCurrency(selectedContact.buyer_requests.budget_max)}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-slate-700">
                                <span className="font-medium text-slate-500">Property:</span>
                                <span className="font-semibold">
                                  {selectedContact.buyer_requests.beds_min} {selectedContact.buyer_requests.beds_min === 1 ? 'bed' : 'beds'} • {selectedContact.buyer_requests.property_type}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-slate-700 sm:col-span-2">
                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nest-mint flex-shrink-0" />
                                <span className="font-medium text-slate-500">Areas:</span>
                                <span className="font-semibold break-words">{selectedContact.buyer_requests.postcode_districts.join(', ')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Message Content */}
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-dark mb-2 sm:mb-3 flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nest-mint flex-shrink-0" />
                              Message
                            </h3>
                            <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                              <p className="text-sm sm:text-base text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {selectedContact.message}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="border-t border-slate-200 pt-4 sm:pt-6">
                            <a
                              href={`mailto:${selectedContact.seller_email}?subject=Re: Your property inquiry&body=Hi,%0D%0A%0D%0AThank you for your message about my buyer request.%0D%0A%0D%0A`}
                              className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                            >
                              <Mail className="w-4 h-4" />
                              Reply via Email
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 lg:p-16 text-center shadow-sm">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-nest-sageBg rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-dark mb-2">Select a message</h3>
                        <p className="text-sm sm:text-base text-slate-600 px-4">
                          Choose a message from the list to view its details
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

