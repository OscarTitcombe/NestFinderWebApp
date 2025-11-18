'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getUserBuyerRequests, 
  updateBuyerRequest,
  deleteBuyerRequest
} from '@/lib/supabase/queries'
import { getCurrentUser } from '@/lib/supabase/auth'
import { Home, FileText, Edit, Trash2, Pause, Play, Plus, Save, X, MapPin, Calendar, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToast } from '@/lib/toast'
import { DashboardListSkeleton, PageHeaderSkeleton } from '@/components/Skeletons'
import { analytics } from '@/lib/analytics'

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
  const [isLoading, setIsLoading] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger'
  })
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [editingBuyerRequest, setEditingBuyerRequest] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<any>(null)

  const loadData = async () => {
    try {
      const buyerData = await getUserBuyerRequests()
      setBuyerRequests(buyerData)
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
      
      // Track action
      if (newStatus === 'active') {
        analytics.buyerRequestActivated(id)
      } else {
        analytics.buyerRequestPaused(id)
      }
      
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
          
          // Track deletion
          analytics.buyerRequestDeleted(id)
          
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
      
      // Track edit
      analytics.buyerRequestEdited(id)
      
      setEditingBuyerRequest(null)
      setEditFormData(null)
      toast.showToast('Buyer request updated successfully', 'success')
    } catch (error: any) {
      toast.showToast(error.message || 'Failed to update request', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  // Calculate stats
  const stats = {
    total: buyerRequests.length,
    active: buyerRequests.filter(r => r.status === 'active').length,
    paused: buyerRequests.filter(r => r.status === 'paused').length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light flex flex-col">
        <Navbar />
        <main className="flex-1 container-custom py-4 sm:py-6 lg:py-8">
          <div className="max-w-6xl mx-auto">
            <PageHeaderSkeleton />
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
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-1.5 sm:mb-2">Dashboard</h1>
                <p className="text-sm sm:text-base text-slate-600">Manage your buyer requests</p>
              </div>
              <Link
                href="/buy"
                className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Request</span>
              </Link>
            </div>

            {/* Stats Cards */}
            {buyerRequests.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600 mb-1">Total Requests</p>
                      <p className="text-2xl sm:text-3xl font-bold text-dark">{stats.total}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-nest-sageBg rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-nest-mint" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600 mb-1">Active</p>
                      <p className="text-2xl sm:text-3xl font-bold text-nest-mint">{stats.active}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-nest-mint/10 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 text-nest-mint" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600 mb-1">Paused</p>
                      <p className="text-2xl sm:text-3xl font-bold text-slate-600">{stats.paused}</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buyer Requests Section */}
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-dark">Your Buyer Requests</h2>
              {buyerRequests.length > 0 && (
                <Link
                  href="/inbox"
                  className="hidden sm:inline-flex items-center gap-2 text-sm text-slate-600 hover:text-nest-mint transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>View Messages</span>
                </Link>
              )}
            </div>

            {buyerRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-12 lg:p-16 text-center shadow-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-nest-sageBg rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-nest-mint" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-dark mb-2 sm:mb-3">No buyer requests yet</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-md mx-auto">
                  Post your first property brief to start matching with sellers
                </p>
                <Link href="/buy" className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base">
                  <Plus className="w-4 h-4" />
                  <span>Post Your First Request</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {buyerRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className="bg-white rounded-xl border border-slate-200 p-3 sm:p-6 transition-all duration-200 hover:shadow-lg hover:border-nest-mint/30"
                  >
                    {editingBuyerRequest === request.id ? (
                      // Edit Mode
                      <div className="space-y-4 sm:space-y-6 animate-fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                          <h3 className="text-base sm:text-lg font-bold text-dark">Editing Buyer Request</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveBuyerRequest(request.id)}
                              disabled={actionLoading === request.id}
                              className="px-4 py-2 text-sm bg-nest-mint text-white rounded-lg hover:bg-nest-mintHover transition-colors disabled:opacity-50 font-medium min-h-[44px] flex-1 sm:flex-initial"
                            >
                              <span className="sm:hidden">Save</span>
                              <Save className="w-4 h-4 sm:hidden" />
                              <span className="hidden sm:inline">Save Changes</span>
                            </button>
                            <button
                              onClick={handleCancelEditBuyerRequest}
                              disabled={actionLoading === request.id}
                              className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 font-medium min-h-[44px] flex-1 sm:flex-initial"
                            >
                              <span className="sm:hidden">Cancel</span>
                              <X className="w-4 h-4 sm:hidden" />
                              <span className="hidden sm:inline">Cancel</span>
                            </button>
                          </div>
                        </div>
                          
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Min Budget</label>
                            <input
                              type="number"
                              value={editFormData.budget_min}
                              onChange={(e) => setEditFormData({ ...editFormData, budget_min: parseInt(e.target.value) || 0 })}
                              className="input-primary w-full text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Max Budget</label>
                            <input
                              type="number"
                              value={editFormData.budget_max}
                              onChange={(e) => setEditFormData({ ...editFormData, budget_max: parseInt(e.target.value) || 0 })}
                              className="input-primary w-full text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Min Beds</label>
                            <input
                              type="number"
                              value={editFormData.beds_min}
                              onChange={(e) => setEditFormData({ ...editFormData, beds_min: parseInt(e.target.value) || 1 })}
                              className="input-primary w-full text-sm"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Max Beds</label>
                            <input
                              type="number"
                              value={editFormData.beds_max}
                              onChange={(e) => setEditFormData({ ...editFormData, beds_max: parseInt(e.target.value) || 1 })}
                              className="input-primary w-full text-sm"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Property Type</label>
                            <select
                              value={editFormData.property_type}
                              onChange={(e) => setEditFormData({ ...editFormData, property_type: e.target.value })}
                              className="input-primary w-full text-sm"
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
                            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Postcode Districts</label>
                            <input
                              type="text"
                              value={editFormData.postcode_districts}
                              onChange={(e) => setEditFormData({ ...editFormData, postcode_districts: e.target.value })}
                              className="input-primary w-full text-sm"
                              placeholder="SW1, SW3, E1"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Description</label>
                            <textarea
                              value={editFormData.description}
                              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                              className="input-primary w-full text-sm"
                              rows={3}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                              type="email"
                              value={editFormData.email}
                              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                              className="input-primary w-full text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-3 sm:mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="text-base sm:text-lg font-bold text-dark">
                                {formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}
                              </h3>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                request.status === 'active' 
                                  ? 'bg-nest-mint/10 text-nest-mint border border-nest-mint/20' :
                                request.status === 'paused' 
                                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                  'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {request.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Home className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{request.beds_min} {request.beds_min === 1 ? 'bed' : 'beds'} • {request.property_type}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{request.postcode_districts.join(', ')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Posted {formatDate(request.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 sm:gap-1">
                            <button 
                              onClick={() => handleEditBuyerRequest(request.id)}
                              disabled={actionLoading === request.id || editingBuyerRequest !== null}
                              className="p-2 sm:p-2.5 text-slate-600 hover:text-nest-mint hover:bg-nest-mint/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center" 
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button 
                              onClick={() => handlePauseBuyerRequest(request.id, request.status)}
                              disabled={actionLoading === request.id || editingBuyerRequest !== null}
                              className="p-2 sm:p-2.5 text-slate-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center" 
                              title={request.status === 'active' ? 'Pause' : 'Activate'}
                            >
                              {request.status === 'active' ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </button>
                            <button 
                              onClick={() => handleDeleteBuyerRequest(request.id)}
                              disabled={actionLoading === request.id || editingBuyerRequest !== null}
                              className="p-2 sm:p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center" 
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                        {request.description && (
                          <div className="bg-slate-50 rounded-lg p-2.5 sm:p-4 border border-slate-200">
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{request.description}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

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

