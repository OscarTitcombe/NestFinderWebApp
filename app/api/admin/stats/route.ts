import { NextResponse } from 'next/server'
import { adminGetStats } from '@/lib/supabase/admin-queries'

export async function GET() {
  try {
    const stats = await adminGetStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 401 }
    )
  }
}




