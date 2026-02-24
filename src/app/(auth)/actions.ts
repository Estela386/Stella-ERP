"use server";

import { redirect } from "next/navigation";
import { createClient } from "@utils/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  console.log(email, password);
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=invalid_credentials");
  }

  redirect("/dashboard/cliente");
}
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function register(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    redirect("/register?error=password_mismatch");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.log(authError);
    redirect("/register?error=signup_failed");
  }

  // Insertar/actualizar el usuario en la tabla "usuario"
  if (authData.user) {
    const { error: dbError } = await supabase
      .from("usuario")
      .update({
        nombre: nombre,
      })
      .eq("id_auth", authData.user.id);

    if (dbError) {
      console.log("Error al actualizar usuario en tabla:", dbError);
    }
  }

  // Si tienes email confirmation activado:
  redirect("/login?success=check_email");
}
