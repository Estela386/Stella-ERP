import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard"];
  const adminOnlyRoutes = ["/dashboard/inicio/inventarios"];

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAdminRoute = adminOnlyRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: cookies => {
            cookies.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
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

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
