import { NextRequest, NextResponse } from 'next/server'
import { adminGetAllUsers, adminUpdateUser } from '@/lib/supabase/admin-queries'

export async function GET() {
  try {
    const users = await adminGetAllUsers()
    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 401 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()
    
    // Prevent admin role assignment via API
    if (updates.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot assign admin role via API. Must be done manually in database.' },
        { status: 403 }
      )
    }
    
    const updated = await adminUpdateUser(id, updates)
    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 401 }
    )
  }
}




