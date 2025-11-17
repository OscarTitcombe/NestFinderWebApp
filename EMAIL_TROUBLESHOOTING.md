# Email Notification Troubleshooting Guide

## Why We Use Resend

### The Problem with Supabase's Built-in Email

Supabase **does** have email sending, but it's **very limited**:

1. **Only for Auth Emails**: Supabase's built-in email service is designed ONLY for authentication emails (magic links, password resets, etc.)
2. **No Custom Templates**: You can't send custom transactional emails like "You have a new message"
3. **Limited Customization**: Can't control the content, design, or branding easily
4. **Rate Limits**: Very strict limits on custom emails

### Why Resend?

Resend is a **modern email API** specifically designed for transactional emails:

✅ **Free Tier**: 3,000 emails/month (perfect for startups)  
✅ **Easy Setup**: Simple API, great documentation  
✅ **Custom Templates**: Full control over email design  
✅ **Better Deliverability**: Optimized for inbox delivery  
✅ **Developer-Friendly**: Modern API, great error messages  
✅ **Cost-Effective**: $20/month for 50,000 emails when you scale  

### Alternatives

You could also use:
- **SendGrid** (similar, also good)
- **Mailgun** (developer-friendly)
- **AWS SES** (very cheap but more complex)
- **Postmark** (great deliverability, more expensive)

But Resend is the easiest to get started with.

---

## Troubleshooting Email Notifications

### Step 1: Check if Resend API Key is Set

**In Development (.env.local):**
```bash
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=NestFinder <onboarding@resend.dev>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**In Production (Vercel):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Check these are set:
   - `RESEND_API_KEY` (should start with `re_`)
   - `RESEND_FROM_EMAIL`
   - `NEXT_PUBLIC_APP_URL` (your production URL)

### Step 2: Check Browser Console

When a seller contacts a buyer:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for:
   - ✅ `Email notification sent successfully` = Working!
   - ❌ `Email notification failed:` = Check the error details

### Step 3: Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Click on `/api/send-notification`
3. Check the logs for errors

Common errors:
- `RESEND_API_KEY is not configured` → API key missing
- `Rate limit exceeded` → Too many requests (shouldn't happen normally)
- `Failed to send email` → Resend API error (check Resend dashboard)

### Step 4: Check Resend Dashboard

1. Go to [resend.com](https://resend.com) → Log in
2. Go to **Logs** or **Emails**
3. Check if emails are being sent
4. Check delivery status:
   - ✅ **Delivered** = Working!
   - ⏳ **Pending** = Still sending
   - ❌ **Bounced/Failed** = Check email address

### Step 5: Verify Email Address

Make sure:
- Buyer's email is valid (check `buyer.email` in the code)
- Email is not blocked/spam
- Test with your own email first

### Step 6: Test the API Route Directly

You can test the email API directly:

```bash
curl -X POST http://localhost:3000/api/send-notification \
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

---

## Common Issues & Fixes

### Issue: "RESEND_API_KEY is not configured"

**Fix:**
1. Check `.env.local` exists and has the key
2. Restart dev server (`npm run dev`)
3. In production, check Vercel environment variables

### Issue: "Failed to send email" from Resend

**Possible causes:**
1. **Invalid API key** → Get a new one from Resend dashboard
2. **Unverified domain** → Use `onboarding@resend.dev` for testing
3. **Rate limit** → Check Resend dashboard for limits
4. **Invalid email address** → Check the `to` email is valid

### Issue: Emails not appearing in inbox

**Check:**
1. Spam/junk folder
2. Resend dashboard shows "Delivered"
3. Email address is correct
4. Try a different email provider (Gmail, Outlook, etc.)

### Issue: No errors but emails not sending

**Check:**
1. Browser console for errors
2. Network tab - is the API call being made?
3. Vercel function logs
4. Resend dashboard logs

---

## Quick Test Checklist

- [ ] `RESEND_API_KEY` is set in `.env.local` (dev) or Vercel (prod)
- [ ] `RESEND_FROM_EMAIL` is set
- [ ] `NEXT_PUBLIC_APP_URL` is set correctly
- [ ] Dev server restarted after adding env vars
- [ ] Browser console shows no errors
- [ ] Vercel function logs show no errors
- [ ] Resend dashboard shows email attempts
- [ ] Test email address is valid
- [ ] Checked spam folder

---

## Still Not Working?

1. **Check the code**: Make sure `buyer.email` is being passed correctly
2. **Test API directly**: Use curl command above
3. **Check Resend account**: Make sure account is active, not suspended
4. **Try different email**: Test with a different email address
5. **Check rate limits**: Make sure you haven't exceeded Resend's free tier

---

## Need Help?

If emails still aren't working:
1. Share the error from browser console
2. Share the error from Vercel function logs
3. Share the error from Resend dashboard
4. Check if the API route is being called (Network tab)

