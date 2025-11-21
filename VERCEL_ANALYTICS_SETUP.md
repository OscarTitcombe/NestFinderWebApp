# Vercel Analytics Event Tracking Setup

## ✅ What's Been Implemented

### 1. Analytics Helper (`lib/analytics.ts`)
- ✅ Uses Vercel Analytics `track()` function
- ✅ All events ready to track
- ✅ Development logging for testing

### 2. Vercel Analytics Component
- ✅ Installed `@vercel/analytics`
- ✅ Added `<Analytics />` to root layout
- ✅ Automatically tracks page views

### 3. Event Tracking Added To:
- ✅ User signup/signin
- ✅ Buyer request posted/edited/deleted/paused/activated
- ✅ Seller contacted buyer
- ✅ Postcode searched
- ✅ Market page viewed
- ✅ Message read

## 🚀 Setup Instructions

### Step 1: Enable Vercel Analytics (5 minutes)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your NestFinder project
3. Go to **Settings** → **Analytics**
4. Click **Enable Web Analytics**
5. ✅ Page views will start tracking immediately (free tier)

### Step 2: Enable Custom Events (Requires Pro Plan)

**Important**: Custom events require **Vercel Pro** ($20/month) or **Enterprise** plan.

**Free Tier**:
- ✅ Page views work automatically
- ✅ Basic analytics dashboard
- ❌ Custom events not available

**Pro/Enterprise Tier**:
- ✅ All custom events work automatically
- ✅ No code changes needed
- ✅ All tracking is already implemented

### Step 3: Verify It's Working

**In Development**:
1. Open browser console (F12)
2. Perform actions (signup, post request, etc.)
3. Look for: `📊 Analytics Event: user_signin` etc.
4. Events are logged even without Pro plan (for testing)

**In Production** (with Pro plan):
1. Go to Vercel Dashboard → Analytics
2. Click **Events** tab
3. See all custom events:
   - `user_signin`
   - `buyer_request_posted`
   - `seller_contacted_buyer`
   - `postcode_searched`
   - etc.

## 📊 Events Being Tracked

### User Events:
- `user_signup` - When user signs up
- `user_signin` - When user signs in
- `user_signout` - When user signs out

### Buyer Events:
- `buyer_request_posted` - New buyer request created
  - Properties: budget_min, budget_max, beds_min, property_type, postcode_count
- `buyer_request_edited` - Buyer request updated
- `buyer_request_deleted` - Buyer request removed
- `buyer_request_paused` - Buyer request paused
- `buyer_request_activated` - Buyer request reactivated

### Seller Events:
- `seller_contacted_buyer` - Seller sends message to buyer
  - Properties: buyer_request_id, budget_min, budget_max

### Search & Browsing:
- `postcode_searched` - User searches for postcode
  - Properties: postcode, normalized_postcode
- `market_page_viewed` - Market page loaded
  - Properties: postcode, buyer_count

### Messaging:
- `message_read` - Buyer reads a message
  - Properties: contact_id

## 🧪 Testing

### Test in Development:

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12 → Console tab)

3. **Perform actions**:
   - Sign in → Should see `📊 Analytics Event: user_signin`
   - Post buyer request → Should see `📊 Analytics Event: buyer_request_posted`
   - Contact buyer → Should see `📊 Analytics Event: seller_contacted_buyer`
   - Search postcode → Should see `📊 Analytics Event: postcode_searched`

4. **Check console logs** - All events log with their properties

### Test in Production (with Pro plan):

1. Deploy to Vercel
2. Enable Analytics in dashboard
3. Perform actions on live site
4. Go to Vercel Dashboard → Analytics → Events
5. See events appear in real-time

## 💡 Important Notes

### Custom Events Requirement:
- **Free Tier**: Custom events code runs but events won't appear in dashboard
- **Pro Tier**: All custom events work and appear in dashboard
- **Development**: Events always log to console for testing

### What Works on Free Tier:
- ✅ Page views (automatic)
- ✅ Unique visitors
- ✅ Top pages
- ✅ Referrers
- ✅ Geographic data

### What Requires Pro Tier:
- ⚠️ Custom events (all the events we're tracking)
- ⚠️ Event properties
- ⚠️ Conversion tracking

## 🎯 Current Status

**Code**: ✅ **100% Complete**
- All events implemented
- All tracking calls added
- Ready to use

**Setup**: ⚠️ **Needs Configuration**
1. Enable Vercel Analytics in dashboard (free, 5 min)
2. Upgrade to Pro for custom events ($20/month) OR
3. Use development logging for now (free, works immediately)

## 📝 Next Steps

1. **Enable Vercel Analytics** (free, 5 min)
   - Dashboard → Settings → Analytics → Enable

2. **Test in Development** (free, now)
   - Check console logs
   - Verify events fire

3. **Upgrade to Pro** (when ready, $20/month)
   - Custom events will automatically work
   - No code changes needed

## 🔍 Viewing Analytics

### Vercel Dashboard:
1. Go to your project
2. Click **Analytics** tab
3. See:
   - **Overview**: Page views, visitors, top pages
   - **Events** (Pro only): All custom events
   - **Performance**: Page load times

### Development Console:
- All events log to console
- Format: `📊 Analytics Event: event_name { properties }`
- Works even without Pro plan

## ✅ Summary

**What's Done**:
- ✅ Analytics helper created
- ✅ Vercel Analytics installed
- ✅ All events tracked
- ✅ Development logging works

**What You Need**:
1. Enable Analytics in Vercel dashboard (free)
2. Upgrade to Pro for custom events ($20/month)

**The code is ready - just enable it in Vercel!**


