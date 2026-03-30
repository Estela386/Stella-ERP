import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@utils/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Revertir rol a cliente (2) y limpiar flag de mayorista
    const { error } = await supabase
      .from("usuario")
      .update({ id_rol: 2, es_mayorista: false })
      .eq("id", idNum);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const idNum = parseInt(id);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const { activo, motivo } = await req.json();

    // 1) Obtener datos del usuario antes de actualizar
    const { data: usuario, error: fetchErr } = await supabase
      .from("usuario")
      .select("nombre, correo")
      .eq("id", idNum)
      .single();

    if (fetchErr || !usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // 2) Actualizar campo activo en Supabase
    const { error } = await supabase
      .from("usuario")
      .update({ activo })
      .eq("id", idNum);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // 3) Enviar email de notificación si se suspende
    if (!activo && usuario.correo) {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: usuario.correo,
        subject: "Tu cuenta de Mayorista ha sido suspendida — Stella Joyería",
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
            <div style="background:linear-gradient(135deg,#708090,#5a6a7a);padding:28px 32px">
              <h1 style="color:#fff;margin:0;font-size:1.3rem;font-weight:800">Stella Joyería</h1>
              <p style="color:rgba(255,255,255,0.75);margin:4px 0 0;font-size:0.85rem">Notificación de cuenta</p>
            </div>
            <div style="padding:28px 32px">
              <p style="font-size:1rem;font-weight:700;color:#1C1C1C;margin:0 0 8px">Hola, ${usuario.nombre ?? "Mayorista"}</p>
              <p style="font-size:0.9rem;color:#4a5568;line-height:1.6;margin:0 0 16px">
                Te informamos que tu cuenta de <strong>Mayorista</strong> en Stella Joyería ha sido <strong style="color:#ef4444">suspendida temporalmente</strong>.
              </p>
              ${motivo ? `
              <div style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:6px;padding:12px 16px;margin-bottom:16px">
                <p style="margin:0;font-size:0.85rem;color:#991b1b;font-weight:600">Motivo:</p>
                <p style="margin:4px 0 0;font-size:0.85rem;color:#7f1d1d">${motivo}</p>
              </div>` : ""}
              <p style="font-size:0.85rem;color:#4a5568;line-height:1.6;margin:0 0 20px">
                Si consideras que esto es un error o necesitas más información, por favor contáctanos respondiendo este correo.
              </p>
              <p style="font-size:0.82rem;color:#8C9796;margin:0">— Equipo Stella Joyería</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, activo });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

