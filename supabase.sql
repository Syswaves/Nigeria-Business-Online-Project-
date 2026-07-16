-- Supabase Schema for Nigeria Business Online

-- Create the businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  "logoUrl" TEXT,
  "rcNumber" TEXT NOT NULL,
  category TEXT NOT NULL,
  services TEXT,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  whatsapp TEXT,
  "facebookUrl" TEXT,
  "instagramUrl" TEXT,
  "twitterUrl" TEXT,
  "linkedinUrl" TEXT,
  "promoPhoto1Url" TEXT,
  "promoPhoto2Url" TEXT,
  "promoVideoUrl" TEXT,
  "certificateOfIncorporationUrl" TEXT,
  "companyProfileUrl" TEXT,
  verified BOOLEAN DEFAULT false,
  "createdAt" BIGINT NOT NULL
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Drop policies first to avoid "already exists" errors
DROP POLICY IF EXISTS "Allow public read access" ON public.businesses;
DROP POLICY IF EXISTS "Allow service role full access" ON public.businesses;
DROP POLICY IF EXISTS "Allow admin update access" ON public.businesses;
DROP POLICY IF EXISTS "Allow admin delete access" ON public.businesses;
DROP POLICY IF EXISTS "Allow admin update access" ON businesses;
DROP POLICY IF EXISTS "Allow admin delete access" ON businesses;

-- Allow public read access (so your frontend can fetch businesses)
CREATE POLICY "Allow public read access"
  ON public.businesses
  FOR SELECT
  TO public
  USING (true);

-- Allow service role to have full access (used by your Node.js backend)
CREATE POLICY "Allow service role full access"
  ON public.businesses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow admin update access" 
  ON public.businesses FOR UPDATE 
  USING (true); -- In a real app, restrict this to admin users

CREATE POLICY "Allow admin delete access" 
  ON public.businesses FOR DELETE 
  USING (true); -- In a real app, restrict this to admin users

-- Insert initial mock data (Only run if you need the data and the table is empty)
-- INSERT INTO public.businesses (name, "logoUrl", "rcNumber", category, services, phone, location, email, website, "createdAt")
-- VALUES 
-- ('TechNova Solutions', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop', 'RC123456', 'Information Technology', 'Software Development, Cloud Hosting, IT Consulting', '08012345678', '12, Tech Avenue, Victoria Island, Lagos', 'contact@technova.com.ng', 'https://technova.com.ng', (extract(epoch from now()) * 1000)),
-- ('GreenFields Agro-Allied', 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?w=100&h=100&fit=crop', 'RC789012', 'Agriculture', 'Crop Production, Livestock Farming, Agro-processing', '08098765432', 'Plot 5, Industrial Estate, Kano', 'info@greenfields.com.ng', 'https://greenfields.com.ng', (extract(epoch from now()) * 1000)),
-- ('Zenith Logistics & Supply', 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?w=100&h=100&fit=crop', 'RC345678', 'Logistics', 'Freight Forwarding, Supply Chain Management, Warehousing', '07011223344', '2A, Airport Road, Ikeja, Lagos', 'support@zenithlogistics.ng', NULL, (extract(epoch from now()) * 1000));
