-- =============================================
-- TURNERA SIMPLE - Schema para Supabase
-- Ejecutar en: Supabase > SQL Editor
-- =============================================

-- Crear la tabla de turnos
CREATE TABLE IF NOT EXISTS turns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE turns ENABLE ROW LEVEL SECURITY;

-- Cualquier persona puede insertar un turno (formulario público)
CREATE POLICY "Anyone can insert turns" ON turns
  FOR INSERT WITH CHECK (true);

-- Cualquier persona puede leer los turnos (el admin los ve con contraseña del lado del cliente)
CREATE POLICY "Anyone can read turns" ON turns
  FOR SELECT USING (true);

-- Cualquier persona puede eliminar turnos (para que el admin pueda borrar)
CREATE POLICY "Anyone can delete turns" ON turns
  FOR DELETE USING (true);
