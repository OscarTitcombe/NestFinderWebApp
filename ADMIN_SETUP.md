# Admin Dashboard Setup Guide

## 🔒 Security Overview

The admin system is designed with multiple layers of security to prevent unauthorized access:

1. **Database-level protection**: Users cannot self-assign admin role
2. **Server-side verification**: All admin checks happen server-side
3. **RLS policies**: Row Level Security prevents role escalation
4. **Middleware protection**: Admin routes are protected at the middleware level
5. **Manual assignment only**: Admin role can only be assigned manually in the database

## 📋 Setup Steps

### Step 1: Run the Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/002_add_admin_role.sql`
4. Click **Run** to execute the migration

This migration will:
- Add 'admin' to the role enum
- Create a function to check admin status
- Add RLS policies that prevent users from setting their role to 'admin'
- Add admin policies to view/manage all data

### Step 2: Assign Admin Role to Your Account

**IMPORTANT**: Admin role can ONLY be assigned manually in the database. There is no UI or API endpoint to assign admin role.

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **profiles**
3. Find your user profile (search by your email)
4. Click **Edit** on your profile row
5. Change the `role` field from `'both'` (or whatever it is) to `'admin'`
6. Click **Save**

#### Option B: Via SQL Editor

1. Go to **SQL Editor** in Supabase
2. Run this SQL (replace `your-email@example.com` with your actual email):

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### Step 3: Verify Admin Access

1. Sign in to your NestFinder account
2. Navigate to `/admin` in your browser
3. You should see the admin dashboard with stats and management tools

If you see an "Unauthorized" error, double-check:
- The role was set correctly in the database
- You're signed in with the correct account
- The migration was run successfully

## 🛡️ Security Features

### 1. Role Assignment Protection

- Users **CANNOT** update their own role to 'admin' via the API
- The RLS policy explicitly prevents this: `role != 'admin'` in the WITH CHECK clause
- Even if someone tries to call the API directly, the database will reject it

### 2. Server-Side Verification

All admin functions use `requireAdmin()` which:
- Checks authentication
- Verifies admin role in the database
- Throws an error if not admin

### 3. Middleware Protection

The middleware checks admin status before allowing access to `/admin` routes:
- If not authenticated → redirects to sign in
- If authenticated but not admin → redirects to dashboard
- Only admins can access admin routes

### 4. API Route Protection

All admin API routes (`/api/admin/*`) call `requireAdmin()` which ensures:
- Only authenticated admins can access
- Returns 401 Unauthorized if not admin
- All operations are logged

## 📊 Admin Dashboard Features

Once set up, the admin dashboard provides:

1. **Overview Tab**
   - Quick stats: total users, listings, messages
   - Active listings count
   - Unread messages count

2. **Buyer Requests Tab**
   - View all buyer requests (active, paused, fulfilled, expired)
   - Search by email or postcode
   - Update status (active/paused/fulfilled/expired)
   - Delete buyer requests

3. **Seller Properties Tab**
   - View all seller properties
   - Search by postcode or email
   - Update status (active/paused/sold/withdrawn)
   - Delete seller properties

4. **Messages Tab**
   - View all contacts/messages between sellers and buyers
   - Search by sender email or message content
   - See message status (pending/sent/read/replied)

5. **Users Tab**
   - View all registered users
   - Search by email or name
   - See user roles (buyer/seller/both/admin)
   - View join dates

## 🔐 Best Practices

1. **Limit Admin Accounts**: Only assign admin role to trusted team members
2. **Regular Audits**: Periodically check who has admin access
3. **Monitor Activity**: Review admin actions in your logs
4. **Use Strong Passwords**: Ensure admin accounts have strong passwords
5. **Two-Factor Authentication**: Consider enabling 2FA for admin accounts (if Supabase supports it)

## 🚨 Troubleshooting

### "Unauthorized: Admin access required"

- Check that your user's role is set to 'admin' in the database
- Verify you're signed in with the correct account
- Clear browser cookies and sign in again
- Check that the migration was run successfully

### "Cannot assign admin role via API"

This is **expected behavior**. Admin role can only be assigned manually in the database. This is a security feature, not a bug.

### Admin dashboard shows no data

- Check that the migration created the admin RLS policies
- Verify you can see data in Supabase dashboard
- Check browser console for errors

## 📝 Adding More Admins

To add more admin users:

1. Go to Supabase dashboard → Table Editor → profiles
2. Find the user you want to make admin
3. Edit their profile and set `role = 'admin'`
4. Save

**Never** create an API endpoint or UI to assign admin roles. Always do it manually in the database.

## 🔄 Removing Admin Access

To remove admin access from a user:

1. Go to Supabase dashboard → Table Editor → profiles
2. Find the user
3. Edit their profile and set `role` to `'buyer'`, `'seller'`, or `'both'`
4. Save

The user will immediately lose admin access on their next request.




