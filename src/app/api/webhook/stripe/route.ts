import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { VentaService } from "@/lib/services";
import { LoyaltyService } from "@/lib/services/LoyaltyService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  console.log("🔔 [Webhook] Recibiendo petición de Stripe...");

  if (!sig) {
    console.error("❌ [Webhook] Falta la firma de Stripe (stripe-signature).");
    return NextResponse.json({ error: "Falta firma" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log(
      `✅ [Webhook] Evento verificado: ${event.type} (ID: ${event.id})`
    );
  } catch (err: any) {
    console.error("❌ [Webhook] Error verificando firma:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`💳 [Webhook] Procesando sesión completada: ${session.id}`);
    console.log(`📊 [Webhook] Estado de pago: ${session.payment_status}`);

    if (
      session.payment_status === "paid" ||
      session.payment_status === "unpaid"
    ) {
      try {
        console.log("🔍 [Webhook] Extrayendo metadata...", session.metadata);

        if (!session.metadata || !session.metadata.items) {
          throw new Error(
            "La metadata de la sesión está vacía o no tiene la propiedad 'items'."
          );
        }

        const { idUsuario, clienteId, items: itemsJson } = session.metadata;
        console.log(
          `👤 [Webhook] Datos recibidos - UUID Usuario: ${idUsuario}, clienteId: ${clienteId}`
        );

        // 1. Parseo de items
        let items;
        try {
          items = JSON.parse(itemsJson) as Array<{
            id_producto: number;
            cantidad: number;
            personalizacion?: Record<number, any> | null;
          }>;
        } catch (parseErr) {
          throw new Error(`Error parseando el JSON de items: ${itemsJson}`);
        }

        const clienteIdNum = parseInt(clienteId, 10);
        if (isNaN(clienteIdNum)) {
          throw new Error(`ID de cliente inválido: ${clienteId}`);
        }

        const supabase = await createClient();

        // 🔥 NUEVO: Buscar el ID entero del usuario usando su UUID de auth
        let internalUserId = 0;

        if (idUsuario && idUsuario !== "0" && idUsuario !== "undefined") {
          const { data: usuarioDb, error: errUsuario } = await supabase
            .from("usuario")
            .select("id")
            .eq("id_auth", idUsuario)
            .single();

          if (usuarioDb) {
            internalUserId = usuarioDb.id;
            console.log(
              `✅ [Webhook] UUID resuelto al ID interno: ${internalUserId}`
            );
          } else {
            console.log(
              `⚠️ [Webhook] No se encontró un usuario interno para el UUID: ${idUsuario}`
            );
          }
        }

        const ventaService = new VentaService(supabase);
        const loyaltyService = new LoyaltyService(supabase);

        const totalConIva = (session.amount_total || 0) / 100;

        console.log("📝 [Webhook] Creando la venta...");
        const venta = await ventaService.crear(
          clienteIdNum,
          internalUserId > 0 ? internalUserId : null, // ID interno o nulo si es invitado
          items.map(i => ({
            id_producto: i.id_producto,
            cantidad: i.cantidad,
            personalizacion: i.personalizacion ?? null,
          })),
          new Date().toISOString(),
          totalConIva,
          session.payment_status === "paid" ? totalConIva : 0
        );

        // 🔥 Otorgar puntos solo si tenemos un ID de usuario interno válido
        if (internalUserId > 0) {
          console.log("🎁 [Webhook] Intentando otorgar puntos de lealtad...");
          await loyaltyService.otorgarPuntosPorCompra(
            internalUserId,
            totalConIva,
            venta.ventaId || 0
          );
        }
        console.log("✅ [Webhook] Puntos otorgados y guardados exitosamente.");
      } catch (err: any) {
        // Log detallado del error real
        console.error(
          "❌ [Webhook] ERROR CRÍTICO procesando la venta:",
          err.message
        );
        console.error(err); // Esto imprimirá el stack trace completo de Supabase si falla

        return NextResponse.json(
          { error: "Error procesando pago en servidor", details: err.message },
          { status: 500 }
        );
      }
    } else {
      console.log(
        `⚠️ [Webhook] Sesión ignorada porque payment_status es: ${session.payment_status}`
      );
    }
  } else {
    console.log(`ℹ️ [Webhook] Evento recibido pero no manejado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

export const dynamic = "force-dynamic";
