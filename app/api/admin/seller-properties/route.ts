import { NextRequest, NextResponse } from 'next/server'
import { adminGetAllSellerProperties, adminUpdateSellerProperty, adminDeleteSellerProperty } from '@/lib/supabase/admin-queries'

export async function GET() {
  try {
    const properties = await adminGetAllSellerProperties()
    return NextResponse.json(properties)
  } catch (error: any) {
    console.error('Error fetching seller properties:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch seller properties' },
      { status: 401 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const updated = await adminUpdateSellerProperty(id, updates)
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating seller property:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update seller property' },
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

    await adminDeleteSellerProperty(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting seller property:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete seller property' },
      { status: 401 }
    )
  }
}



