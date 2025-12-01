import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { z } from 'zod'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Please provide at least 10 characters').max(800, 'Message must be 800 characters or less')
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - allow 3 submissions per 15 minutes per IP
    const clientId = getClientIdentifier(request)
    const rateLimitResult = rateLimit(`contact-form:${clientId}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 3
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)
    
    // Create anonymous Supabase client (works without authentication)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll() {}
        }
      }
    )
    
    // Insert contact submission (RLS policy allows anonymous inserts)
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          message: validatedData.message,
          status: 'new'
        }
      ])
      .select()
      .single()
    
    if (error) {
      console.error('Error saving contact submission:', error)
      return NextResponse.json(
        { error: 'Failed to submit contact form. Please try again.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully',
        id: data.id,
        remaining: rateLimitResult.remaining
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error processing contact submission:', error)
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}

