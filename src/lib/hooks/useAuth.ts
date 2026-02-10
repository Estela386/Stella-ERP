/**
 * Hook personalizado para obtener el usuario autenticado desde el lado del cliente
 * Proporciona acceso a la información del usuario y verifica los roles
 */

import { useEffect, useState } from "react";
import { createClient } from "@utils/supabase/client";
import { Usuario, IUsuario } from "@lib/models";

interface UseAuthResult {
  usuario: Usuario | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): UseAuthResult {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setError(authError?.message || "Usuario no autenticado");
          setUsuario(null);
          return;
        }

        // Obtener datos del usuario de la tabla usuarios
        const { data: userData, error: userError } = await supabase
          .from("usuario")
          .select("*")
          .eq("id_auth", authUser.id)
          .single();

        if (userError || !userData) {
          // Si no existe en la tabla usuarios, crear uno con rol por defecto (2 = cliente)
          const { data: newUser, error: createError } = await supabase
            .from("usuario")
            .insert([
              { id_auth: authUser.id, email: authUser.email, id_rol: 2 },
            ])
            .select()
            .single();

          if (createError) {
            setError(createError.message);
            return;
          }

          setUsuario(new Usuario(newUser as IUsuario));
        } else {
          setUsuario(new Usuario(userData as IUsuario));
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuario();
  }, []);

  return { usuario, loading, error };
}
