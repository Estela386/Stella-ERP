import { NextResponse } from "next/server";
import { Resend } from "resend";

// Inicializamos Resend con la llave de tu .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, folio, cliente, total, productos } = body;

    if (!email || !folio) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Armamos el cuerpo del correo en HTML puro para asegurar compatibilidad
    // Manteniendo los colores y estilos de Stella Joyería
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f6f4ef; padding: 40px 20px; border-radius: 12px;">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4a5568; font-style: italic; margin: 0; font-size: 28px;">Stella Joyería</h1>
          <p style="color: #708090; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Recibo Digital</p>
        </div>

        <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid rgba(183,110,121,0.2);">
          <p style="color: #4a5568; font-size: 16px;">Hola <strong>${cliente}</strong>,</p>
          <p style="color: #708090; font-size: 15px; line-height: 1.5;">Gracias por tu compra. Aquí tienes el resumen de tu pedido <strong>#${folio}</strong>.</p>
          
          <table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #f6f4ef;">
                <th style="text-align: left; padding: 10px 0; color: #4a5568; font-size: 14px;">Producto</th>
                <th style="text-align: right; padding: 10px 0; color: #4a5568; font-size: 14px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productos
                .map(
                  (p: any) => `
                <tr style="border-bottom: 1px solid #f6f4ef;">
                  <td style="padding: 12px 0; color: #708090; font-size: 14px;">
                    ${p.cantidad}x ${p.nombre}
                  </td>
                  <td style="text-align: right; padding: 12px 0; color: #4a5568; font-weight: bold; font-size: 14px;">
                    $${(p.cantidad * p.precio).toFixed(2)}
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div style="margin-top: 25px; text-align: right; border-top: 2px solid #f6f4ef; padding-top: 15px;">
            <p style="margin: 0; color: #708090; font-size: 14px;">Total Pagado</p>
            <p style="margin: 5px 0 0 0; color: #b76e79; font-size: 24px; font-weight: bold;">$${total.toFixed(2)} MXN</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #708090; font-size: 13px;">¿Tienes alguna duda? Contáctanos respondiendo a este correo.</p>
          <p style="color: #b76e79; font-size: 12px; font-weight: bold; margin-top: 15px;">STELLA JOYERÍA ARTESANAL</p>
        </div>
      </div>
    `;

    const data = await resend.emails.send({
      from: "Stella Joyeria <ventas@stellajoyeria.online>",
      to: [email],
      subject: `Tu recibo de compra Stella Joyería #${folio}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error procesando email:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
