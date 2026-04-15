import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// GET — Retorna la campaña activa actual (pública, sin auth)
export async function GET() {
  const supabase = getSupabase();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("campana_banner")
    .select("*")
    .eq("activo", true)
    .lte("fecha_inicio", now)
    .gte("fecha_fin", now)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ campana: null, error: error.message });
  }

  return NextResponse.json({ campana: data });
}

// Helper para verificar si es admin
async function isAdmin(req: NextRequest): Promise<boolean> {
  const supabase = getSupabase();
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "");
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return false;
  const { data } = await supabase
    .from("usuario")
    .select("id_rol")
    .eq("id_auth", user.id)
    .single();
  return data?.id_rol === 1;
}

// POST — Crear campaña (admin)
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabase();
  const body = await req.json();
  const { data, error } = await supabase
    .from("campana_banner")
    .insert([body])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campana: data });
}

// PATCH — Actualizar campaña (admin)
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabase();
  const body = await req.json();
  const { id, ...rest } = body;

  const { data, error } = await supabase
    .from("campana_banner")
    .update(rest)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campana: data });
}

// DELETE — Eliminar campaña (admin)
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { error } = await supabase
    .from("campana_banner")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
