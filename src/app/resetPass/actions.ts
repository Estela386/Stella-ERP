"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Envía un email de recuperación de contraseña
 */
export async function enviarEmailRecuperacion(email: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/nueva-contraseña`,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Error al enviar email",
      };
    }

    return {
      success: true,
      message: "Email enviado correctamente. Revisa tu bandeja de entrada.",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Error desconocido";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Intercambia el código por sesión (para recuperación de contraseña)
 */
export async function intercambiarCodigoPorSesion(code: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return {
        success: false,
        error: error.message || "No se pudo validar el código",
      };
    }

    return {
      success: true,
      message: "Sesión validada correctamente",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Error desconocido";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Actualiza la contraseña del usuario
 */
export async function actualizarContraseña(nuevaContraseña: string) {
  try {
    const supabase = await createClient();

    // Validar que la contraseña tenga al menos 8 caracteres
    if (nuevaContraseña.length < 8) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 8 caracteres",
      };
    }

    // Obtener la sesión actual del usuario
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error:
          "No hay sesión activa. Por favor, intenta de nuevo desde el email",
      };
    }

    // Actualizar la contraseña
    const { error } = await supabase.auth.updateUser({
      password: nuevaContraseña,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Error al actualizar la contraseña",
      };
    }

    return {
      success: true,
      message: "Contraseña actualizada correctamente",
    };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Error desconocido";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Verifica si el usuario tiene una sesión válida para reset
 * (Esto se usa después de hacer click en el link del email)
 */
export async function verificarSesionReset() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        hasSession: false,
        error: "Sesión no válida",
      };
    }

    return {
      hasSession: true,
      user: {
        email: user.email,
      },
    };
  } catch (err) {
    return {
      hasSession: false,
      error: "Error al verificar sesión",
    };
  }
}
