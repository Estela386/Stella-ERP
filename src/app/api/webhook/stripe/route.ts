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
          `👤 [Webhook] Datos recibidos - idUsuario: ${idUsuario}, clienteId: ${clienteId}`
        );

        // 1. Parseo seguro y protegido de items
        let items;
        try {
          items = JSON.parse(itemsJson) as Array<{
            id_producto: number;
            cantidad: number;
            personalizacion?: Record<number, any> | null;
          }>;
          console.log(
            `📦 [Webhook] JSON de items parseado correctamente. Cantidad: ${items.length}`
          );
        } catch (parseErr) {
          throw new Error(`Error parseando el JSON de items: ${itemsJson}`);
        }

        // 2. Parseo REAL a números para evitar errores de base de datos
        const clienteIdNum = parseInt(clienteId, 10);
        const idUsuarioNum = parseInt(idUsuario, 10);

        if (isNaN(clienteIdNum) || isNaN(idUsuarioNum)) {
          throw new Error(
            `IDs inválidos tras parseo. clienteIdNum: ${clienteIdNum}, idUsuarioNum: ${idUsuarioNum}`
          );
        }

        console.log("🔌 [Webhook] Inicializando cliente de Supabase...");

        // ⚠️ ADVERTENCIA DE SEGURIDAD RLS ⚠️
        // Si este cliente falla por permisos, deberás instanciar un cliente de "Service Role"
        // import { createClient } from "@supabase/supabase-js";
        // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        const supabase = await createClient();

        const ventaService = new VentaService(supabase);
        const loyaltyService = new LoyaltyService(supabase);

        const totalConIva = (session.amount_total || 0) / 100;
        console.log(`💰 [Webhook] Total calculado: $${totalConIva}`);

        console.log("📝 [Webhook] Intentando ejecutar ventaService.crear()...");
        const venta = await ventaService.crear(
          clienteIdNum,
          idUsuarioNum as unknown as string,
          items.map(i => ({
            id_producto: i.id_producto,
            cantidad: i.cantidad,
            personalizacion: i.personalizacion ?? null,
          })),
          new Date().toISOString(),
          totalConIva,
          session.payment_status === "paid" ? totalConIva : 0
        );

        console.log(
          `✅ [Webhook] Venta insertada en BD exitosamente. ID devuelto:`,
          venta?.ventaId
        );

        console.log("🎁 [Webhook] Intentando otorgar puntos de lealtad...");

        // 3. Se añade el AWAIT faltante para evitar que el proceso muera prematuramente
        await loyaltyService.otorgarPuntosPorCompra(
          idUsuarioNum,
          totalConIva,
          venta.ventaId || 0
        );
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
