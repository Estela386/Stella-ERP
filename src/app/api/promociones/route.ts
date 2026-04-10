import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  validarCodigo,
  registrarUsoCodigo,
  getCodigosUsuario,
  getPromociones,
  createPromocion,
  createPromoCode,
  getMetricasCodigos,
} from "@/lib/services/PromocionService";
import type { CreatePromocionDTO, CreatePromoCodeDTO } from "@/lib/models/Promocion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getUsuarioInfo(req: NextRequest): Promise<{ id: number; rol: number } | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return null;
  const { data } = await supabase
    .from("usuario")
    .select("id, id_rol")
    .eq("id_auth", user.id)
    .single();
  return data ? { id: data.id, rol: data.id_rol } : null;
}

export async function GET(req: NextRequest) {
  const usuario = await getUsuarioInfo(req);
  if (!usuario) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const vista = searchParams.get("vista") ?? "mis_codigos";

  if (vista === "mis_codigos") {
    const codigos = await getCodigosUsuario(usuario.id);
    return NextResponse.json({ codigos });
  }

  if (vista === "lista" && usuario.rol === 1) {
    const promociones = await getPromociones();
    return NextResponse.json({ promociones });
  }

  if (vista === "metricas" && usuario.rol === 1) {
    const metricas = await getMetricasCodigos();
    return NextResponse.json({ metricas });
  }

  return NextResponse.json({ error: "Vista no válida" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const usuario = await getUsuarioInfo(req);
  if (!usuario) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { accion } = body as { accion: string };

  // Validar código (cualquier usuario autenticado)
  if (accion === "validar") {
    const { codigo, monto_compra, descuento_activo } = body as {
      codigo: string;
      monto_compra?: number;
      descuento_activo?: number;
    };
    const resultado = await validarCodigo(
      codigo,
      usuario.id,
      monto_compra ?? 0,
      descuento_activo ?? 0
    );
    return NextResponse.json({ resultado });
  }

  // Registrar uso de código (marcar como usado)
  if (accion === "aplicar") {
    const { id_promo_code } = body as { id_promo_code: number };
    const ok = await registrarUsoCodigo(id_promo_code, usuario.id);
    return NextResponse.json({ exito: ok });
  }

  // ADMIN: crear promoción
  if (accion === "crear_promocion" && usuario.rol === 1) {
    const { promocion } = body as { promocion: CreatePromocionDTO };
    const nueva = await createPromocion(promocion);
    if (!nueva) return NextResponse.json({ error: "Error al crear promoción" }, { status: 500 });
    return NextResponse.json({ promocion: nueva });
  }

  // ADMIN: crear código promo
  if (accion === "crear_codigo" && usuario.rol === 1) {
    const { codigo } = body as { codigo: CreatePromoCodeDTO };
    const nuevo = await createPromoCode(codigo);
    if (!nuevo) return NextResponse.json({ error: "Código duplicado o inválido" }, { status: 400 });
    return NextResponse.json({ codigo: nuevo });
  }

  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}
