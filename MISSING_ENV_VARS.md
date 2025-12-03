# Missing Environment Variables Checklist

Based on your Vercel environment variables, here's what you have and what's missing:

## ✅ **Currently Set in Vercel:**

1. ✅ `SENTRY_AUTH_TOKEN` - For Sentry CLI (different from DSN)
2. ✅ `NEXT_PUBLIC_SITE_URL` - For SEO/metadata
3. ✅ `RESEND_API_KEY` - For email sending
4. ✅ `NEXT_PUBLIC_SUPABASE_URL` - Database connection
5. ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Database auth

---

## 🔴 **MISSING - Critical for Email Notifications:**

### 1. `RESEND_FROM_EMAIL` ⚠️ **REQUIRED**
**Why**: Email notifications won't work without this
**Format**: `"NestFinder <onboarding@resend.dev>"` or `"NestFinder <notifications@yourdomain.com>"`
**Where to get**: 
- For testing: Use `"NestFinder <onboarding@resend.dev>`
- For production: Verify your domain in Resend, then use your domain email

**Add to Vercel**:
- Name: `RESEND_FROM_EMAIL`
- Value: `NestFinder <onboarding@resend.dev>` (or your verified domain email)
- Environment: Production

---

### 2. `NEXT_PUBLIC_APP_URL` ⚠️ **REQUIRED**
**Why**: Email links in notifications need this to point to your inbox
**Value**: Your production domain (e.g., `https://www.nestfinder.co.uk`)
**Used in**: Email notification links (`/inbox`)

**Add to Vercel**:
- Name: `NEXT_PUBLIC_APP_URL`
- Value: `https://www.nestfinder.co.uk` (or your actual domain)
- Environment: Production

---

## 🟡 **MISSING - Important for Sentry:**

### 3. `NEXT_PUBLIC_SENTRY_DSN` ⚠️ **RECOMMENDED**
**Why**: Your Sentry config has the DSN hardcoded, but it should be in env vars
**Current**: DSN is hardcoded in `sentry.server.config.ts`
**Better**: Move to environment variable for flexibility

**Note**: You have `SENTRY_AUTH_TOKEN` which is for CLI operations, but you also need the DSN for the client-side.

**Get from**: Sentry Dashboard → Settings → Projects → Your Project → Client Keys (DSN)

**Add to Vercel**:
- Name: `NEXT_PUBLIC_SENTRY_DSN`
- Value: `https://1c543bc883dbb96e26965cfd5643a48f@o4510409445277696.ingest.de.sentry.io/4510409447112784` (from your config)
- Environment: Production

**Then update** `sentry.server.config.ts` to use:
```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // ... rest of config
})
```

---

## 🟢 **Optional but Recommended:**

### 4. `SUPABASE_SERVICE_ROLE_KEY` (Optional)
**Why**: Needed for server-side operations that bypass RLS
**Current**: Not required for basic functionality
**When needed**: If you add admin features or server-side data operations

**Get from**: Supabase Dashboard → Settings → API → service_role key

---

## 📋 **Quick Action Items:**

### **Must Add (Email won't work without these):**
1. [ ] Add `RESEND_FROM_EMAIL` = `"NestFinder <onboarding@resend.dev>"`
2. [ ] Add `NEXT_PUBLIC_APP_URL` = `https://www.nestfinder.co.uk` (your domain)

### **Should Add (Best practice):**
3. [ ] Add `NEXT_PUBLIC_SENTRY_DSN` = Your Sentry DSN
4. [ ] Update `sentry.server.config.ts` to use env var instead of hardcoded DSN

### **Optional:**
5. [ ] Add `SUPABASE_SERVICE_ROLE_KEY` if you need server-side admin operations

---

## 🚨 **Why Email Notifications Aren't Working:**

The most likely reason your email notifications aren't working is because you're missing:
- ❌ `RESEND_FROM_EMAIL` 
- ❌ `NEXT_PUBLIC_APP_URL`

Even though the code has fallbacks, it's better to set these explicitly.

---

## ✅ **After Adding Variables:**

1. **Redeploy** your Vercel project (env vars only apply after redeploy)
2. **Test** the contact flow (seller → buyer)
3. **Check** browser console for errors
4. **Check** Vercel function logs for `/api/send-notification`

---

## 📝 **Summary:**

**Critical Missing (2)**:
- `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_APP_URL`

**Recommended Missing (1)**:
- `NEXT_PUBLIC_SENTRY_DSN` (move from hardcoded to env var)

**Optional (1)**:
- `SUPABASE_SERVICE_ROLE_KEY`








