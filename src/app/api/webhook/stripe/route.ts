import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { VentaService } from "@/lib/services";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Error verificando webhook:", err);
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Solo procesar si el pago fue exitoso o transferencia pendiente
    if (
      session.payment_status === "paid" ||
      session.payment_status === "unpaid"
    ) {
      try {
        const { idUsuario, clienteId, items: itemsJson } = session.metadata!;

        const items = JSON.parse(itemsJson) as Array<{
          id_producto: number;
          cantidad: number;
          personalizacion?: Record<number, any> | null;
        }>;

        const supabase = await createClient();
        const ventaService = new VentaService(supabase);

        const totalConIva = (session.amount_total || 0) / 100;

        await ventaService.crear(
          parseInt(clienteId),
          idUsuario,
          items.map(i => ({
            id_producto: i.id_producto,
            cantidad: i.cantidad,
            personalizacion: i.personalizacion ?? null,
          })),
          new Date().toISOString(),
          totalConIva,
          session.payment_status === "paid" ? totalConIva : 0
        );

        console.log("Venta creada desde webhook:", session.id);
      } catch (err) {
        console.error("Error creando venta desde webhook:", err);
        return NextResponse.json(
          { error: "Error procesando pago" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}

// Stripe necesita el body crudo, desactivar el bodyParser de Next
export const dynamic = "force-dynamic";
