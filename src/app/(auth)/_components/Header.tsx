"use server";
import React from "react";
import Image from "next/image";
import { createClient } from "@utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const supabase = await createClient();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Solo redirigir a login si estamos en rutas protegidas
  const isProtectedRoute = pathname.startsWith("/dashboard");
  if (!user && isProtectedRoute) {
    redirect("/login");
  }

  return <HeaderClient user={user} />;
}
