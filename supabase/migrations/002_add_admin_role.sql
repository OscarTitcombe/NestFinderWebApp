-- Migration: Add admin role support
-- This migration adds 'admin' to the role enum and prevents users from self-assigning admin role

-- Step 1: Drop the existing CHECK constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Step 2: Add the new CHECK constraint that includes 'admin'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('buyer', 'seller', 'both', 'admin'));

-- Step 3: Create a function to check if user is admin (for use in policies)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Update the profile update policy to prevent users from setting their role to 'admin'
-- Drop the existing policy
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policy that prevents role escalation to admin
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (
      -- Users can update their profile, but NOT set role to 'admin'
      (role IS NULL OR role != 'admin')
      OR
      -- If they're already admin, they can keep it (but this shouldn't happen via client)
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- Step 5: Add admin policies for viewing all data
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins can view all buyer requests
CREATE POLICY "Admins can view all buyer requests"
  ON public.buyer_requests FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins can update/delete any buyer request
CREATE POLICY "Admins can update any buyer request"
  ON public.buyer_requests FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete any buyer request"
  ON public.buyer_requests FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Admins can view all seller properties
CREATE POLICY "Admins can view all seller properties"
  ON public.seller_properties FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins can update/delete any seller property
CREATE POLICY "Admins can update any seller property"
  ON public.seller_properties FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete any seller property"
  ON public.seller_properties FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Admins can view all contacts
CREATE POLICY "Admins can view all contacts"
  ON public.contacts FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins can update/delete any contact
CREATE POLICY "Admins can update any contact"
  ON public.contacts FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete any contact"
  ON public.contacts FOR DELETE
  USING (public.is_admin(auth.uid()));



