import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutItem {
  id_producto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  url_imagen?: string;
  personalizacion?: Record<number, any>;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  idUsuario: string;
  clienteId: number;
  email: string; // ← necesario para crear el customer
  nombre: string; // ← para identificarlo en Stripe
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const { items, idUsuario, clienteId, email, nombre } = body;

    if (!items?.length || !idUsuario || !clienteId || !email) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // ── 1. Buscar o crear customer en Stripe ──────────────────────
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });

    const customer =
      existingCustomers.data.length > 0
        ? existingCustomers.data[0]
        : await stripe.customers.create({
            email,
            name: nombre,
            metadata: { idUsuario, clienteId: String(clienteId) },
          });

    // ── 2. Construir line_items ───────────────────────────────────
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      item => ({
        price_data: {
          currency: "mxn",
          product_data: {
            name: item.nombre,
            images: item.url_imagen ? [item.url_imagen] : [],
            description: item.personalizacion
              ? Object.entries(item.personalizacion)
                  .map(([, v]) => String(v))
                  .join(", ")
              : undefined,
          },
          unit_amount: Math.round(item.precio * 100),
        },
        quantity: item.cantidad,
      })
    );

    // ── 3. Crear sesión con tarjeta + transferencia ───────────────
    const session = await stripe.checkout.sessions.create({
      customer: customer.id, // ← requerido para customer_balance
      payment_method_types: ["card", "customer_balance"],
      payment_method_options: {
        customer_balance: {
          funding_type: "bank_transfer",
          bank_transfer: { type: "mx_bank_transfer" },
        },
      },
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/carrito/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrito`,
      metadata: {
        idUsuario,
        clienteId: String(clienteId),
        items: JSON.stringify(
          items.map(i => ({
            id_producto: i.id_producto,
            cantidad: i.cantidad,
            personalizacion: i.personalizacion ?? null,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creando sesión de Stripe:", err);
    return NextResponse.json(
      { error: "Error al iniciar el pago" },
      { status: 500 }
    );
  }
}
