import { NextRequest, NextResponse } from 'next/server'
import { adminGetAllBuyerRequests, adminUpdateBuyerRequest, adminDeleteBuyerRequest } from '@/lib/supabase/admin-queries'

export async function GET() {
  try {
    const requests = await adminGetAllBuyerRequests()
    return NextResponse.json(requests)
  } catch (error: any) {
    console.error('Error fetching buyer requests:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch buyer requests' },
      { status: 401 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const updated = await adminUpdateBuyerRequest(id, updates)
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating buyer request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update buyer request' },
      { status: 401 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    await adminDeleteBuyerRequest(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting buyer request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete buyer request' },
      { status: 401 }
    )
  }
}



