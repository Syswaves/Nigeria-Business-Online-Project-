-- Supabase Schema for Nigeria Business Online

-- Create the businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  "logoUrl" TEXT,
  "rcNumber" TEXT NOT NULL,
  category TEXT NOT NULL,
  services TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  "createdAt" BIGINT DEFAULT (extract(epoch from now()) * 1000)
);

-- Enable Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public directory)
CREATE POLICY "Allow public read access" 
  ON businesses FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access" 
  ON businesses FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow admin update access" 
  ON businesses FOR UPDATE 
  USING (true); -- In a real app, restrict this to admin users

CREATE POLICY "Allow admin delete access" 
  ON businesses FOR DELETE 
  USING (true); -- In a real app, restrict this to admin users

-- Insert initial mock data
INSERT INTO businesses (name, "logoUrl", "rcNumber", category, services, phone, location, email, website)
VALUES 
('TechNova Solutions', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop', 'RC123456', 'Information Technology', 'Software Development, Cloud Hosting, IT Consulting', '08012345678', '12, Tech Avenue, Victoria Island, Lagos', 'contact@technova.com.ng', 'https://technova.com.ng'),
('GreenFields Agro-Allied', 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?w=100&h=100&fit=crop', 'RC789012', 'Agriculture', 'Crop Production, Livestock Farming, Agro-processing', '08098765432', 'Plot 5, Industrial Estate, Kano', 'info@greenfields.com.ng', 'https://greenfields.com.ng'),
('Zenith Logistics & Supply', 'https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?w=100&h=100&fit=crop', 'RC345678', 'Logistics', 'Freight Forwarding, Supply Chain Management, Warehousing', '07011223344', '2A, Airport Road, Ikeja, Lagos', 'support@zenithlogistics.ng', NULL);
