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

-- Create the services table
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public to see services (for booking)
CREATE POLICY "Anyone can see services" ON services
  FOR SELECT USING (true);

-- Allow admins to manage services
CREATE POLICY "Admins can manage services" ON services
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default services
INSERT INTO services (id, name, description, price, duration) VALUES
('primera-vez', 'Consulta Nutricional', 'Primera vez', 40000, '1 hora'),
('control', 'Consulta Nutricional', 'Control y seguimiento', 30000, '30 min'),
('antropometria', 'Antropometría', 'Evaluación física completa', 50000, '1 hora'),
('completa-primera', 'Consulta + Antropometría', 'Abordaje integral inicial', 50000, '2 horas'),
('completa-control', 'Consulta + Antropometría', 'Control integral', 40000, '45 min');

-- ==========================================
-- TABLA DE PACIENTES (EXPEDIENTE CLÍNICO)
-- ==========================================

CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  birth_date DATE,
  occupation TEXT,
  physical_activity TEXT,
  consultation_reason TEXT,
  objectives TEXT,
  
  -- Datos Médicos (JSONB para flexibilidad)
  -- Incluye: diseases, medications, supplements, family_history, treatment_history
  medical_data JSONB DEFAULT '{
    "diseases": {},
    "med_supp_text": "",
    "family_history": {}
  }'::jsonb,

  -- Evaluación Alimentaria y Hábitos
  -- Incluye: hydration, sleep, active_life, exclude_foods, habits_frequency, intestinal_habits
  nutritional_evaluation JSONB DEFAULT '{
    "hydration": "",
    "sleep": "",
    "active_life": "",
    "habits": {}
  }'::jsonb,

  -- Recordatorio 24 Horas
  -- Incluye: typical_day {desayuno, almuerzo, merienda, cena}, weekend_text
  recall_24h JSONB DEFAULT '{
    "typical_day": {},
    "weekend_text": ""
  }'::jsonb,

  -- Datos Antropométricos Históricos
  -- Incluye: weight, height, usual_weight, max_weight, min_weight, waist, hips
  anthropometric_data JSONB DEFAULT '{}'::jsonb,

  -- Bloques de Texto para Laboratorio y Notas
  lab_results_text TEXT,
  current_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Seguridad RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Solo los administradores pueden ver y gestionar fichas de pacientes
CREATE POLICY "Admins can manage all patients" ON patients
  FOR ALL USING (auth.role() = 'authenticated');

