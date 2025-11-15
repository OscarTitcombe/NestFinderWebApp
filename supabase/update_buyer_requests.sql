-- Update buyer_requests table to allow unauthenticated users
-- This migration makes user_id nullable so non-authenticated users can create buyer requests

-- Step 1: Make user_id nullable (drop NOT NULL constraint)
ALTER TABLE public.buyer_requests 
  ALTER COLUMN user_id DROP NOT NULL;

-- Step 2: Add a comment explaining the change
COMMENT ON COLUMN public.buyer_requests.user_id IS 
  'User ID for authenticated users. NULL for unauthenticated users who need to verify their email.';

-- Step 3: Verify the change (optional - this will show the table structure)
-- You can run this separately to verify:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'buyer_requests' AND column_name = 'user_id';

