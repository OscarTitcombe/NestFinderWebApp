import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Please provide at least 10 characters').max(800, 'Message must be 800 characters or less')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = contactSchema.parse(body)
    
    // Create Supabase client
    const supabase = createClient()
    
    // Insert contact submission
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
        id: data.id 
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

