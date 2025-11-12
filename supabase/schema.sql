-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location-based queries (optional, for future use)
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('buyer', 'seller', 'both')) DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Buyer Requests table
CREATE TABLE IF NOT EXISTS public.buyer_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  budget_min INTEGER NOT NULL CHECK (budget_min > 0),
  budget_max INTEGER NOT NULL CHECK (budget_max >= budget_min),
  beds_min INTEGER NOT NULL CHECK (beds_min > 0),
  beds_max INTEGER CHECK (beds_max >= beds_min),
  property_type TEXT NOT NULL CHECK (property_type IN ('flat', 'house', 'maisonette', 'bungalow', 'other', 'any')),
  postcode_districts TEXT[] NOT NULL, -- Array of postcode districts (e.g., ['SW1A', 'SW1B'])
  description TEXT NOT NULL,
  email TEXT NOT NULL, -- Contact email (can be different from auth email)
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'fulfilled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE -- Optional expiration date
);

-- Seller Properties table (from quiz)
CREATE TABLE IF NOT EXISTS public.seller_properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  postcode_district TEXT NOT NULL, -- Normalized postcode district
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'flat', 'bungalow', 'any', 'other')),
  expected_price_min INTEGER CHECK (expected_price_min > 0),
  expected_price_max INTEGER CHECK (expected_price_max >= expected_price_min),
  bedrooms INTEGER CHECK (bedrooms > 0),
  timeframe TEXT CHECK (timeframe IN ('immediately', '1-3-months', '3-6-months', '6-12-months', 'just-browsing')),
  features TEXT[], -- Array of features (e.g., ['garden', 'parking', 'transport'])
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'sold', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Messages/Contacts table (for seller-to-buyer communication)
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  buyer_request_id UUID REFERENCES public.buyer_requests(id) ON DELETE CASCADE NOT NULL,
  seller_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(seller_id, buyer_request_id) -- Prevent duplicate contacts
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_buyer_requests_user_id ON public.buyer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_postcode_districts ON public.buyer_requests USING GIN(postcode_districts);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_status ON public.buyer_requests(status);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_created_at ON public.buyer_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_seller_properties_user_id ON public.seller_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_properties_postcode_district ON public.seller_properties(postcode_district);
CREATE INDEX IF NOT EXISTS idx_seller_properties_status ON public.seller_properties(status);

CREATE INDEX IF NOT EXISTS idx_contacts_seller_id ON public.contacts(seller_id);
CREATE INDEX IF NOT EXISTS idx_contacts_buyer_request_id ON public.contacts(buyer_request_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buyer_requests_updated_at BEFORE UPDATE ON public.buyer_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seller_properties_updated_at BEFORE UPDATE ON public.seller_properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

