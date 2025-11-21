// Supabase Edge Function alternative for sending email notifications
// This is an optional alternative to the Next.js API route
// Deploy with: supabase functions deploy send-email-notification

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') || 'NestFinder <onboarding@resend.dev>'
const APP_URL = Deno.env.get('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000'

serve(async (req) => {
  try {
    const { to, buyerRequest, sellerEmail, message } = await req.json()

    if (!to || !buyerRequest || !sellerEmail || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const resend = new Resend(RESEND_API_KEY)

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }

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
              <p style="margin: 0; color: #4b5563; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #166534; font-size: 14px;">Seller's email:</p>
              <p style="margin: 0; color: #166534; font-size: 16px; font-weight: 500;">${sellerEmail}</p>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${APP_URL}/inbox" 
                 style="display: inline-block; background: #1A6AFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View in Inbox
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              You can reply directly to the seller at <strong>${sellerEmail}</strong> or view all your messages in your NestFinder inbox.
            </p>
          </div>
        </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [to],
      subject: `New message about your ${formatCurrency(buyerRequest.budget_min)} - ${formatCurrency(buyerRequest.budget_max)} buyer request`,
      html: emailHtml,
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})



