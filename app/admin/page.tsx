'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  FileText, 
  Home, 
  Mail, 
  TrendingUp, 
  AlertCircle,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  X,
  Eye,
  EyeOff
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useToast } from '@/lib/toast'
import ConfirmDialog from '@/components/ConfirmDialog'

interface Stats {
  users: { total: number }
  buyerRequests: { total: number; active: number }
  sellerProperties: { total: number; active: number }
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

interface SellerProperty {
  id: string
  postcode_district: string
  property_type: string
  expected_price_min: number | null
  expected_price_max: number | null
  bedrooms: number | null
  timeframe: string | null
  features: string[] | null
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

type TabType = 'overview' | 'buyer-requests' | 'seller-properties' | 'messages' | 'users'

export default function AdminDashboard() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [stats, setStats] = useState<Stats | null>(null)
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>([])
  const [sellerProperties, setSellerProperties] = useState<SellerProperty[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
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

      const [statsData, buyerData, sellerData, contactsData, usersData] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/admin/buyer-requests').then(r => r.json()),
        fetch('/api/admin/seller-properties').then(r => r.json()),
        fetch('/api/admin/contacts').then(r => r.json()),
        fetch('/api/admin/users').then(r => r.json())
      ])

      setStats(statsData)
      setBuyerRequests(buyerData)
      setSellerProperties(sellerData)
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

  const handleDeleteSellerProperty = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Seller Property',
      message: 'Are you sure you want to delete this seller property? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/seller-properties?id=${id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error('Failed to delete')
          await loadData()
          toast.showToast('Seller property deleted', 'success')
        } catch (error: any) {
          toast.showToast(error.message || 'Failed to delete', 'error')
        } finally {
          setConfirmDialog({ ...confirmDialog, isOpen: false })
        }
      }
    })
  }

  const handleUpdateStatus = async (type: 'buyer' | 'seller', id: string, newStatus: string) => {
    try {
      const endpoint = type === 'buyer' ? '/api/admin/buyer-requests' : '/api/admin/seller-properties'
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (!res.ok) throw new Error('Failed to update')
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
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
                  <p className="text-xs text-slate-600">Seller Properties</p>
                  <Home className="w-5 h-5 text-nest-mint" />
                </div>
                <p className="text-2xl font-bold text-dark">{stats.sellerProperties.total}</p>
                <p className="text-xs text-slate-500 mt-1">{stats.sellerProperties.active} active</p>
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
                { id: 'seller-properties', label: 'Seller Properties', icon: Home },
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
                        <p className="text-sm text-slate-600 mb-1">Active Listings</p>
                        <p className="text-2xl font-bold text-dark">
                          {(stats?.buyerRequests.active || 0) + (stats?.sellerProperties.active || 0)}
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
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search buyer requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {buyerRequests
                      .filter(br => 
                        !searchQuery || 
                        br.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        br.postcode_districts.some(pc => pc.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
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
                                onChange={(e) => handleUpdateStatus('buyer', request.id, e.target.value)}
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
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Seller Properties Tab */}
              {activeTab === 'seller-properties' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search seller properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {sellerProperties
                      .filter(sp => 
                        !searchQuery || 
                        sp.postcode_district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (sp.profiles?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(property => (
                        <div key={property.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-dark">
                                  {property.postcode_district} • {property.property_type}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  property.status === 'active' ? 'bg-green-100 text-green-700' :
                                  property.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {property.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-1">
                                {property.bedrooms ? `${property.bedrooms} beds` : ''} • {property.timeframe || 'No timeframe'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {property.profiles?.email} • {formatDate(property.created_at)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <select
                                value={property.status}
                                onChange={(e) => handleUpdateStatus('seller', property.id, e.target.value)}
                                className="text-xs border border-slate-200 rounded px-2 py-1"
                              >
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="sold">Sold</option>
                                <option value="withdrawn">Withdrawn</option>
                              </select>
                              <button
                                onClick={() => handleDeleteSellerProperty(property.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {contacts
                      .filter(contact => 
                        !searchQuery || 
                        contact.seller_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        contact.message.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(contact => (
                        <div key={contact.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-dark mb-1">
                                From: {contact.seller_email}
                              </p>
                              <p className="text-sm text-slate-600 mb-1 line-clamp-2">
                                {contact.message}
                              </p>
                              <p className="text-xs text-slate-500">
                                To: {contact.buyer_requests.profiles?.email || 'Unknown'} • {formatDate(contact.created_at)}
                              </p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              contact.status === 'read' ? 'bg-green-100 text-green-700' :
                              contact.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {contact.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
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



