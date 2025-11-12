'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBuyerContacts, markContactAsRead } from '@/lib/supabase/queries'
import { getCurrentUser } from '@/lib/supabase/auth'
import { Mail, Calendar, Home, MapPin, CheckCircle, Circle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useToast } from '@/lib/toast'
import { InboxSkeleton, PageHeaderSkeleton } from '@/components/Skeletons'

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

export default function InboxPage() {
  const router = useRouter()
  const toast = useToast()
  const [user, setUser] = useState<any>(null)
  const [contacts, setContacts] = useState<BuyerContact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<BuyerContact | null>(null)
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null)

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

  const unreadCount = contacts.filter(c => c.status !== 'read' && c.status !== 'replied').length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-1 container-custom py-8">
          <div className="max-w-6xl mx-auto">
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
      <main className="flex-1 container-custom py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-dark mb-2">Inbox</h1>
                <p className="text-slate-600">
                  Messages from sellers about your buyer requests
                </p>
              </div>
              {unreadCount > 0 && (
                <div className="px-4 py-2 bg-nest-mint text-white rounded-full text-sm font-medium">
                  {unreadCount} {unreadCount === 1 ? 'unread' : 'unread'}
                </div>
              )}
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-slate-600 hover:text-nest-mint transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to dashboard
            </Link>
          </div>

          {contacts.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <Mail className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-dark mb-2">No messages yet</h3>
              <p className="text-slate-600 mb-6">
                When sellers contact you about your buyer requests, their messages will appear here.
              </p>
              <Link href="/market" className="btn-primary inline-flex items-center">
                Browse market
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages List */}
              <div className="lg:col-span-1 space-y-3">
                {contacts.map((contact, index) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact)
                      // Auto-mark as read when opened
                      if (contact.status !== 'read' && contact.status !== 'replied') {
                        handleMarkAsRead(contact.id)
                      }
                    }}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedContact?.id === contact.id
                        ? 'border-nest-mint bg-nest-mint/5 shadow-md scale-[1.02]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm hover:scale-[1.01]'
                    }`}
                    style={{
                      animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {contact.status === 'read' || contact.status === 'replied' ? (
                          <CheckCircle className="w-4 h-4 text-slate-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-nest-mint fill-nest-mint" />
                        )}
                        <span className="text-sm font-medium text-dark">
                          {contact.seller_email.split('@')[0]}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {formatDate(contact.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {contact.message}
                    </p>
                    <div className="flex items-center text-xs text-slate-500">
                      <Home className="w-3 h-3 mr-1" />
                      <span>
                        {formatCurrency(contact.buyer_requests.budget_min)} - {formatCurrency(contact.buyer_requests.budget_max)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-2">
                {selectedContact ? (
                  <div className="bg-white rounded-lg border border-slate-200 p-6 animate-fade-in">
                    {/* Message Header */}
                    <div className="border-b border-slate-200 pb-4 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <h2 className="text-xl font-semibold text-dark">
                              Message from {selectedContact.seller_email.split('@')[0]}
                            </h2>
                            {selectedContact.status !== 'read' && selectedContact.status !== 'replied' && (
                              <span className="px-2 py-1 bg-nest-mint/10 text-nest-mint rounded-full text-xs font-medium">
                                New
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-slate-500 space-x-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(selectedContact.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        {selectedContact.status !== 'read' && selectedContact.status !== 'replied' && (
                          <button
                            onClick={() => handleMarkAsRead(selectedContact.id)}
                            disabled={markingAsRead === selectedContact.id}
                            className="px-3 py-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {markingAsRead === selectedContact.id ? 'Marking...' : 'Mark as read'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Buyer Request Info */}
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <h3 className="text-sm font-semibold text-dark mb-2">About your request:</h3>
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Home className="w-4 h-4 mr-2" />
                          <span>
                            {formatCurrency(selectedContact.buyer_requests.budget_min)} - {formatCurrency(selectedContact.buyer_requests.budget_max)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-4 h-4 mr-2"></span>
                          <span>
                            {selectedContact.buyer_requests.beds_min} {selectedContact.buyer_requests.beds_min === 1 ? 'bed' : 'beds'} • {selectedContact.buyer_requests.property_type}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{selectedContact.buyer_requests.postcode_districts.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-dark mb-2">Message:</h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                          {selectedContact.message}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Seller email:</span> {selectedContact.seller_email}
                      </div>
                      <div className="flex space-x-3">
                        <a
                          href={`mailto:${selectedContact.seller_email}?subject=Re: Your property inquiry&body=Hi,%0D%0A%0D%0AThank you for your message about my buyer request.%0D%0A%0D%0A`}
                          className="btn-primary"
                        >
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                    <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">Select a message to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

