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
- Clean, validated contact form
- Real-time validation with Zod
- Success/error feedback
- Character counter for message field

### Admin Features
- View all contact submissions
- Filter by status (new, in progress, resolved, archived)
- Search by name, email, or message content
- Click to view full details
- Update status with dropdown
- Add internal admin notes
- Delete submissions
- Visual indicators for new submissions
- Responsive design for all screen sizes

## Status Workflow

Recommended workflow for handling submissions:

1. **New** → Submission just received
2. **In Progress** → Admin is working on it
3. **Resolved** → Issue handled (automatically sets `resolved_at` timestamp)
4. **Archived** → No longer needed in active view

## Security Notes

- Public users can only INSERT contact submissions
- Only authenticated admin users can read, update, or delete
- All admin operations verify admin status server-side
- Input validation with Zod prevents malicious data
- Rate limiting should be added to the public API route (future enhancement)

## Next Steps (Optional Enhancements)

1. **Email Notifications:** Send email to admin when new submission arrives
2. **Rate Limiting:** Add rate limiting to prevent spam
3. **Email Integration:** Reply to contacts directly from dashboard
4. **Analytics:** Track response times and resolution rates
5. **Categories:** Add category field for different types of inquiries
6. **Attachments:** Allow file uploads with submissions

## Troubleshooting

### "Failed to fetch contact submissions" Error
- Verify migration ran successfully
- Check that your user has admin role in `profiles` table
- Check browser console for detailed error messages

### Contact Form Not Submitting
- Check browser console for errors
- Verify API route is accessible
- Check Supabase connection and RLS policies

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

