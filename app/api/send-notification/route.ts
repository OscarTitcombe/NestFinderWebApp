import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import DOMPurify from 'isomorphic-dompurify'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 requests per minute per IP
    const clientId = getClientIdentifier(request)
    const limitResult = rateLimit(clientId, {
      windowMs: 60000, // 1 minute
      maxRequests: 10
    })

    if (!limitResult.success) {
      return NextResponse.json(
        { error: limitResult.message || 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': limitResult.resetTime.toString(),
            'Retry-After': Math.ceil((limitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }
    // Initialize Resend only when handling a request (not at build time)
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY is not configured in environment variables')
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured', message: 'Please set RESEND_API_KEY in your environment variables' },
        { status: 500 }
      )
    }
    const resend = new Resend(apiKey)

    const body = await request.json()
    const { to, buyerRequest, sellerEmail, message } = body

    if (!to || !buyerRequest || !sellerEmail || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Sanitize user input to prevent XSS attacks
    const sanitizedMessage = DOMPurify.sanitize(message, { 
      ALLOWED_TAGS: [], // Remove all HTML tags
      ALLOWED_ATTR: [] 
    })
    const sanitizedSellerEmail = DOMPurify.sanitize(sellerEmail, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    })

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }

    // Create email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1A6AFF 0%, #00B894 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">NestFinder</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #101314; margin-top: 0; font-size: 20px;">You have a new message from a seller! 🏠</h2>
            
            <p style="color: #4b5563; font-size: 16px;">
              A seller has contacted you about your buyer request:
            </p>
            
            <div style="background: #f9fafb; border-left: 4px solid #1A6AFF; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #101314;">
                ${formatCurrency(buyerRequest.budget_min)} - ${formatCurrency(buyerRequest.budget_max)}
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                ${buyerRequest.beds_min} ${buyerRequest.beds_min === 1 ? 'bed' : 'beds'} • ${buyerRequest.property_type} • ${buyerRequest.postcode_districts.join(', ')}
              </p>
            </div>
            
            <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 12px 0; font-weight: 600; color: #101314;">Message from seller:</p>
              <p style="margin: 0; color: #4b5563; white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #166534; font-size: 14px;">Seller's email:</p>
              <p style="margin: 0; color: #166534; font-size: 16px; font-weight: 500;">${sanitizedSellerEmail}</p>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/inbox" 
                 style="display: inline-block; background: #1A6AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View in Inbox
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              You can reply directly to the seller at <strong>${sanitizedSellerEmail}</strong> or view all your messages in your NestFinder inbox.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>This email was sent by NestFinder. If you have any questions, please contact support.</p>
          </div>
        </body>
      </html>
    `

    const emailText = `
You have a new message from a seller on NestFinder!

A seller has contacted you about your buyer request:
${formatCurrency(buyerRequest.budget_min)} - ${formatCurrency(buyerRequest.budget_max)}
${buyerRequest.beds_min} ${buyerRequest.beds_min === 1 ? 'bed' : 'beds'} • ${buyerRequest.property_type} • ${buyerRequest.postcode_districts.join(', ')}

Message from seller:
${sanitizedMessage}

Seller's email: ${sanitizedSellerEmail}

View in your inbox: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/inbox

You can reply directly to the seller at ${sanitizedSellerEmail} or view all your messages in your NestFinder inbox.
    `

    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'NestFinder <onboarding@resend.dev>',
      to: [to],
      subject: `New message about your ${formatCurrency(buyerRequest.budget_min)} - ${formatCurrency(buyerRequest.budget_max)} buyer request`,
      html: emailHtml,
      text: emailText,
    })

    if (error) {
      console.error('❌ Resend API error:', error)
      console.error('Email details:', {
        from: process.env.RESEND_FROM_EMAIL || 'NestFinder <onboarding@resend.dev>',
        to: to,
        hasApiKey: !!apiKey,
        apiKeyPrefix: apiKey?.substring(0, 5) + '...'
      })
      return NextResponse.json(
        { error: 'Failed to send email', details: error, message: 'Check Resend API key and configuration' },
        { status: 500 }
      )
    }
    
    console.log('✅ Email sent successfully:', { messageId: data?.id, to })

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error: any) {
    console.error('Error sending notification email:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

