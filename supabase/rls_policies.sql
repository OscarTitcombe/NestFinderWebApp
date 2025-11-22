-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but good to have)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Buyer Requests policies
-- Anyone can view active buyer requests (for sellers browsing)
CREATE POLICY "Anyone can view active buyer requests"
  ON public.buyer_requests FOR SELECT
  USING (status = 'active');

-- Users can view their own buyer requests (all statuses)
CREATE POLICY "Users can view own buyer requests"
  ON public.buyer_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own buyer requests
CREATE POLICY "Users can create own buyer requests"
  ON public.buyer_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own buyer requests
CREATE POLICY "Users can update own buyer requests"
  ON public.buyer_requests FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own buyer requests
CREATE POLICY "Users can delete own buyer requests"
  ON public.buyer_requests FOR DELETE
  USING (auth.uid() = user_id);

-- Seller Properties policies
-- Anyone can view active seller properties (for buyers browsing)
CREATE POLICY "Anyone can view active seller properties"
  ON public.seller_properties FOR SELECT
  USING (status = 'active');

-- Users can view their own seller properties (all statuses)
CREATE POLICY "Users can view own seller properties"
  ON public.seller_properties FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own seller properties
CREATE POLICY "Users can create own seller properties"
  ON public.seller_properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own seller properties
CREATE POLICY "Users can update own seller properties"
  ON public.seller_properties FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own seller properties
CREATE POLICY "Users can delete own seller properties"
  ON public.seller_properties FOR DELETE
  USING (auth.uid() = user_id);

-- Contacts policies
-- Sellers can view contacts they've made
CREATE POLICY "Sellers can view own contacts"
  ON public.contacts FOR SELECT
  USING (auth.uid() = seller_id);

-- Sellers can create contacts (send messages to buyers)
CREATE POLICY "Sellers can create contacts"
  ON public.contacts FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own contacts (e.g., mark as read)
CREATE POLICY "Sellers can update own contacts"
  ON public.contacts FOR UPDATE
  USING (auth.uid() = seller_id);

-- Buyers can view contacts made to their requests (but not seller email directly)
-- Note: We'll need to handle this carefully - buyers should see they received a message
-- but seller email should be relayed through the system
CREATE POLICY "Buyers can view contacts to their requests"
  ON public.contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.buyer_requests
      WHERE buyer_requests.id = contacts.buyer_request_id
      AND buyer_requests.user_id = auth.uid()
    )
  );




