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
  X
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
      
      // Check admin access by trying to fetch stats
      const statsRes = await fetch('/api/admin/stats')
      if (!statsRes.ok) {
        if (statsRes.status === 401) {
          toast.showToast('Unauthorized: Admin access required', 'error')
          router.push('/dashboard')
          return
        }
        throw new Error('Failed to load admin data')
      }

      const [statsData, buyerData, contactsData, usersData] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/admin/buyer-requests').then(r => r.json()),
        fetch('/api/admin/contacts').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json())
      ])

      setStats(statsData)
      setBuyerRequests(buyerData)
      setContacts(contactsData)
      setUsers(usersData)
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
                  {buyerRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No buyer requests found</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {buyerRequests
                        .filter(br => {
                          const matchesSearch = !searchQuery || 
                            br.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (br.profiles?.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            br.postcode_districts.some(pc => pc.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            br.description.toLowerCase().includes(searchQuery.toLowerCase())
                          const matchesStatus = buyerStatusFilter === 'all' || br.status === buyerStatusFilter
                          return matchesSearch && matchesStatus
                        })
                        .map(request => (
                        <div key={request.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-dark">
                                  {formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  request.status === 'active' ? 'bg-green-100 text-green-700' :
                                  request.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {request.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-1">
                                {request.beds_min} beds • {request.property_type} • {request.postcode_districts.join(', ')}
                              </p>
                              <p className="text-xs text-slate-500">
                                {request.profiles?.email || request.email} • {formatDate(request.created_at)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <select
                                value={request.status}
                                onChange={(e) => handleUpdateStatus(request.id, e.target.value)}
                                className="text-xs border border-slate-200 rounded px-2 py-1"
                              >
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="fulfilled">Fulfilled</option>
                                <option value="expired">Expired</option>
                              </select>
                              <button
                                onClick={() => handleDeleteBuyerRequest(request.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {request.description && (
                              <div className="mt-2 pt-2 border-t border-slate-200">
                                <p className="text-xs text-slate-600 line-clamp-2">{request.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
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
                        placeholder="Search messages..."
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
                  {contacts.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No messages found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {contacts
                          .filter(contact => {
                            const matchesSearch = !searchQuery || 
                              contact.seller_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              contact.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (contact.buyer_requests.profiles?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
                            const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
                            return matchesSearch && matchesStatus
                          })
                          .map(contact => (
                            <div 
                              key={contact.id} 
                              onClick={() => setSelectedContact(contact)}
                              className={`bg-slate-50 rounded-lg p-4 border cursor-pointer transition-all ${
                                selectedContact?.id === contact.id 
                                  ? 'border-nest-mint bg-nest-mint/5 shadow-md' 
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-dark mb-1 truncate">
                                    From: {contact.seller_email}
                                  </p>
                                  <p className="text-sm text-slate-600 mb-1 line-clamp-2">
                                    {contact.message}
                                  </p>
                                  <p className="text-xs text-slate-500 truncate">
                                    To: {contact.buyer_requests.profiles?.email || 'Unknown'} • {formatDate(contact.created_at)}
                                  </p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ml-2 ${
                                  contact.status === 'read' ? 'bg-green-100 text-green-700' :
                                  contact.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  contact.status === 'replied' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {contact.status}
                                </span>
                              </div>
                              <div className="mt-2 pt-2 border-t border-slate-200">
                                <p className="text-xs text-slate-500 truncate">
                                  {formatCurrency(contact.buyer_requests.budget_min)} - {formatCurrency(contact.buyer_requests.budget_max)} • {contact.buyer_requests.postcode_districts.join(', ')}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                      {selectedContact && (
                        <div className="lg:sticky lg:top-4 lg:h-[600px] lg:overflow-y-auto">
                          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-bold text-dark">Message Details</h3>
                              <button
                                onClick={() => setSelectedContact(null)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">From</p>
                                <p className="text-sm text-dark">{selectedContact.seller_email}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">To</p>
                                <p className="text-sm text-dark">{selectedContact.buyer_requests.profiles?.email || 'Unknown'}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Status</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                  selectedContact.status === 'read' ? 'bg-green-100 text-green-700' :
                                  selectedContact.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  selectedContact.status === 'replied' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {selectedContact.status}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Date</p>
                                <p className="text-sm text-dark">{formatDate(selectedContact.created_at)}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Message</p>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                  <p className="text-sm text-slate-800 whitespace-pre-wrap">{selectedContact.message}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Buyer Request</p>
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                  <p className="text-sm text-slate-800">
                                    <span className="font-medium">Budget:</span> {formatCurrency(selectedContact.buyer_requests.budget_min)} - {formatCurrency(selectedContact.buyer_requests.budget_max)}
                                  </p>
                                  <p className="text-sm text-slate-800 mt-1">
                                    <span className="font-medium">Areas:</span> {selectedContact.buyer_requests.postcode_districts.join(', ')}
                                  </p>
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
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  {users.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">No users found</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {users
                        .filter(user => 
                          !searchQuery || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (user.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(user => (
                        <div key={user.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-dark">{user.email}</p>
                              <p className="text-sm text-slate-600">{user.full_name || 'No name'}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                Role: {user.role || 'both'} • Joined: {formatDate(user.created_at)}
                              </p>
                            </div>
                            {user.role === 'admin' && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                Admin
                              </span>
                            )}
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



