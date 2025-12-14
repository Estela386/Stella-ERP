import { redirect } from "next/navigation";
import { createClient } from "@utils/supabase/server";
import { logout } from "@auth/actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <section className="flex justify-between mt-5">
        <h1 className="text-[#7c5c4a] justify-center text-3xl font-serif">
          Bienvenido {user.email}
        </h1>
        <button
          className="bg-red-500 rounded-full p-3 hover:bg-red-600 cursor-pointer"
          onClick={logout}
        >
          Cerrar sesión
        </button>
      </section>
    </>
  );
}
