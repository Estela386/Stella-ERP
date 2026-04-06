"use server";

import { createClient } from "@utils/supabase/server";
import HeaderClient from "./HeaderClient";
import { IUsuario } from "@/lib/models/Usuario";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let iUsuario: IUsuario | null = null;
  if (user) {
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id_usuario", user.id)
      .single();
      
    if (data) {
      iUsuario = data as IUsuario;
    }
  }

  return <HeaderClient user={iUsuario} />;
}
