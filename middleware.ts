import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/dashboard/inicio",
    "/dashboard/cliente/perfil",
    "/dashboard/cliente/pedidos",
    "/dashboard/cliente/mayoreo",
  ];
  const adminOnlyRoutes = ["/dashboard/inicio/inventarios"];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminOnlyRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // 1. Creamos la respuesta inicial
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: cookiesToSet => {
            // 2. Actualizamos la request PARA QUE EL SERVIDOR VEA EL NUEVO TOKEN
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );

            // 3. Actualizamos la response original
            supabaseResponse = NextResponse.next({ request });

            // 4. Aplicamos las cookies a la response para el navegador
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAdminRoute) {
      const { data: userData } = await supabase
        .from("usuario")
        .select("id_rol")
        .eq("id_auth", user.id)
        .single();

      if (!userData || userData.id_rol !== 1) {
        return NextResponse.redirect(
          new URL("/dashboard/cliente", request.url)
        );
      }
    }

    // Retornamos la respuesta de supabase, no NextResponse.next() directamente
    return supabaseResponse;
  }

  return NextResponse.next();
}

// Opcional pero muy recomendado: Evitar que el middleware corra en archivos estáticos
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
