# Supabase OTP Email Template Setup

## Quick Fix for Template Not Saving

If your email template edits aren't saving in Supabase:

1. **Make sure you're in the right place:**
   - Go to **Authentication** → **Email Templates**
   - Click on **"Magic link"** (even though we're using OTP, Supabase uses the Magic link template for OTP codes)

2. **The template editor:**
   - You should see a form with **Subject** and **Body** fields
   - If you only see a list, **click on "Magic link"** to open the editor

3. **To save:**
   - Paste your HTML in the **Body** field
   - Update the **Subject** field
   - **Scroll down** and click the **"Save"** button at the bottom
   - Wait for the success message

4. **If it still doesn't save:**
   - Try refreshing the page
   - Clear browser cache
   - Try a different browser
   - Make sure you have admin access to the project

## OTP Email Template

Since we're using **OTP codes only** (no magic links), use this template:

### Subject:
```
Your NestFinder sign-in code
```

### Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #101314; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F7FAF8;">
  
  <!-- Header with brand colors -->
  <div style="background: #92D6A3; padding: 32px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">NestFinder</h1>
  </div>
  
  <!-- Main content card -->
  <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #E1EDE6; border-top: none; border-radius: 0 0 12px 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
    <h2 style="color: #101314; margin-top: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.01em;">Your sign-in code</h2>
    
    <p style="color: #2B3135; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
      Enter this 6-digit code to sign in to your NestFinder account:
    </p>
    
    <!-- Code display with brand styling -->
    <div style="margin: 32px 0; text-align: center;">
      <div style="display: inline-block; background: #F7FAF8; border: 2px solid #92D6A3; border-radius: 12px; padding: 24px 48px;">
        <p style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #101314; margin: 0; font-family: 'Courier New', monospace; line-height: 1.2;">
          {{ .Token }}
        </p>
      </div>
    </div>
    
    <!-- Expiry notice -->
    <p style="color: #6B7280; font-size: 14px; margin-top: 28px; line-height: 1.5;">
      This code will expire in 1 hour. If you didn't request this code, you can safely ignore this email.
    </p>
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; margin-top: 24px; color: #9CA3AF; font-size: 12px; line-height: 1.5;">
    <p style="margin: 0;">© NestFinder. All rights reserved.</p>
  </div>
</body>
</html>
```

## Important: Enable OTP in Supabase

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Make sure it's **enabled**
4. Look for **"Enable email OTP"** or similar option and check it
5. **Save** changes

## How It Works

- User enters email → We call `requestOtpCode()`
- Supabase sends email with 6-digit code (uses the template above)
- User enters code → We call `verifyOtpCode()`
- User is signed in!

## Template Variables

- `{{ .Token }}` - The 6-digit code (this is what you need!)
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL

## Testing

1. Go to your sign-in page
2. Enter your email
3. Check your email inbox
4. You should see the 6-digit code in a styled box
5. Enter the code to sign in

## Troubleshooting

### Code not being sent
- Make sure "Enable email OTP" is checked in Authentication → Providers
- Verify Email provider is enabled
- Check that you're NOT setting `emailRedirectTo` in the code (we removed that)

### Template not saving
- Make sure you scroll down and click "Save"
- Try refreshing the page
- Check browser console for errors
- Make sure you have proper permissions

### Code not working
- Make sure the code is exactly 6 digits
- Check that it hasn't expired (1 hour)
- Verify the email matches what you entered

