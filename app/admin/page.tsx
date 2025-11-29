'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  FileText, 
  Mail, 
  TrendingUp,
  Trash2,
  Search,
  X,
  MapPin,
  Home,
  Calendar,
  DollarSign,
  ExternalLink,
  Eye
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useToast } from '@/lib/toast'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Stats {
  users: { total: number }
  buyerRequests: { total: number; active: number }
  contacts: { total: number; unread: number }
}

interface BuyerRequest {
  id: string
  user_id: string | null
  budget_min: number
  budget_max: number
  beds_min: number
  beds_max: number | null
  property_type: string
  postcode_districts: string[]
  description: string
  email: string
  status: string
  created_at: string
  profiles: { id: string; email: string; full_name: string | null } | null
}


interface Contact {
  id: string
  seller_email: string
  message: string
  status: string
  created_at: string
  buyer_requests: {
    id: string
    budget_min: number
    budget_max: number
    postcode_districts: string[]
    profiles: { id: string; email: string; full_name: string | null } | null
  }
  seller_profiles: { id: string; email: string; full_name: string | null } | null
}

type TabType = 'overview' | 'buyer-requests' | 'messages' | 'users'

export default function AdminDashboard() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [buyerStatusFilter, setBuyerStatusFilter] = useState<string>('all')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger' as 'danger' | 'warning' | 'info'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      const [statsRes, buyerRes, contactsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/buyer-requests'),
        fetch('/api/admin/contacts'),
        fetch('/api/admin/users')
      ])

      // Check each response for errors
      if (!statsRes.ok) {
        const errorData = await statsRes.json()
        if (statsRes.status === 401) {
          toast.showToast('Unauthorized: Admin access required', 'error')
          router.push('/dashboard')
          return
        }
        throw new Error(errorData.error || 'Failed to load stats')
      }
      if (!buyerRes.ok) {
        const errorData = await buyerRes.json()
        throw new Error(errorData.error || 'Failed to load buyer requests')
      }
      if (!contactsRes.ok) {
        const errorData = await contactsRes.json()
        throw new Error(errorData.error || 'Failed to load contacts')
      }
      if (!usersRes.ok) {
        const errorData = await usersRes.json()
        throw new Error(errorData.error || 'Failed to load users')
      }

      const [statsData, buyerData, contactsData, usersData] = await Promise.all([
        statsRes.json(),
        buyerRes.json(),
        contactsRes.json(),
        usersRes.json()
      ])

      // Check if any response contains an error
      if (statsData?.error) throw new Error(statsData.error)
      if (buyerData?.error) throw new Error(buyerData.error)
      if (contactsData?.error) throw new Error(contactsData.error)
      if (usersData?.error) throw new Error(usersData.error)

      // Ensure arrays are set (even if empty) and handle null/undefined
      setStats(statsData || null)
      setBuyerRequests(Array.isArray(buyerData) ? buyerData : [])
      setContacts(Array.isArray(contactsData) ? contactsData : [])
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (error: any) {
      console.error('Error loading admin data:', error)
      toast.showToast(error.message || 'Failed to load admin data', 'error')
      if (error.message?.includes('Unauthorized')) {
        router.push('/dashboard')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBuyerRequest = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Buyer Request',
      message: 'Are you sure you want to delete this buyer request? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/buyer-requests?id=${id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error('Failed to delete')
          await loadData()
          toast.showToast('Buyer request deleted', 'success')
        } catch (error: any) {
          toast.showToast(error.message || 'Failed to delete', 'error')
        } finally {
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
      }
    })
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/buyer-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to update')
      }
      await loadData()
      toast.showToast('Status updated', 'success')
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update', 'error')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-1 container-custom py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 rounded w-1/4"></div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-600">Manage all listings, messages, and users</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-600">Total Users</p>
                  <Users className="w-5 h-5 text-nest-mint" />
                </div>
                <p className="text-2xl font-bold text-dark">{stats.users.total}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-600">Buyer Requests</p>
                  <FileText className="w-5 h-5 text-nest-mint" />
                </div>
                <p className="text-2xl font-bold text-dark">{stats.buyerRequests.total}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.buyerRequests.active} active</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-600">Messages</p>
                  <Mail className="w-5 h-5 text-nest-mint" />
                </div>
                <p className="text-2xl font-bold text-dark">{stats.contacts.total}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.contacts.unread} unread</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
            <div className="flex flex-wrap border-b border-slate-200">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'buyer-requests', label: 'Buyer Requests', icon: FileText },
                { id: 'messages', label: 'Messages', icon: Mail },
                { id: 'users', label: 'Users', icon: Users }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-nest-mint text-nest-mint'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="p-4 sm:p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-sm text-slate-600 mb-1">Active Buyer Requests</p>
                        <p className="text-2xl font-bold text-dark">
                          {stats?.buyerRequests.active || 0}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-sm text-slate-600 mb-1">Total Messages</p>
                        <p className="text-2xl font-bold text-dark">{stats?.contacts.total || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Buyer Requests Tab */}
              {activeTab === 'buyer-requests' && (
                <div className="space-y-4">
                  {selectedUserId && (
                    <div className="bg-nest-mint/10 border border-nest-mint/20 rounded-lg p-3 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-nest-mint" />
                        <span className="text-sm font-medium text-dark">
                          Showing requests for: {users.find(u => u.id === selectedUserId)?.email || 'User'}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedUserId(null)}
                        className="text-xs text-nest-mint hover:text-nest-mintHover font-medium flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Clear filter
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
                    <div className="flex-1 flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search buyer requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <select
                      value={buyerStatusFilter}
                      onChange={(e) => setBuyerStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  {!buyerRequests || buyerRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No buyer requests found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
                      {buyerRequests
                        .filter(br => {
                          if (!br) return false
                          // Filter by selected user if set
                          if (selectedUserId && br.user_id !== selectedUserId) return false
                          const matchesSearch = !searchQuery || 
                            (br.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (br.profiles?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (Array.isArray(br.postcode_districts) && br.postcode_districts.some(pc => pc.toLowerCase().includes(searchQuery.toLowerCase()))) ||
                            (br.description || '').toLowerCase().includes(searchQuery.toLowerCase())
                          const matchesStatus = buyerStatusFilter === 'all' || br.status === buyerStatusFilter
                          return matchesSearch && matchesStatus
                        })
                        .map(request => {
                          if (!request) return null
                          return (
                            <div key={request.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                {/* Main Content */}
                                <div className="flex-1 space-y-3">
                                  {/* Header Row */}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-nest-mint flex-shrink-0" />
                                        <span className="text-lg font-bold text-dark">
                                          {formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                          request.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' :
                                          request.status === 'paused' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                          request.status === 'fulfilled' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                          'bg-slate-100 text-slate-700 border border-slate-200'
                                        }`}>
                                          {request.status}
                                        </span>
                                      </div>
                                      
                                      {/* Property Details */}
                                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                        <div className="flex items-center gap-1.5">
                                          <Home className="w-4 h-4 text-slate-400" />
                                          <span>{request.beds_min} {request.beds_min === 1 ? 'bed' : 'beds'}</span>
                                          <span className="text-slate-300">•</span>
                                          <span className="capitalize">{request.property_type}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <MapPin className="w-4 h-4 text-slate-400" />
                                          <span className="max-w-[200px] truncate">
                                            {Array.isArray(request.postcode_districts) ? request.postcode_districts.join(', ') : ''}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex gap-2 flex-shrink-0">
                                      <select
                                        value={request.status}
                                        onChange={(e) => handleUpdateStatus(request.id, e.target.value)}
                                        className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white hover:bg-slate-50 transition-colors font-medium"
                                      >
                                        <option value="active">Active</option>
                                        <option value="paused">Paused</option>
                                        <option value="fulfilled">Fulfilled</option>
                                        <option value="expired">Expired</option>
                                      </select>
                                      <button
                                        onClick={() => handleDeleteBuyerRequest(request.id)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  {request.description && (
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                      <p className="text-sm text-slate-700 leading-relaxed">{request.description}</p>
                                    </div>
                                  )}

                                  {/* Footer Info */}
                                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                      <Mail className="w-3.5 h-3.5" />
                                      <span className="truncate max-w-[200px]">{request.profiles?.email || request.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                      <Calendar className="w-3.5 h-3.5" />
                                      <span>Posted {formatDate(request.created_at)}</span>
                                    </div>
                                    {request.profiles?.full_name && (
                                      <div className="text-xs text-slate-500">
                                        <span className="font-medium">User:</span> {request.profiles.full_name}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                        .filter(Boolean)}
                    </div>
                  )}
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
                    <div className="flex-1 flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search messages by sender, recipient, or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="sent">Sent</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>
                  {!contacts || contacts.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No messages found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Messages List */}
                      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {contacts
                          .filter(contact => {
                            if (!contact) return false
                            const matchesSearch = !searchQuery || 
                              (contact.seller_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (contact.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (contact.buyer_requests?.profiles?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
                            const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
                            return matchesSearch && matchesStatus
                          })
                          .map(contact => {
                            if (!contact || !contact.buyer_requests) return null
                            const isUnread = contact.status === 'pending' || contact.status === 'sent'
                            return (
                            <div 
                              key={contact.id} 
                              onClick={() => setSelectedContact(contact)}
                              className={`bg-white rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                                selectedContact?.id === contact.id 
                                  ? 'border-nest-mint bg-nest-mint/5 shadow-lg ring-2 ring-nest-mint/20' 
                                  : isUnread
                                  ? 'border-slate-200 hover:border-nest-mint/50'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="p-4">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Mail className={`w-4 h-4 flex-shrink-0 ${isUnread ? 'text-nest-mint' : 'text-slate-400'}`} />
                                      <p className="font-bold text-dark truncate">
                                        {contact.seller_email}
                                      </p>
                                      {isUnread && (
                                        <span className="w-2 h-2 bg-nest-mint rounded-full flex-shrink-0"></span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                                      <span>To:</span>
                                      <span className="truncate">{contact.buyer_requests.profiles?.email || 'Unknown'}</span>
                                    </div>
                                  </div>
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${
                                    contact.status === 'read' ? 'bg-green-100 text-green-700 border border-green-200' :
                                    contact.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                    contact.status === 'replied' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                    'bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}>
                                    {contact.status}
                                  </span>
                                </div>

                                {/* Message Preview */}
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-3">
                                  <p className="text-sm text-slate-700 line-clamp-3 leading-relaxed">
                                    {contact.message}
                                  </p>
                                </div>

                                {/* Buyer Request Info */}
                                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="truncate">
                                    {formatCurrency(contact.buyer_requests.budget_min)} - {formatCurrency(contact.buyer_requests.budget_max)}
                                  </span>
                                  <span className="text-slate-300">•</span>
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="truncate max-w-[150px]">
                                    {contact.buyer_requests.postcode_districts.join(', ')}
                                  </span>
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{formatDate(contact.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            )
                          })
                          .filter(Boolean)}
                      </div>

                      {/* Message Detail Panel */}
                      {selectedContact && (
                        <div className="lg:sticky lg:top-4 lg:h-[600px] lg:overflow-y-auto">
                          <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <h3 className="text-xl font-bold text-dark mb-1">Message Details</h3>
                                <p className="text-xs text-slate-500">Full message information</p>
                              </div>
                              <button
                                onClick={() => setSelectedContact(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            <div className="space-y-5">
                              {/* From */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Mail className="w-4 h-4 text-nest-mint" />
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">From</p>
                                </div>
                                <p className="text-sm font-medium text-dark bg-slate-50 rounded-lg p-3 border border-slate-100">
                                  {selectedContact.seller_email}
                                </p>
                              </div>

                              {/* To */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Users className="w-4 h-4 text-nest-mint" />
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">To</p>
                                </div>
                                <p className="text-sm font-medium text-dark bg-slate-50 rounded-lg p-3 border border-slate-100">
                                  {selectedContact.buyer_requests.profiles?.email || 'Unknown'}
                                  {selectedContact.buyer_requests.profiles?.full_name && (
                                    <span className="text-slate-500 ml-2">({selectedContact.buyer_requests.profiles.full_name})</span>
                                  )}
                                </p>
                              </div>

                              {/* Status */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <TrendingUp className="w-4 h-4 text-nest-mint" />
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                                </div>
                                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                  selectedContact.status === 'read' ? 'bg-green-100 text-green-700 border border-green-200' :
                                  selectedContact.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                  selectedContact.status === 'replied' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                  'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                  {selectedContact.status}
                                </span>
                              </div>

                              {/* Date */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="w-4 h-4 text-nest-mint" />
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</p>
                                </div>
                                <p className="text-sm text-dark bg-slate-50 rounded-lg p-3 border border-slate-100">
                                  {formatDate(selectedContact.created_at)}
                                </p>
                              </div>

                              {/* Message Content */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="w-4 h-4 text-nest-mint" />
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Message</p>
                                </div>
                                <div className="bg-nest-sageBg rounded-lg p-4 border border-nest-line">
                                  <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                    {selectedContact.message}
                                  </p>
                                </div>
                              </div>

                              {/* Buyer Request Details */}
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Home className="w-4 h-4 text-nest-mint" />
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Buyer Request</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                    <div>
                                      <p className="text-xs text-slate-500">Budget</p>
                                      <p className="text-sm font-semibold text-dark">
                                        {formatCurrency(selectedContact.buyer_requests.budget_min)} - {formatCurrency(selectedContact.buyer_requests.budget_max)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <div>
                                      <p className="text-xs text-slate-500">Areas</p>
                                      <p className="text-sm font-semibold text-dark">
                                        {selectedContact.buyer_requests.postcode_districts.join(', ')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users by email or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                    {selectedUserId && (
                      <button
                        onClick={() => {
                          setSelectedUserId(null)
                          setActiveTab('buyer-requests')
                        }}
                        className="px-3 py-2 text-sm bg-nest-mint text-white rounded-lg hover:bg-nest-mintHover transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Requests
                      </button>
                    )}
                  </div>
                  {users.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No users found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                      {users
                        .filter(user => 
                          !searchQuery || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(user => (
                        <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-dark truncate">{user.email}</p>
                                {user.role === 'admin' && (
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex-shrink-0">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{user.full_name || 'No name provided'}</p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Joined {formatDate(user.created_at)}</span>
                                <span className="text-slate-300">•</span>
                                <span className="capitalize">{user.role || 'both'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <FileText className="w-4 h-4 text-nest-mint" />
                                <span className="text-lg font-bold text-dark">{user.buyerRequestCount || 0}</span>
                              </div>
                              <p className="text-xs text-slate-500">Total Requests</p>
                              {user.activeBuyerRequestCount > 0 && (
                                <p className="text-xs text-green-600 font-medium mt-0.5">
                                  {user.activeBuyerRequestCount} active
                                </p>
                              )}
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Mail className="w-4 h-4 text-nest-mint" />
                                <span className="text-lg font-bold text-dark">{user.messageCount || 0}</span>
                              </div>
                              <p className="text-xs text-slate-500">Messages Sent</p>
                            </div>
                            <div className="text-center">
                              <button
                                onClick={() => {
                                  setSelectedUserId(user.id)
                                  setActiveTab('buyer-requests')
                                }}
                                className="w-full px-3 py-2 text-xs bg-nest-mint/10 text-nest-mint rounded-lg hover:bg-nest-mint/20 transition-colors font-medium flex items-center justify-center gap-1.5"
                                disabled={!user.buyerRequestCount || user.buyerRequestCount === 0}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Requests
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}



