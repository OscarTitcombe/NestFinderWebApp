# Supabase Setup Guide for NestFinder

This guide will walk you through setting up Supabase for your NestFinder application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- A Supabase project created (you mentioned you already have this)

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (this is safe to expose in client-side code)

## Step 2: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Step 3: Set Up the Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/schema.sql` and paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- `profiles` table (extends auth.users)
- `buyer_requests` table (stores buyer property briefs)
- `seller_properties` table (stores seller property information from quiz)
- `contacts` table (stores seller-to-buyer messages)
- Automatic triggers for `updated_at` timestamps
- Function to auto-create profiles on user signup

## Step 4: Set Up Row Level Security (RLS)

1. In the SQL Editor, copy the contents of `supabase/rls_policies.sql`
2. Paste and run it
3. Then copy and run the contents of `supabase/rls_policies_buyer_update.sql` (allows buyers to mark messages as read)

This sets up security policies so that:
- Users can only see their own data
- Anyone can view active buyer requests and seller properties (for browsing)
- Only authenticated users can create/update/delete their own data
- Buyers can mark messages as read

## Step 5: Configure Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Ensure **Email** provider is enabled
3. Configure email templates (optional but recommended):
   - Go to **Authentication** → **Email Templates**
   - Customize the "Magic Link" template to match your brand

4. Set up redirect URLs:
   - Go to **Authentication** → **URL Configuration**
   - Add your site URL to **Redirect URLs**:
     - `http://localhost:3000/verify` (for development)
     - `https://yourdomain.com/verify` (for production)

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/signin` and try signing in with your email
3. Check your email for the magic link
4. Click the link to verify it redirects to `/verify` and signs you in

## Step 7: Set Up Email Notifications (Optional but Recommended)

1. Sign up for [Resend](https://resend.com) (free tier: 3,000 emails/month)
2. Get your API key from Resend dashboard
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=NestFinder <onboarding@resend.dev>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
4. See `EMAIL_SETUP.md` for detailed instructions

**Note:** For production, verify your own domain in Resend for better deliverability.

## Step 8: Update Components to Use Real Data

The following components have been updated to use Supabase:

- ✅ `/app/signin/page.tsx` - Uses Supabase Auth
- ✅ `/app/verify/page.tsx` - Handles Supabase verification
- ✅ `/app/market/page.tsx` - Fetches buyer requests from Supabase
- ✅ `/app/buy/page.tsx` - Saves buyer requests to Supabase
- ✅ `/app/quiz/page.tsx` - Saves seller properties to Supabase
- ✅ `/components/ContactModal.tsx` - Saves contacts and triggers email notifications

## Database Schema Overview

### `profiles`
- Extends Supabase auth.users
- Stores user profile information (name, phone, role)

### `buyer_requests`
- Stores buyer property briefs
- Fields: budget range, bedrooms, property type, postcode districts, description, email
- Status: active, paused, fulfilled, expired

### `seller_properties`
- Stores seller property information from the quiz
- Fields: postcode, property type, price range, bedrooms, timeframe, features
- Status: active, paused, sold, withdrawn

### `contacts`
- Stores seller-to-buyer messages
- Links sellers to buyer requests
- Status: pending, sent, read, replied

## API Functions Available

All database operations are available through `lib/supabase/queries.ts`:

- `getBuyerRequests(postcodeDistrict?)` - Get active buyer requests
- `createBuyerRequest(request)` - Create a new buyer request
- `getSellerProperties(postcodeDistrict?)` - Get active seller properties
- `createSellerProperty(property)` - Create a new seller property
- `createContact(contact)` - Create a contact/message

## Authentication Functions

Available in `lib/supabase/auth.ts`:

- `signInWithEmail(email)` - Send magic link
- `signOut()` - Sign out current user
- `verifyOtp(email, token)` - Verify email token
- `getCurrentUser()` - Get current authenticated user
- `getSession()` - Get current session

## Next Steps

1. ✅ Database schema created
2. ✅ RLS policies set up
3. ✅ Authentication implemented
4. ⏳ Update market page to fetch real buyer requests
5. ⏳ Update buy page to save buyer requests
6. ⏳ Update quiz page to save seller properties
7. ⏳ Update contact modal to save contacts
8. ⏳ Add user profile management
9. ⏳ Add email notifications (using Supabase Edge Functions or external service)

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` file has the correct values
- Restart your development server after changing environment variables

### "Row Level Security policy violation"
- Make sure you've run the RLS policies SQL script
- Check that the user is authenticated (for protected operations)

### Magic link not working
- Check that redirect URLs are configured in Supabase
- Verify email provider is enabled
- Check spam folder for the email

### Database errors
- Ensure you've run the schema.sql script
- Check that all required extensions are enabled (uuid-ossp)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

