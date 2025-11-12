-- Additional RLS policy for buyers to update contact status (mark as read)
-- Run this after the main rls_policies.sql

-- Buyers can update contacts to their requests (to mark as read)
CREATE POLICY "Buyers can update contacts to their requests"
  ON public.contacts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.buyer_requests
      WHERE buyer_requests.id = contacts.buyer_request_id
      AND buyer_requests.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.buyer_requests
      WHERE buyer_requests.id = contacts.buyer_request_id
      AND buyer_requests.user_id = auth.uid()
    )
  );
