-- Tabla para almacenar los tokens de las notificaciones push del navegador
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario integer REFERENCES public.usuario(id),
  subscription jsonb NOT NULL, -- Almacena el objeto PushSubscription completo
  created_at timestamp with time zone DEFAULT now(),
  device_info text, -- Opcional: para saber desde qué dispositivo se suscribió
  UNIQUE(id_usuario, subscription)
);

-- Habilitar RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden gestionar sus propias suscripciones push"
ON public.push_subscriptions
FOR ALL
TO authenticated
USING (id_usuario IN (SELECT id FROM public.usuario WHERE id_auth = auth.uid()))
WITH CHECK (id_usuario IN (SELECT id FROM public.usuario WHERE id_auth = auth.uid()));
