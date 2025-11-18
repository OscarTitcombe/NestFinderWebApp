# Analytics Setup Guide

## ✅ What's Been Implemented

### 1. Analytics Helper (`lib/analytics.ts`)
- Created analytics tracking functions
- Supports Vercel Analytics
- Can be extended with other providers (GA4, PostHog, etc.)
- Development logging for testing

### 2. Vercel Analytics Integration
- Installed `@vercel/analytics`
- Added `<Analytics />` component to root layout
- Automatically tracks page views

### 3. Event Tracking Added To:
- ✅ User signup/signin (`app/verify/page.tsx`)
- ✅ Buyer request posted (`app/buy/page.tsx`)
- ✅ Buyer request edited (`app/dashboard/page.tsx`)
- ✅ Buyer request deleted (`app/dashboard/page.tsx`)
- ✅ Buyer request paused/activated (`app/dashboard/page.tsx`)
- ✅ Seller contacted buyer (`components/ContactModal.tsx`)
- ✅ Postcode searched (`components/PostcodeSearch.tsx`)
- ✅ Market page viewed (`app/market/page.tsx`)
- ✅ Message read (`app/inbox/page.tsx`)

## 🚀 Next Steps

### 1. Enable Vercel Analytics (5 minutes)

**In Vercel Dashboard**:
1. Go to your project
2. Click **Settings** → **Analytics**
3. Click **Enable Web Analytics**
4. That's it! Page views will start tracking automatically

### 2. Custom Events (Optional - Requires Pro Plan)

**Note**: Custom events require Vercel Pro ($20/month) or Enterprise plan.

**Free Tier**: 
- ✅ Page views work automatically
- ✅ Basic analytics dashboard
- ❌ Custom events not available

**If you upgrade to Pro**:
- Custom events will automatically start working
- No code changes needed
- All tracking is already implemented

### 3. Alternative: Use Google Analytics (Free)

If you want custom events on the free tier, you can add Google Analytics:

1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Add to `lib/analytics.ts`:

```typescript
// Add to trackEvent function
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', eventName, properties)
}
```

4. Add GA4 script to `app/layout.tsx`

## 📊 What You'll See

### Vercel Analytics Dashboard (Free Tier):
- Page views
- Unique visitors
- Top pages
- Referrers
- Geographic data

### Custom Events (Pro Tier):
- User signups
- Buyer requests posted
- Seller contacts
- Postcode searches
- All other tracked events

## 🧪 Testing

### In Development:
- Check browser console for `📊 Analytics Event:` logs
- All events are logged even if Vercel Analytics isn't enabled

### In Production:
- Go to Vercel Dashboard → Analytics
- See page views immediately
- Custom events appear if you have Pro plan

## 💡 Current Status

**What Works Now**:
- ✅ Page views (automatic, free tier)
- ✅ Event tracking code (ready for Pro or GA4)
- ✅ Development logging (always works)

**What Needs Setup**:
- ⚠️ Enable Vercel Analytics in dashboard (5 min)
- ⚠️ Upgrade to Pro for custom events OR add GA4

## 🎯 Recommendation

**For Now**:
1. Enable Vercel Analytics (free, 5 min)
2. Use page views to understand traffic
3. Check console logs in dev to see events

**Later**:
- Upgrade to Vercel Pro for custom events, OR
- Add Google Analytics for free custom events

The code is ready - just needs the service enabled!

