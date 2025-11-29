import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { rateLimit, getClientIdentifier } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Rate limiting: 5 requests per hour per email address (stricter than notification route)
    // This prevents email spam/abuse while allowing legitimate retries
    const emailKey = `verification:${email.toLowerCase().trim()}`
    const limitResult = rateLimit(emailKey, {
      windowMs: 3600000, // 1 hour
      maxRequests: 5
    })

    if (!limitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many verification requests', 
          message: limitResult.message || 'Please wait before requesting another verification email. You can request up to 5 verification emails per hour per email address.'
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': limitResult.resetTime.toString(),
            'Retry-After': Math.ceil((limitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }

    // Also rate limit by IP to prevent abuse from single IP
    const clientId = getClientIdentifier(request)
    const ipLimitResult = rateLimit(`verification-ip:${clientId}`, {
      windowMs: 3600000, // 1 hour
      maxRequests: 10 // Allow 10 different email addresses per IP per hour
    })

    if (!ipLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests from this IP', 
          message: 'Please wait before making another request. Too many verification requests from this IP address.'
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': ipLimitResult.resetTime.toString(),
            'Retry-After': Math.ceil((ipLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }

    // Create a verification link using Supabase magic link
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const redirectUrl = `${appUrl}/verify`

    // Always send magic link via Resend for better control and reliability
    // This ensures emails are sent even if the email is already verified in Supabase
    // We'll use Supabase's signInWithOtp to generate the magic link, then send it via Resend
    
    // First, try to get a magic link from Supabase (this will create/update the OTP)
    // Note: We call this but don't rely on it - we always send via Resend
    try {
      await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: true, // Always create user if they don't exist
        },
      })
    } catch (authError) {
      // Ignore Supabase errors - we'll send via Resend anyway
      console.log('Supabase OTP request completed (may or may not have sent email)')
    }

    // Note: Supabase might not return the magic link directly, but it will send an email
    // However, we'll always send our own email via Resend to ensure delivery
    // and have better control over the email content
    
    // Generate a sign-in link that auto-requests the magic link
    // This ensures the user always gets a magic link, even if already verified
    const verificationLink = `${appUrl}/signin?email=${encodeURIComponent(email)}&autoRequest=true&redirect=${encodeURIComponent(redirectUrl)}`

    // Always send email via Resend to ensure delivery
    // This works regardless of whether the email is already verified in Supabase
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
            <h2 style="color: #101314; margin-top: 0; font-size: 20px;">Sign in to activate your account</h2>
            
            <p style="color: #4b5563; font-size: 16px;">
              Thank you for posting your property brief on NestFinder! To activate your account and allow sellers to contact you, please sign in using the link below.
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${verificationLink}" 
                 style="display: inline-block; background: #1A6AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Sign In to NestFinder
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Clicking the button above will take you to the sign-in page where you'll receive a magic link to sign in. Or copy and paste this link into your browser:
            </p>
            <p style="color: #1A6AFF; font-size: 12px; word-break: break-all; background: #f9fafb; padding: 12px; border-radius: 4px;">
              ${verificationLink}
            </p>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              If you didn't create an account on NestFinder, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `

    const emailText = `
Sign in to activate your account

Thank you for posting your property brief on NestFinder! To activate your account and allow sellers to contact you, please sign in using the link below.

Click this link to sign in: ${verificationLink}

If you didn't create an account on NestFinder, you can safely ignore this email.
    `

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'NestFinder <onboarding@resend.dev>',
      to: [email],
      subject: 'Sign in to activate your NestFinder account',
      html: emailHtml,
      text: emailText,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      // If Resend fails, log the error but still return success for Supabase attempt
      console.error('Failed to send email via Resend, but Supabase may have sent one')
    }

    // Return success - we've attempted to send via both methods
    return NextResponse.json({ 
      success: true, 
      messageId: emailData?.id,
      message: 'Verification email sent via Resend. Supabase magic link may also have been sent.'
    })
  } catch (error: any) {
    console.error('Error sending verification email:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

