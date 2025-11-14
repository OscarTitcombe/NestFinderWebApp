# Supabase Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Get Your Supabase Credentials
- Go to [app.supabase.com](https://app.supabase.com)
- Select your project
- Go to **Settings** → **API**
- Copy:
  - **Project URL**
  - **anon/public key**

### 2. Create `.env.local` File
```bash
cp .env.local.example .env.local
```

Then add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Open `supabase/schema.sql` from this project
3. Copy and paste into SQL Editor
4. Click **Run**

### 4. Set Up Security Policies
1. Still in SQL Editor
2. Open `supabase/rls_policies.sql`
3. Copy and paste
4. Click **Run**

### 5. Configure Authentication
1. Go to **Authentication** → **URL Configuration**
2. Add redirect URL: `http://localhost:3000/verify`
3. (For production, add your production URL)

### 6. Test It!
```bash
npm run dev
```

Visit `http://localhost:3000/signin` and try signing in!

## ✅ What's Been Set Up

- ✅ Database schema (profiles, buyer_requests, seller_properties, contacts)
- ✅ Row Level Security policies
- ✅ Authentication with magic links
- ✅ Market page fetches real buyer requests
- ✅ Buy page saves buyer requests
- ✅ Quiz page saves seller properties
- ✅ Contact modal saves messages

## 📝 Next Steps

1. **Test the flow:**
   - Sign in at `/signin`
   - Post a buyer brief at `/buy`
   - Browse market at `/market?postcode=SW1A`
   - Complete seller quiz at `/quiz?postcode=SW1A`

2. **Customize email templates:**
   - Go to **Authentication** → **Email Templates**
   - Customize the magic link email

3. **Add email notifications** (optional):
   - Set up Supabase Edge Functions
   - Or use a service like Resend/SendGrid
   - Notify buyers when sellers contact them

4. **Production deployment:**
   - Update redirect URLs in Supabase
   - Set production environment variables
   - Consider adding rate limiting

## 🐛 Troubleshooting

**"Invalid API key"**
→ Check `.env.local` has correct values and restart dev server

**"Row Level Security policy violation"**
→ Make sure you ran `rls_policies.sql`

**Magic link not working**
→ Check redirect URLs in Supabase settings

**Database errors**
→ Ensure `schema.sql` ran successfully

## 📚 Full Documentation

See `SUPABASE_SETUP.md` for detailed documentation.


