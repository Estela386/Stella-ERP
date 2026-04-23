import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // Configurar web-push con las llaves VAPID
    webpush.setVapidDetails(
      "mailto:notificaciones@stellajoyeria.online",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );
    const payload = await req.json();

    // El payload de Supabase Webhook contiene la fila insertada en 'record'
    const notificacion = payload.record;

    if (!notificacion || notificacion.tipo !== "stock_resurtido") {
      return NextResponse.json({ message: "Ignorado: tipo no soportado" });
    }

    // 1. Obtener información del usuario y del producto
    const { data: userData, error: userError } = await supabase
      .from("usuario")
      .select("nombre, correo")
      .eq("id", notificacion.id_usuario)
      .single();

    if (userError || !userData?.correo) {
      console.error("Error al obtener correo del usuario:", userError);
      return NextResponse.json(
        { error: "Usuario no encontrado o sin correo" },
        { status: 404 }
      );
    }

    // 2. Enviar el correo con Resend
    const { error: resendError } = await resend.emails.send({
      from: "Stella Joyería <notificaciones@stellajoyeria.online>", // Usa tu dominio verificado
      to: [userData.correo],
      subject: "¡Tu joya favorita vuelve a estar disponible! 💎",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #B76E79; text-align: center;">¡Hola, ${userData.nombre}!</h2>
          <p style="font-size: 16px; color: #4a4a4a; line-height: 1.6;">
            Tenemos excelentes noticias para ti. El producto que estabas esperando en <strong>Stella Joyería</strong> ya está disponible nuevamente en nuestra colección.
          </p>
          <div style="background-color: #FFF0F2; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #B76E79;">
              ${notificacion.mensaje}
            </p>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/productos/${notificacion.referencia_id}" 
               style="background-color: #B76E79; color: white; padding: 15px 25px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
              Ver Producto Ahora
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            Has recibido este correo porque te suscribiste a una notificación de stock en Stella Joyería.<br/>
            © 2026 Stella Joyería. Todos los derechos reservados.
          </p>
        </div>
      `,
    });

    if (resendError) {
      console.error("Error de Resend:", resendError);
    }

    // 3. Enviar notificaciones Push del navegador
    const { data: pushSubs } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("id_usuario", notificacion.id_usuario);

    if (pushSubs && pushSubs.length > 0) {
      const pushPayload = JSON.stringify({
        title: "¡Ya hay stock! 💎",
        body: notificacion.mensaje,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/productos/${notificacion.referencia_id}`,
      });

      // Enviar a todas las suscripciones del usuario (varios navegadores)
      const pushPromises = pushSubs.map(sub =>
        webpush
          .sendNotification(sub.subscription as any, pushPayload)
          .catch((err: any) => {
            console.error("Error al enviar push:", err);
            // Si la suscripción ya no es válida (410 Gone), deberíamos borrarla
            if (err.statusCode === 410 || err.statusCode === 404) {
              return supabase
                .from("push_subscriptions")
                .delete()
                .eq("subscription", sub.subscription);
            }
          })
      );

      await Promise.all(pushPromises);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en webhook de notificaciones:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
