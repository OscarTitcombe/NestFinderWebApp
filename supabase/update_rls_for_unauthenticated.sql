-- Update RLS policies to allow unauthenticated users to create buyer requests
-- This allows non-authenticated users to submit buyer briefs (they'll verify email later)

-- Drop the existing INSERT policy that requires authentication
DROP POLICY IF EXISTS "Users can create own buyer requests" ON public.buyer_requests;

-- Create a new INSERT policy that allows:
-- 1. Authenticated users to create requests with their user_id
-- 2. Unauthenticated users to create requests with user_id = null
CREATE POLICY "Users can create buyer requests (authenticated or unauthenticated)"
  ON public.buyer_requests FOR INSERT
  WITH CHECK (
    -- Authenticated users: user_id must match their auth.uid()
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR
    -- Unauthenticated users: user_id must be null
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Note: The SELECT policy "Anyone can view active buyer requests" already allows
-- anyone (including unauthenticated users) to view active requests, so no change needed there.

-- Note: The SELECT policy "Users can view own buyer requests" will only work for
-- authenticated users, which is fine - unauthenticated users need to verify their
-- email and sign in before they can view their own requests.

