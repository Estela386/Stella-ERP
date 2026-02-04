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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    redirect("/register?error=password_mismatch");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log(error);
    redirect("/register?error=signup_failed");
  }

  // Si tienes email confirmation activado:
  redirect("/login?success=check_email");
}
