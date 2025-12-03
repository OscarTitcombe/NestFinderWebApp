import { NextRequest, NextResponse } from 'next/server'
import { 
  adminGetAllContactSubmissions, 
  adminUpdateContactSubmission, 
  adminDeleteContactSubmission 
} from '@/lib/supabase/admin-queries'

export async function GET() {
  try {
    const submissions = await adminGetAllContactSubmissions()
    return NextResponse.json(submissions)
  } catch (error: any) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contact submissions' },
      { status: 401 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const updated = await adminUpdateContactSubmission(id, updates)
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating contact submission:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update contact submission' },
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

    await adminDeleteContactSubmission(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting contact submission:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete contact submission' },
      { status: 401 }
    )
  }
}


