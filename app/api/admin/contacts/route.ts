import { NextRequest, NextResponse } from 'next/server'
import { adminGetAllContacts, adminUpdateContact, adminDeleteContact } from '@/lib/supabase/admin-queries'

export async function GET() {
  try {
    const contacts = await adminGetAllContacts()
    return NextResponse.json(contacts)
  } catch (error: any) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contacts' },
      { status: 401 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    const updated = await adminUpdateContact(id, updates)
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update contact' },
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

    await adminDeleteContact(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete contact' },
      { status: 401 }
    )
  }
}





