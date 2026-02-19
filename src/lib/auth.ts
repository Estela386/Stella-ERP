/**
 * Utilidades de autenticación para servidor
 * Proporciona funciones para verificar roles y usuarios en el lado del servidor
 */

import { createClient } from "@utils/supabase/server";
import { Usuario, IUsuario } from "@lib/models";

/**
 * Obtiene el usuario autenticado actualmente en el servidor
 */
export async function obtenerUsuarioAutenticado(): Promise<{
  usuario: Usuario | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return { usuario: null, error: authError?.message || "No autenticado" };
    }

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (userError) {
      return { usuario: null, error: userError.message };
    }

    return { usuario: new Usuario(userData as IUsuario), error: null };
  } catch (error) {
    return {
      usuario: null,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Verifica si el usuario actual tiene un rol específico
 */
export async function verificarRol(rolRequerido: number): Promise<boolean> {
  const { usuario } = await obtenerUsuarioAutenticado();
  return usuario ? usuario.tieneRol(rolRequerido) : false;
}

/**
 * Verifica si el usuario actual es administrador (rol 1)
 */
export async function esAdmin(): Promise<boolean> {
  return verificarRol(1);
}
