# 🚀 Launch Action Items - Step by Step

## 1. Production Build Verification

**What I meant**: Even though you're already deployed on Vercel, it's good practice to test the production build locally to catch any issues before deploying. But since you're already live and working, this is **lower priority**.

**If you want to test locally**:
```bash
npm run build
npm start
# Then visit http://localhost:3000 and test everything
```

**Since you're already deployed**: You can skip this if everything works on your live site.

---

## 2. Error Monitoring Setup (Sentry)

**Why**: You need to know when things break in production. Right now, if an error happens, you won't know about it.

### Step-by-Step Setup:

1. **Sign up for Sentry** (free tier: 5,000 errors/month)
   - Go to https://sentry.io/signup/
   - Create a free account

2. **Create a new project**
   - Choose "Next.js" as the platform
   - Copy your DSN (looks like: `https://xxxxx@sentry.io/xxxxx`)

3. **Install Sentry in your project**:
   ```bash
   npm install @sentry/nextjs
   ```

4. **Run the Sentry wizard** (easiest way):
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
   
   This will:
   - Ask for your DSN (paste it)
   - Create `sentry.client.config.ts`
   - Create `sentry.server.config.ts`
   - Create `sentry.edge.config.ts`
   - Update `next.config.js`
   - Create `.sentryclirc`

5. **Add DSN to Vercel environment variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_SENTRY_DSN` = your DSN from step 2
   - Redeploy

6. **Test it**:
   - Add a test error somewhere (temporarily)
   - Check Sentry dashboard - you should see the error

**Time**: ~15 minutes

---

## 3. Email Notifications Not Working - Debugging Guide

Since Supabase magic links work but notifications don't, the issue is likely with the Resend API setup.

### Step 1: Check Browser Console

When a seller contacts a buyer:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for one of these:
   - ✅ `Email notification sent successfully` = Working!
   - ❌ `Email notification failed:` = Check the error
   - ⚠️ `Buyer email not available` = Email not in buyer data

### Step 2: Check Vercel Function Logs

1. Go to **Vercel Dashboard** → Your Project
2. Click **Functions** tab
3. Find `/api/send-notification`
4. Click on it to see logs
5. Look for errors like:
   - `RESEND_API_KEY is not configured`
   - `Failed to send email`
   - Any other error messages

### Step 3: Verify Environment Variables in Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Make sure these are set (for Production environment):
- ✅ `RESEND_API_KEY` = `re_xxxxx` (should start with `re_`)
- ✅ `RESEND_FROM_EMAIL` = `NestFinder <onboarding@resend.dev>` (or your verified domain)
- ✅ `NEXT_PUBLIC_APP_URL` = `https://yourdomain.com` (your actual domain)

**Important**: After adding/changing env vars, you MUST redeploy!

### Step 4: Check Resend Dashboard

1. Go to https://resend.com → Log in
2. Go to **Logs** or **Emails** tab
3. Check if emails are being sent
4. Check delivery status:
   - ✅ **Delivered** = Working!
   - ⏳ **Pending** = Still sending
   - ❌ **Bounced/Failed** = Check email address or API key

### Step 5: Test the API Route Directly

You can test if the API works by running this in your terminal (replace with your actual domain):

```bash
curl -X POST https://yourdomain.com/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "buyerRequest": {
      "budget_min": 200000,
      "budget_max": 300000,
      "beds_min": 2,
      "property_type": "flat",
      "postcode_districts": ["SW1A"]
    },
    "sellerEmail": "seller@example.com",
    "message": "Test message"
  }'
```

**Expected response**:
- ✅ `{"success":true,"messageId":"..."}` = Working!
- ❌ `{"error":"RESEND_API_KEY is not configured"}` = API key missing
- ❌ `{"error":"Failed to send email"}` = Resend API issue

### Common Issues & Fixes:

#### Issue: "RESEND_API_KEY is not configured"
**Fix**:
1. Get API key from https://resend.com/api-keys
2. Add to Vercel environment variables
3. Redeploy

#### Issue: "Failed to send email" from Resend
**Possible causes**:
1. **Invalid API key** → Get a new one from Resend
2. **Unverified domain** → Use `onboarding@resend.dev` for testing
3. **Rate limit** → Check Resend dashboard
4. **Invalid email address** → Check the buyer's email is valid

#### Issue: "Buyer email not available"
**Fix**: The buyer's email should be in the database. Check:
1. When creating buyer requests, is the email field being saved?
2. Check `buyer_requests` table in Supabase - does it have email values?

### Quick Fix Checklist:

- [ ] `RESEND_API_KEY` is set in Vercel (starts with `re_`)
- [ ] `RESEND_FROM_EMAIL` is set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` is set in Vercel (your production domain)
- [ ] Redeployed after adding env vars
- [ ] Checked browser console for errors
- [ ] Checked Vercel function logs
- [ ] Checked Resend dashboard
- [ ] Tested API route directly

---

## 4. Create `.env.example` File

Since I can't create the file directly (it's protected), here's what you need to do:

1. **Create a file** called `.env.example` in your project root (same folder as `package.json`)

2. **Copy this content** into it:

```env
# NestFinder Environment Variables
# Copy this file to .env.local and fill in your actual values
# Never commit .env.local to version control!

# ============================================
# Supabase Configuration (Required)
# ============================================
# Get these from: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Service role key (for server-side operations, optional but recommended)
# Get from: Supabase Dashboard → Settings → API → service_role key
# WARNING: Keep this secret! Never expose in client-side code.
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# Email Service (Resend) - Required for notifications
# ============================================
# Get API key from: https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# Email address to send from
# Format: "Display Name <email@domain.com>"
# For testing: "NestFinder <onboarding@resend.dev>"
# For production: Use your verified domain (e.g., "NestFinder <notifications@yourdomain.com>")
RESEND_FROM_EMAIL=NestFinder <onboarding@resend.dev>

# ============================================
# Application URLs
# ============================================
# Full URL of your application
# Local development: http://localhost:3000
# Production: https://www.nestfinder.co.uk (or your actual domain)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# Error Monitoring (Sentry) - Optional but recommended
# ============================================
# Get DSN from: https://sentry.io/settings/projects/
# Sign up at: https://sentry.io (free tier: 5,000 errors/month)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# ============================================
# Notes
# ============================================
# - All NEXT_PUBLIC_* variables are exposed to the browser
# - Never put secrets in NEXT_PUBLIC_* variables
# - Keep SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY secret
# - For production, set these in your hosting platform (Vercel, etc.)
```

3. **Save the file** - it's safe to commit to git (no real secrets)

---

## Priority Order

1. **🔴 Fix Email Notifications** (30 min) - Core feature
   - Check Vercel env vars
   - Check browser console
   - Check Vercel function logs
   - Test API route

2. **🟡 Set Up Error Monitoring** (15 min) - Know when things break
   - Install Sentry
   - Configure
   - Add to Vercel

3. **🟢 Create `.env.example`** (5 min) - Documentation
   - Create file with template

4. **🟢 Production Build Test** (optional) - Since you're already deployed

---

## Need Help?

If email notifications still don't work after checking everything:
1. Share the error from browser console
2. Share the error from Vercel function logs
3. Share what you see in Resend dashboard
4. Verify the API route is being called (Network tab in DevTools)






