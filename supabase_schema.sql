-- Create the appointments table
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  modality TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'cancelado'))
);

-- Set up Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public booking)
CREATE POLICY "Anyone can insert appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to see all appointments (admin)
CREATE POLICY "Authenticated users can see all appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update appointments (admin)
CREATE POLICY "Authenticated users can update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow anyone to see time slots (for checking availability)
CREATE POLICY "Anyone can see time and date of appointments" ON appointments
  FOR SELECT USING (true);
