-- Migration: Make user_id nullable in buyer_requests table
-- This allows unauthenticated users to create buyer requests
-- They will need to verify their email to activate their account

-- Drop the NOT NULL constraint on user_id
ALTER TABLE public.buyer_requests 
  ALTER COLUMN user_id DROP NOT NULL;

-- Add a comment explaining the change
COMMENT ON COLUMN public.buyer_requests.user_id IS 
  'User ID for authenticated users. NULL for unauthenticated users who need to verify their email.';

