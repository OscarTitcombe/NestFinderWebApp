# Contact System Setup Guide

## Overview

The contact system has been redesigned to save contact form submissions from the "Contact Us" page directly into the database and display them in a dedicated section in the admin dashboard.

## What Was Changed

### 1. Database Migration
**File:** `supabase/migrations/20241201_create_contact_submissions.sql`

Created a new `contact_submissions` table with the following structure:
- `id` - UUID primary key
- `name` - Contact's name
- `email` - Contact's email
- `message` - Contact's message
- `status` - Status: 'new', 'in_progress', 'resolved', or 'archived'
- `admin_notes` - Internal notes for admins (optional)
- `created_at` - Timestamp when submitted
- `updated_at` - Timestamp of last update
- `resolved_at` - Timestamp when marked as resolved (optional)

**Row Level Security (RLS) Policies:**
- Public can insert (submit contact forms)
- Only admins can read, update, and delete submissions

### 2. API Routes

#### Public API Route
**File:** `app/api/contact-submit/route.ts`

- Handles POST requests from the contact form
- Validates input using Zod schema
- Saves submissions to `contact_submissions` table
- Returns success or error response

#### Admin API Route
**File:** `app/api/admin/contact-submissions/route.ts`

- GET: Fetch all contact submissions (admin only)
- PATCH: Update submission status and admin notes (admin only)
- DELETE: Delete a submission (admin only)

### 3. Admin Query Functions
**File:** `lib/supabase/admin-queries.ts`

Added three new functions:
- `adminGetAllContactSubmissions()` - Fetch all submissions
- `adminUpdateContactSubmission()` - Update a submission
- `adminDeleteContactSubmission()` - Delete a submission

Updated `adminGetStats()` to include contact submission counts.

### 4. Database Types
**File:** `lib/types/database.ts`

Added TypeScript types for the `contact_submissions` table:
- Row type (read operations)
- Insert type (create operations)
- Update type (update operations)

### 5. Contact Page
**File:** `app/contact/page.tsx`

Updated the contact form submission handler:
- Now calls `/api/contact-submit` API
- Saves submissions to database
- Shows success/error messages
- No longer uses simulated API calls

### 6. Admin Dashboard
**File:** `app/admin/page.tsx`

Added a new "Contact Forms" tab with:
- Stats card showing total submissions and new count
- List view of all submissions with filtering
- Search functionality (name, email, message)
- Status filter (new, in progress, resolved, archived)
- Detail panel showing full submission information
- Status update dropdown
- Admin notes text area (auto-saves on blur)
- Delete functionality with confirmation dialog
- Visual indicators for new submissions
- Responsive layout for mobile and desktop

## Setup Instructions

### 1. Run the Database Migration

You need to apply the migration to your Supabase database:

**Option A: Using Supabase CLI (Recommended)**
```bash
npx supabase db push
```

**Option B: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Open the file: `supabase/migrations/20241201_create_contact_submissions.sql`
4. Copy its contents and run in the SQL Editor

### 2. Verify the Migration

Check that the table was created:
```sql
SELECT * FROM contact_submissions LIMIT 1;
```

### 3. Test the System

1. **Test Public Form Submission:**
   - Visit `/contact` page
   - Fill out the contact form
   - Submit and verify success message
   
2. **Test Admin Dashboard:**
   - Log in as an admin user
   - Visit `/admin` page
   - Click on "Contact Forms" tab
   - Verify you can see the submission
   - Test status updates
   - Test admin notes
   - Test search and filtering

## Features

### Public-Facing Features
- **No account required** - Anyone can submit the contact form
- Clean, validated contact form with Zod validation
- **Rate limiting** - 3 submissions per 15 minutes per IP address
- Real-time validation feedback
- Success/error feedback with specific messages
- Character counter for message field
- Clear messaging that no sign-in is needed

### Admin Features
- View all contact submissions
- Filter by status (new, in progress, resolved, archived)
- Search by name, email, or message content
- Click to view full details
- Update status with dropdown
- Add internal admin notes (auto-saves on blur)
- **Reply via email** - Opens email client with pre-filled response
- Delete submissions with confirmation
- Visual indicators for new submissions
- Responsive design for all screen sizes
- Automatic status update to "in progress" when replying

## Status Workflow

Recommended workflow for handling submissions:

1. **New** → Submission just received
2. **In Progress** → Admin is working on it (automatically set when clicking "Reply via Email")
3. **Resolved** → Issue handled (automatically sets `resolved_at` timestamp)
4. **Archived** → No longer needed in active view

## Email Reply Feature

The admin dashboard includes a "Reply via Email" button that:

1. Opens your default email client (Gmail, Outlook, Apple Mail, etc.)
2. Pre-fills the recipient with the contact's email address
3. Includes a professional subject line: "Re: Your message to NestFinder"
4. Quotes the original message for context
5. Automatically updates the submission status to "In Progress" (if it was "New")

**Example pre-filled email:**
```
To: contact@example.com
Subject: Re: Your message to NestFinder

Hi John Doe,

Thank you for contacting us.

---
Original message:
I have a question about your service...
```

You can then customize the message before sending from your email client.

## Security Notes

- **Anonymous submissions allowed** - Public users can INSERT without authentication
- **Rate limiting active** - 3 submissions per 15 minutes per IP address
- Only authenticated admin users can read, update, or delete
- All admin operations verify admin status server-side
- Input validation with Zod prevents malicious data
- Uses anonymous Supabase client for public submissions
- RLS policies enforce all security rules at database level

## Next Steps (Optional Enhancements)

1. **Email Notifications:** Send email to admin when new submission arrives
2. **Enhanced Rate Limiting:** Use Redis (Upstash) for distributed rate limiting across multiple servers
3. **Email Templates:** Create predefined response templates
4. **Analytics:** Track response times and resolution rates
5. **Categories:** Add category field for different types of inquiries
6. **Attachments:** Allow file uploads with submissions
7. **Export:** Add ability to export submissions to CSV
8. **Bulk Actions:** Select multiple submissions for bulk status updates

## Troubleshooting

### "Failed to fetch contact submissions" Error
- Verify migration ran successfully
- Check that your user has admin role in `profiles` table
- Check browser console for detailed error messages

### Contact Form Not Submitting
- Check browser console for errors
- Verify API route is accessible at `/api/contact-submit`
- Check Supabase connection and RLS policies
- Verify environment variables are set correctly

### "Rate limit exceeded" Error
- This is normal security behavior
- Users are limited to 3 submissions per 15 minutes
- Wait 15 minutes and try again
- Rate limits reset automatically
- For testing, restart your dev server to clear in-memory rate limits

### Email Reply Button Not Working
- Ensure you have a default email client configured
- Check that the contact's email address is valid
- Some browsers may block the `mailto:` link - try a different browser
- Mobile devices should prompt to choose an email app

### Admin Dashboard Not Loading
- Verify you're logged in
- Verify your user has `role = 'admin'` in profiles table
- Check all API routes are accessible

## Database Query Examples

### Check contact submissions:
```sql
SELECT * FROM contact_submissions ORDER BY created_at DESC;
```

### Count by status:
```sql
SELECT status, COUNT(*) 
FROM contact_submissions 
GROUP BY status;
```

### Find unresolved submissions:
```sql
SELECT * FROM contact_submissions 
WHERE status IN ('new', 'in_progress')
ORDER BY created_at DESC;
```

---

**Created:** December 1, 2024
**System Version:** 1.0

