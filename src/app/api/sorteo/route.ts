import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import { SorteoService } from "@lib/services/SorteoService";

// Helper para verificar si es admin
async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false, supabase: null };
  
  const { data: usuario } = await supabase
    .from("usuario")
    .select("id_rol")
    .eq("correo", user.email)
    .single();
    
  return { isAdmin: usuario?.id_rol === 1, supabase };
}

// GET — Listar sorteos con métricas
export async function GET() {
  const { isAdmin, supabase } = await checkAdmin();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    // Consulta compleja para traer sorteo + conteo de participantes
    const { data, error } = await supabase
      .from("sorteos")
      .select(`
        *,
        participantes:sorteo_participantes(count)
      `)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Mapear para limpiar el formato del count de participantes
    const sorteos = data.map(s => ({
      ...s,
      num_participantes: s.participantes?.[0]?.count || 0
    }));

    return NextResponse.json({ sorteos });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST — Crear sorteo + generar campana_banner automáticamente
export async function POST(req: NextRequest) {
  const { isAdmin, supabase } = await checkAdmin();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { nombre, descripcion, premio, fecha_inicio, fecha_fin, activo } = body;

    // 1. Crear el banner automáticamente con una imagen elegante por defecto
    const { data: banner, error: errorBanner } = await supabase
      .from("campana_banner")
      .insert([{
        titulo: nombre,
        subtitulo: descripcion || premio,
        tipo_promocion: "sorteo",
        fecha_inicio,
        fecha_fin,
        activo,
        url_imagen: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop", // Imagen de joyería elegante
        cta_texto: "Participar ahora",
        cta_href: "/productos"
      }])
      .select()
      .single();

    if (errorBanner) return NextResponse.json({ error: "Error al crear banner: " + errorBanner.message }, { status: 500 });

    // 2. Crear el sorteo vinculado al banner
    const { data: sorteo, error: errorSorteo } = await supabase
      .from("sorteos")
      .insert([{
        nombre,
        descripcion,
        premio,
        fecha_inicio,
        fecha_fin,
        activo,
        id_banner: banner.id
      }])
      .select()
      .single();

    if (errorSorteo) return NextResponse.json({ error: "Error al crear sorteo: " + errorSorteo.message }, { status: 500 });

    return NextResponse.json({ sorteo });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH — Actualizar sorteo
export async function PATCH(req: NextRequest) {
  const { isAdmin, supabase } = await checkAdmin();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { id, id_banner, ...rest } = body;

    // Actualizar el sorteo
    const { data: sorteo, error: errorSorteo } = await supabase
      .from("sorteos")
      .update(rest)
      .eq("id", id)
      .select()
      .single();

    if (errorSorteo) return NextResponse.json({ error: errorSorteo.message }, { status: 500 });

    // Si tiene un banner vinculado, actualizarlo también
    if (id_banner) {
      await supabase
        .from("campana_banner")
        .update({
          titulo: rest.nombre,
          subtitulo: rest.descripcion || rest.premio,
          fecha_inicio: rest.fecha_inicio,
          fecha_fin: rest.fecha_fin,
          activo: rest.activo
        })
        .eq("id", id_banner);
    }

    return NextResponse.json({ sorteo });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
