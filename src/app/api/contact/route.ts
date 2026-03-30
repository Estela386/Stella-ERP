import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limit simple en memoria (por IP)
const requests = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    const now = Date.now();
    const lastRequest = requests.get(ip) || 0;

    // 1 solicitud cada 60 segundos
    if (now - lastRequest < 60000) {
      return NextResponse.json(
        { error: "Espera antes de enviar otra solicitud" },
        { status: 429 }
      );
    }

    requests.set(ip, now);

    const { name, phone, email, businessType, location, message } = await req.json();

    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // temporal
      to: "anarmc94@gmail.com",
      subject: "Nueva solicitud - Stella",
      html: `
        <h2>Nueva solicitud de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Ubicación:</strong> ${location}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tipo:</strong> ${businessType}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("Email enviado:", response);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error enviando correo" },
      { status: 500 }
    );
  }
}
