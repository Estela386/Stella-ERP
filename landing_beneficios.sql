-- Crear tabla para beneficios de la landing
CREATE TABLE IF NOT EXISTS public.landing_beneficios (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo text NOT NULL,
  subtitulo text,
  icono text, -- Nombre del icono de Lucide
  color text, -- Color hex
  activo boolean DEFAULT true,
  orden integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.landing_beneficios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública de beneficios" ON public.landing_beneficios FOR SELECT USING (true);

-- Insertar datos iniciales
INSERT INTO public.landing_beneficios (titulo, subtitulo, icono, color, orden)
VALUES 
('Sorteo Gratis', 'Sin costo de entrada', 'Crown', '#b76e79', 1),
('Diseños Únicos', '100% Artesanales', 'Sparkles', '#8c9768', 2),
('Envío Incluido', 'A todo México', 'Truck', '#708090', 3),
('Seguridad', 'Datos protegidos', 'ShieldCheck', '#b76e79', 4)
ON CONFLICT DO NOTHING;
