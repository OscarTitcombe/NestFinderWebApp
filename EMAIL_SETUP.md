# Email Notifications Setup Guide

This guide will help you set up email notifications for NestFinder using Resend.

## Why Resend?

Resend is a modern email API that's:
- Easy to set up
- Developer-friendly
- Free tier available (3,000 emails/month)
- Great deliverability
- Simple API

## Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Go to **API Keys** in your Resend dashboard
2. Click **Create API Key**
3. Give it a name (e.g., "NestFinder Production")
4. Copy the API key (starts with `re_`)

## Step 3: Set Up Your Sender Email

You have two options:

### Option A: Use Resend's Test Domain (Quick Start)

For development, you can use Resend's test domain:
- Email: `onboarding@resend.dev`
- No verification needed
- Works immediately
- **Note:** Emails sent from this domain may go to spam

### Option B: Verify Your Own Domain (Recommended for Production)

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records Resend provides to your domain
5. Wait for verification (usually a few minutes)
6. Once verified, you can use emails like `notifications@yourdomain.com`

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=NestFinder <notifications@yourdomain.com>
# Or for testing:
# RESEND_FROM_EMAIL=NestFinder <onboarding@resend.dev>

NEXT_PUBLIC_APP_URL=http://localhost:3000
# In production:
# NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Step 5: Test Email Notifications

1. Start your development server: `npm run dev`
2. Create a buyer request
3. Have a seller contact that buyer
4. Check the buyer's email inbox for the notification

## How It Works

1. **Seller contacts buyer**: When a seller sends a message via the ContactModal
2. **Contact created**: The contact is saved to Supabase
3. **Email triggered**: The system automatically sends an email to the buyer
4. **Email content**: Includes:
   - Buyer request details (budget, beds, property type, postcodes)
   - Seller's message
   - Seller's email address
   - Link to view in inbox

## Email Template

The email includes:
- Professional HTML design
- Buyer request summary
- Full seller message
- Seller's email address
- Direct link to inbox
- Plain text fallback

## Troubleshooting

### Emails not sending

1. **Check API key**: Make sure `RESEND_API_KEY` is set correctly
2. **Check from email**: Must be verified domain or use `onboarding@resend.dev`
3. **Check logs**: Look for errors in the browser console or server logs
4. **Check Resend dashboard**: View email logs and delivery status

### Emails going to spam

1. **Verify your domain**: Use your own verified domain instead of test domain
2. **Set up SPF/DKIM**: Resend provides DNS records for this
3. **Warm up your domain**: Start with low volume and gradually increase

### API route errors

1. **Check environment variables**: All required vars must be set
2. **Check Resend API key**: Must be valid and active
3. **Check network**: API route must be accessible from client

## Alternative: Supabase Edge Functions

If you prefer to use Supabase Edge Functions instead:

1. Create an Edge Function in Supabase
2. Set up email service there
3. Create a database trigger to call the function
4. See Supabase docs for Edge Functions

## Alternative: Other Email Services

You can easily swap Resend for:
- **SendGrid**: Popular, good free tier
- **Mailgun**: Developer-friendly
- **AWS SES**: Very cheap at scale
- **Postmark**: Great deliverability

Just update the API route (`app/api/send-notification/route.ts`) to use your preferred service.

## Production Checklist

- [ ] Verify your own domain in Resend
- [ ] Set `RESEND_FROM_EMAIL` to your verified domain
- [ ] Set `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Test email delivery
- [ ] Monitor email logs in Resend dashboard
- [ ] Set up email analytics (optional)

## Cost

- **Resend Free Tier**: 3,000 emails/month
- **Resend Pro**: $20/month for 50,000 emails
- **Resend Enterprise**: Custom pricing

For most startups, the free tier is sufficient initially.

## Security Notes

- Never commit API keys to version control
- Use environment variables for all secrets
- Rotate API keys periodically
- Monitor email usage for abuse


