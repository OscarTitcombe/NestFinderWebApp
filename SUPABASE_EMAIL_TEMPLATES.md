# Supabase Email Templates Configuration Guide

This guide shows you how to customize the magic link and OTP code email templates in Supabase Dashboard.

## Step 1: Access Email Templates

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**
4. You'll see templates for:
   - Magic Link
   - Change Email Address
   - Reset Password
   - Email OTP (for 6-digit codes)

## Step 2: Customize Magic Link Template

### Click on "Magic Link" template

You'll see a form with:
- **Subject**: Email subject line
- **Body**: HTML email template

### Magic Link Email Template

**Subject:**
```
Sign in to NestFinder
```

**Body (HTML):**
```html
<h2>Sign in to NestFinder</h2>

<p>Click the link below to sign in to your NestFinder account:</p>

<p><a href="{{ .ConfirmationURL }}">Sign In to NestFinder</a></p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #1A6AFF;">{{ .ConfirmationURL }}</p>

<p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
  This link will expire in 1 hour. If you didn't request this link, you can safely ignore this email.
</p>

<p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
  <strong>Tip:</strong> Click the link on the same device where you requested it. If you're on a different device, use the code option instead.
</p>
```

### Enhanced Magic Link Template (with branding)

**Subject:**
```
Sign in to NestFinder
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  
  <div style="background: linear-gradient(135deg, #1A6AFF 0%, #00B894 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">NestFinder</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #101314; margin-top: 0; font-size: 20px;">Sign in to NestFinder</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      Click the button below to sign in to your NestFinder account. No password needed!
    </p>
    
    <div style="margin: 30px 0; text-align: center;">
      <a href="{{ .ConfirmationURL }}" 
         style="display: inline-block; background: #1A6AFF; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Sign In to NestFinder
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      Or copy and paste this link into your browser:
    </p>
    <p style="color: #1A6AFF; font-size: 12px; word-break: break-all; background: #f9fafb; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb;">
      {{ .ConfirmationURL }}
    </p>
    
    <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 12px; margin-top: 20px;">
      <p style="color: #92400e; font-size: 13px; margin: 0;">
        <strong>⚠️ Important:</strong> Click the link on the same device where you requested it. If you're on a different device, use the code option instead.
      </p>
    </div>
    
    <p style="color: #9ca3af; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      This link will expire in 1 hour. If you didn't request this link, you can safely ignore this email.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
    <p>© NestFinder. All rights reserved.</p>
  </div>
</body>
</html>
```

## Step 3: Configure Email OTP Template (for 6-digit codes)

### Click on "Email OTP" template

This is for the 6-digit code option that works cross-device.

**Subject:**
```
Your NestFinder sign-in code
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  
  <div style="background: linear-gradient(135deg, #1A6AFF 0%, #00B894 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">NestFinder</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <h2 style="color: #101314; margin-top: 0; font-size: 20px;">Your sign-in code</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      Enter this 6-digit code to sign in to your NestFinder account:
    </p>
    
    <div style="margin: 30px 0; text-align: center;">
      <div style="display: inline-block; background: #f3f4f6; border: 2px solid #1A6AFF; border-radius: 8px; padding: 20px 40px;">
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1A6AFF; margin: 0; font-family: 'Courier New', monospace;">
          {{ .Token }}
        </p>
      </div>
    </div>
    
    <div style="background: #d1fae5; border: 1px solid #10b981; border-radius: 6px; padding: 12px; margin-top: 20px;">
      <p style="color: #065f46; font-size: 13px; margin: 0;">
        <strong>✓ Cross-device friendly:</strong> You can request this code on one device and enter it on another!
      </p>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
      This code will expire in 1 hour. If you didn't request this code, you can safely ignore this email.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
    <p>© NestFinder. All rights reserved.</p>
  </div>
</body>
</html>
```

## Step 4: Enable Email OTP

To make the 6-digit code option work:

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Make sure it's enabled
4. Check **"Enable email OTP"** option (if available)
5. Save changes

## Step 5: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your redirect URLs:
   - Development: `http://localhost:3000/verify`
   - Production: `https://yourdomain.com/verify`
3. Save changes

## Available Template Variables

Supabase provides these variables you can use in templates:

### Magic Link Template:
- `{{ .ConfirmationURL }}` - The magic link URL
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL
- `{{ .Token }}` - The token (usually in URL)

### Email OTP Template:
- `{{ .Token }}` - The 6-digit code
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL

## How to Paste the Code

1. **Copy the HTML template** from above
2. **Go to Supabase Dashboard** → Authentication → Email Templates
3. **Click on the template** you want to customize (Magic Link or Email OTP)
4. **Paste the HTML** into the "Body" field
5. **Update the Subject** field
6. **Click "Save"** at the bottom

That's it! No code files to edit - everything is done in the Supabase Dashboard.

## Testing Your Templates

1. Go to your app's sign-in page
2. Enter your email and request a magic link or code
3. Check your email inbox
4. Verify the email looks correct
5. Test clicking the link or entering the code

## Troubleshooting

### Templates not updating
- Make sure you clicked "Save" after pasting
- Clear your browser cache
- Wait a few minutes for changes to propagate

### Code option not working
- Make sure "Enable email OTP" is checked in Authentication → Providers
- Verify Email provider is enabled
- Check that you're using `requestOtpCode()` in your code (not `signInWithEmail()`)

### Links not working
- Verify redirect URLs are set correctly
- Check that `/verify` route exists in your app
- Make sure `NEXT_PUBLIC_APP_URL` is set correctly

## Customization Tips

- **Colors**: Update the hex colors (`#1A6AFF`, `#00B894`) to match your brand
- **Logo**: Add an `<img>` tag with your logo URL
- **Fonts**: Change the font-family to match your brand
- **Layout**: Adjust padding, margins, and spacing as needed
- **Content**: Modify the text to match your brand voice

## Security Notes

- Never share your Supabase project credentials
- The `{{ .ConfirmationURL }}` and `{{ .Token }}` are automatically generated by Supabase
- Links and codes expire after 1 hour by default
- Users can only use each link/code once


