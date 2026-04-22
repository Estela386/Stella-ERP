-- Crear tabla para suscripciones de stock
CREATE TABLE IF NOT EXISTS public.suscripciones_stock (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario integer REFERENCES public.usuario(id),
  id_producto integer REFERENCES public.producto(id),
  created_at timestamp with time zone DEFAULT now(),
  notificado boolean DEFAULT false,
  UNIQUE(id_usuario, id_producto, notificado)
);

-- Habilitar RLS (opcional pero recomendado)
ALTER TABLE public.suscripciones_stock ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver sus propias suscripciones
CREATE POLICY "Usuarios pueden ver sus propias suscripciones" 
ON public.suscripciones_stock 
FOR SELECT 
USING (auth.uid() IN (SELECT id_auth FROM public.usuario WHERE id = suscripciones_stock.id_usuario));

-- Política para que los usuarios puedan insertar sus propias suscripciones
CREATE POLICY "Usuarios pueden insertar sus propias suscripciones" 
ON public.suscripciones_stock 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT id_auth FROM public.usuario WHERE id = suscripciones_stock.id_usuario));
