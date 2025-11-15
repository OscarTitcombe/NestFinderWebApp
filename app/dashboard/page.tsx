'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getUserBuyerRequests, 
  getUserSellerProperties,
  updateBuyerRequest,
  deleteBuyerRequest,
  updateSellerProperty,
  deleteSellerProperty
} from '@/lib/supabase/queries'
import { getCurrentUser } from '@/lib/supabase/auth'
import { Home, FileText, Edit, Trash2, Pause, Play, Plus, Save, X } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToast } from '@/lib/toast'
import { DashboardListSkeleton, PageHeaderSkeleton } from '@/components/Skeletons'

interface ConfirmDialogState {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  variant?: 'danger' | 'warning' | 'info'
}

export default function DashboardPage() {
  const router = useRouter()
  const toast = useToast()
  const [user, setUser] = useState<any>(null)
  const [buyerRequests, setBuyerRequests] = useState<any[]>([])
  const [sellerProperties, setSellerProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer')
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger'
  })
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [editingBuyerRequest, setEditingBuyerRequest] = useState<string | null>(null)
  const [editingSellerProperty, setEditingSellerProperty] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<any>(null)

  const loadData = async () => {
    try {
      const [buyerData, sellerData] = await Promise.all([
        getUserBuyerRequests(),
        getUserSellerProperties()
      ])
      setBuyerRequests(buyerData)
      setSellerProperties(sellerData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.showToast('Failed to load dashboard data', 'error')
    }
  }

  useEffect(() => {
    const initialize = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/signin')
        return
      }

      setUser(currentUser)
      await loadData()
      setIsLoading(false)
    }

    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

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
      year: 'numeric'
    })
  }

  // Buyer Request Actions
  const handlePauseBuyerRequest = async (id: string, currentStatus: string) => {
    setActionLoading(id)
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      await updateBuyerRequest(id, { status: newStatus as any })
      await loadData()
      toast.showToast(
        newStatus === 'active' ? 'Buyer request activated' : 'Buyer request paused',
        'success'
      )
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update request', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteBuyerRequest = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Buyer Request',
      message: 'Are you sure you want to delete this buyer request? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        setActionLoading(id)
        try {
          await deleteBuyerRequest(id)
          await loadData()
          toast.showToast('Buyer request deleted', 'success')
        } catch (error: any) {
          toast.showToast(error.message || 'Failed to delete request', 'error')
        } finally {
          setActionLoading(null)
        }
      }
    })
  }

  // Seller Property Actions
  const handlePauseSellerProperty = async (id: string, currentStatus: string) => {
    setActionLoading(id)
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      await updateSellerProperty(id, { status: newStatus as any })
      await loadData()
      toast.showToast(
        newStatus === 'active' ? 'Property activated' : 'Property paused',
        'success'
      )
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update property', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteSellerProperty = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Property',
      message: 'Are you sure you want to delete this property listing? This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        setActionLoading(id)
        try {
          await deleteSellerProperty(id)
          await loadData()
          toast.showToast('Property deleted', 'success')
        } catch (error: any) {
          toast.showToast(error.message || 'Failed to delete property', 'error')
        } finally {
          setActionLoading(null)
        }
      }
    })
  }

  const handleEditBuyerRequest = (id: string) => {
    const request = buyerRequests.find(r => r.id === id)
    if (!request) return
    
    setEditingBuyerRequest(id)
    setEditFormData({
      budget_min: request.budget_min,
      budget_max: request.budget_max,
      beds_min: request.beds_min,
      beds_max: request.beds_max || request.beds_min,
      property_type: request.property_type,
      postcode_districts: request.postcode_districts.join(', '),
      description: request.description,
      email: request.email
    })
  }

  const handleCancelEditBuyerRequest = () => {
    setEditingBuyerRequest(null)
    setEditFormData(null)
  }

  const handleSaveBuyerRequest = async (id: string) => {
    setActionLoading(id)
    try {
      // Parse postcode districts
      const districts = editFormData.postcode_districts
        .split(',')
        .map((area: string) => area.trim().toUpperCase())
        .filter((area: string) => area.length > 0)

      if (districts.length === 0) {
        toast.showToast('Please enter at least one postcode district', 'error')
        setActionLoading(null)
        return
      }

      // Validate budget
      if (editFormData.budget_min >= editFormData.budget_max) {
        toast.showToast('Maximum budget must be greater than minimum budget', 'error')
        setActionLoading(null)
        return
      }

      // Validate beds
      if (editFormData.beds_min > editFormData.beds_max) {
        toast.showToast('Maximum beds must be greater than or equal to minimum beds', 'error')
        setActionLoading(null)
        return
      }

      await updateBuyerRequest(id, {
        budget_min: editFormData.budget_min,
        budget_max: editFormData.budget_max,
        beds_min: editFormData.beds_min,
        beds_max: editFormData.beds_max,
        property_type: editFormData.property_type,
        postcode_districts: districts,
        description: editFormData.description,
        email: editFormData.email
      })
      
      await loadData()
      setEditingBuyerRequest(null)
      setEditFormData(null)
      toast.showToast('Buyer request updated successfully', 'success')
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update request', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditSellerProperty = (id: string) => {
    const property = sellerProperties.find(p => p.id === id)
    if (!property) return
    
    setEditingSellerProperty(id)
    setEditFormData({
      postcode_district: property.postcode_district,
      property_type: property.property_type,
      expected_price_min: property.expected_price_min || 0,
      expected_price_max: property.expected_price_max || 0,
      bedrooms: property.bedrooms || '',
      timeframe: property.timeframe || '',
      features: property.features ? property.features.join(', ') : ''
    })
  }

  const handleCancelEditSellerProperty = () => {
    setEditingSellerProperty(null)
    setEditFormData(null)
  }

  const handleSaveSellerProperty = async (id: string) => {
    setActionLoading(id)
    try {
      // Validate price range
      if (editFormData.expected_price_min > 0 && editFormData.expected_price_max > 0) {
        if (editFormData.expected_price_min >= editFormData.expected_price_max) {
          toast.showToast('Maximum price must be greater than minimum price', 'error')
          setActionLoading(null)
          return
        }
      }

      // Parse features
      const features = editFormData.features
        ? editFormData.features.split(',').map((f: string) => f.trim()).filter((f: string) => f.length > 0)
        : null

      await updateSellerProperty(id, {
        postcode_district: editFormData.postcode_district.toUpperCase(),
        property_type: editFormData.property_type,
        expected_price_min: editFormData.expected_price_min > 0 ? editFormData.expected_price_min : null,
        expected_price_max: editFormData.expected_price_max > 0 ? editFormData.expected_price_max : null,
        bedrooms: editFormData.bedrooms ? parseInt(editFormData.bedrooms) : null,
        timeframe: editFormData.timeframe || null,
        features: features && features.length > 0 ? features : null
      })
      
      await loadData()
      setEditingSellerProperty(null)
      setEditFormData(null)
      toast.showToast('Property updated successfully', 'success')
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update property', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-1 container-custom py-8">
          <div className="max-w-6xl mx-auto">
            <PageHeaderSkeleton />
            <div className="flex space-x-1 mb-6 border-b border-slate-200">
              <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
            </div>
            <DashboardListSkeleton count={3} />
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
            <h1 className="text-3xl font-bold text-dark mb-2">Dashboard</h1>
            <p className="text-slate-600">Manage your buyer requests and seller properties</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'buyer'
                  ? 'text-nest-mint border-b-2 border-nest-mint'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buyer Requests ({buyerRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'seller'
                  ? 'text-nest-mint border-b-2 border-nest-mint'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Seller Properties ({sellerProperties.length})
            </button>
          </div>

          {/* Buyer Requests Tab */}
          {activeTab === 'buyer' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-dark">Your Buyer Requests</h2>
                <Link
                  href="/buy"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post New Request</span>
                </Link>
              </div>

              {buyerRequests.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-dark mb-2">No buyer requests yet</h3>
                  <p className="text-slate-600 mb-6">Post your first property brief to start matching with sellers</p>
                  <Link href="/buy" className="btn-primary inline-flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Post Your First Request</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {buyerRequests.map((request) => (
                    <div 
                      key={request.id} 
                      className="bg-white rounded-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-md"
                    >
                      {editingBuyerRequest === request.id ? (
                        // Edit Mode
                        <div className="space-y-4 animate-fade-in">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-dark">Editing Buyer Request</h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveBuyerRequest(request.id)}
                                disabled={actionLoading === request.id}
                                className="p-2 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEditBuyerRequest}
                                disabled={actionLoading === request.id}
                                className="p-2 text-slate-600 hover:text-slate-700 transition-colors disabled:opacity-50"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Min Budget</label>
                              <input
                                type="number"
                                value={editFormData.budget_min}
                                onChange={(e) => setEditFormData({ ...editFormData, budget_min: parseInt(e.target.value) || 0 })}
                                className="input-primary w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Max Budget</label>
                              <input
                                type="number"
                                value={editFormData.budget_max}
                                onChange={(e) => setEditFormData({ ...editFormData, budget_max: parseInt(e.target.value) || 0 })}
                                className="input-primary w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Min Beds</label>
                              <input
                                type="number"
                                value={editFormData.beds_min}
                                onChange={(e) => setEditFormData({ ...editFormData, beds_min: parseInt(e.target.value) || 1 })}
                                className="input-primary w-full"
                                min="1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Max Beds</label>
                              <input
                                type="number"
                                value={editFormData.beds_max}
                                onChange={(e) => setEditFormData({ ...editFormData, beds_max: parseInt(e.target.value) || 1 })}
                                className="input-primary w-full"
                                min="1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                              <select
                                value={editFormData.property_type}
                                onChange={(e) => setEditFormData({ ...editFormData, property_type: e.target.value })}
                                className="input-primary w-full"
                              >
                                <option value="flat">Flat</option>
                                <option value="house">House</option>
                                <option value="maisonette">Maisonette</option>
                                <option value="bungalow">Bungalow</option>
                                <option value="other">Other</option>
                                <option value="any">Any</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Postcode Districts</label>
                              <input
                                type="text"
                                value={editFormData.postcode_districts}
                                onChange={(e) => setEditFormData({ ...editFormData, postcode_districts: e.target.value })}
                                className="input-primary w-full"
                                placeholder="SW1, SW3, E1"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                              <textarea
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                className="input-primary w-full"
                                rows={3}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                className="input-primary w-full"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-dark">
                                  {formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  request.status === 'active' ? 'bg-green-100 text-green-700' :
                                  request.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {request.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">
                                {request.beds_min} {request.beds_min === 1 ? 'bed' : 'beds'} • {request.property_type} • {request.postcode_districts.join(', ')}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">Posted {formatDate(request.created_at)}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditBuyerRequest(request.id)}
                                disabled={actionLoading === request.id || editingBuyerRequest !== null}
                                className="p-2 text-slate-600 hover:text-nest-mint transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handlePauseBuyerRequest(request.id, request.status)}
                                disabled={actionLoading === request.id || editingBuyerRequest !== null}
                                className="p-2 text-slate-600 hover:text-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                title={request.status === 'active' ? 'Pause' : 'Activate'}
                              >
                                {request.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => handleDeleteBuyerRequest(request.id)}
                                disabled={actionLoading === request.id || editingBuyerRequest !== null}
                                className="p-2 text-slate-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700">{request.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Seller Properties Tab */}
          {activeTab === 'seller' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-dark">Your Seller Properties</h2>
                <Link
                  href="/quiz"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Property</span>
                </Link>
              </div>

              {sellerProperties.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                  <Home className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-dark mb-2">No properties listed yet</h3>
                  <p className="text-slate-600 mb-6">Complete the property quiz to start matching with buyers</p>
                  <Link href="/quiz" className="btn-primary inline-flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Property</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sellerProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className="bg-white rounded-lg border border-slate-200 p-6 transition-all duration-200 hover:shadow-md"
                    >
                      {editingSellerProperty === property.id ? (
                        // Edit Mode
                        <div className="space-y-4 animate-fade-in">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-dark">Editing Property</h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleSaveSellerProperty(property.id)}
                                disabled={actionLoading === property.id}
                                className="p-2 text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEditSellerProperty}
                                disabled={actionLoading === property.id}
                                className="p-2 text-slate-600 hover:text-slate-700 transition-colors disabled:opacity-50"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Postcode District</label>
                              <input
                                type="text"
                                value={editFormData.postcode_district}
                                onChange={(e) => setEditFormData({ ...editFormData, postcode_district: e.target.value })}
                                className="input-primary w-full"
                                placeholder="SW1A"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                              <select
                                value={editFormData.property_type}
                                onChange={(e) => setEditFormData({ ...editFormData, property_type: e.target.value })}
                                className="input-primary w-full"
                              >
                                <option value="house">House</option>
                                <option value="flat">Flat</option>
                                <option value="bungalow">Bungalow</option>
                                <option value="any">Any</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Min Price</label>
                              <input
                                type="number"
                                value={editFormData.expected_price_min}
                                onChange={(e) => setEditFormData({ ...editFormData, expected_price_min: parseInt(e.target.value) || 0 })}
                                className="input-primary w-full"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Max Price</label>
                              <input
                                type="number"
                                value={editFormData.expected_price_max}
                                onChange={(e) => setEditFormData({ ...editFormData, expected_price_max: parseInt(e.target.value) || 0 })}
                                className="input-primary w-full"
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                              <input
                                type="number"
                                value={editFormData.bedrooms}
                                onChange={(e) => setEditFormData({ ...editFormData, bedrooms: e.target.value || '' })}
                                className="input-primary w-full"
                                placeholder="Any"
                                min="1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Timeframe</label>
                              <select
                                value={editFormData.timeframe}
                                onChange={(e) => setEditFormData({ ...editFormData, timeframe: e.target.value })}
                                className="input-primary w-full"
                              >
                                <option value="">Not specified</option>
                                <option value="immediately">Immediately</option>
                                <option value="1-3-months">1-3 months</option>
                                <option value="3-6-months">3-6 months</option>
                                <option value="6-12-months">6-12 months</option>
                                <option value="just-browsing">Just browsing</option>
                              </select>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-1">Features (comma-separated)</label>
                              <input
                                type="text"
                                value={editFormData.features}
                                onChange={(e) => setEditFormData({ ...editFormData, features: e.target.value })}
                                className="input-primary w-full"
                                placeholder="garden, parking, transport"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-dark">
                                  {property.postcode_district} • {property.property_type}
                                </h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  property.status === 'active' ? 'bg-green-100 text-green-700' :
                                  property.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-slate-100 text-slate-700'
                                }`}>
                                  {property.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">
                                {property.bedrooms ? `${property.bedrooms} ${property.bedrooms === 1 ? 'bed' : 'beds'}` : 'Any bedrooms'} • 
                                {property.expected_price_min && property.expected_price_max 
                                  ? ` ${formatCurrency(property.expected_price_min)} - ${formatCurrency(property.expected_price_max)}`
                                  : ' Price range not set'}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">Added {formatDate(property.created_at)}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditSellerProperty(property.id)}
                                disabled={actionLoading === property.id || editingSellerProperty !== null}
                                className="p-2 text-slate-600 hover:text-nest-mint transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handlePauseSellerProperty(property.id, property.status)}
                                disabled={actionLoading === property.id || editingSellerProperty !== null}
                                className="p-2 text-slate-600 hover:text-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                title={property.status === 'active' ? 'Pause' : 'Activate'}
                              >
                                {property.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => handleDeleteSellerProperty(property.id)}
                                disabled={actionLoading === property.id || editingSellerProperty !== null}
                                className="p-2 text-slate-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {property.features && property.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {property.features.map((feature: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Confirmation Dialog */}
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

