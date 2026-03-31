"use client";

import { useState } from "react";
import { Handshake, TrendingUp, Percent, Send } from "lucide-react";
import { toast } from "sonner";

interface WholesaleSectionProps {
  usuarioId?: number | null;
}

export default function WholesaleSection({ usuarioId }: WholesaleSectionProps = {}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    businessType: "consignacion",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return; // evita doble click

    setLoading(true);

    try {
      // 1) Enviar correo de notificación (flujo existente)
      const emailRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const emailData = await emailRes.json();
      if (!emailRes.ok) throw new Error(emailData.error || "Error al enviar correo");

      // 2) Crear solicitud en el módulo de consignaciones (solo si hay usuario autenticado)
      if (usuarioId) {
        const mensaje = [
          `Ubicación: ${formData.location}`,
          `Tel: ${formData.phone}`,
          `Esquema: ${formData.businessType}`,
          formData.message ? `Negocio: ${formData.name} — ${formData.message}` : `Negocio: ${formData.name}`,
        ]
          .filter(Boolean)
          .join(" | ");

        await fetch("/api/solicitudes-mayorista", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_usuario: usuarioId,
            mensaje,
          }),
        });
        // No bloqueamos el flujo si esta llamada falla — el correo ya se envió
      }

      setSubmitted(true);
      toast.success("Solicitud enviada correctamente 💎");
    } catch (error: any) {
      toast.error("Error al enviar la solicitud. Intenta de nuevo más tarde.");
      console.error("Error en WholesaleSection:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-24 mb-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#708090] mb-4">
          Únete como <span className="text-[#b76e79]">Mayorista</span>
        </h2>
        <p className="text-[#708090]/80 max-w-2xl mx-auto text-sm md:text-base">
          Crece tu negocio junto a Stella Joyería. Ofrecemos beneficios exclusivos
          diseñados para maximizar tu rentabilidad y el éxito de tu emprendimiento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Información y Beneficios */}
        <div className="space-y-8">
          <div
            className="
            bg-white rounded-2xl p-8
            shadow-[0_15px_40px_rgba(140,151,104,0.08)]
            border border-[#708090]/10
          "
          >
            <h3 className="text-2xl font-bold text-[#708090] mb-6">
              ¿Por qué vender Stella?
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#b76e79]/10 flex items-center justify-center">
                  <Percent className="text-[#b76e79]" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#708090] text-lg">
                    Margen de Ganancia
                  </h4>
                  <p className="text-[#708090]/80 text-sm mt-1">
                    Obtén un 25% de descuento fijo en todas tus compras desde el primer pedido.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#b76e79]/10 flex items-center justify-center">
                  <Handshake className="text-[#b76e79]" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#708090] text-lg">
                    Inventario Inteligente
                  </h4>
                  <p className="text-[#708090]/80 text-sm mt-1">
                    Acceso a nuestro modelo de consignación para mayoristas consolidados en ZMG.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#b76e79]/10 flex items-center justify-center">
                  <TrendingUp className="text-[#b76e79]" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#708090] text-lg">
                    Exclusividad
                  </h4>
                  <p className="text-[#708090]/80 text-sm mt-1">
                    Piezas de edición limitada y colecciones de autor que no encontrarás en otros lados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div
          className="
          bg-white rounded-2xl p-8 md:p-10
          shadow-[0_15px_40px_rgba(140,151,104,0.12)]
          border border-[#708090]/20
        "
        >
          <h3 className="text-2xl font-bold text-[#708090] mb-2">
            Aplica Ahora
          </h3>
          <p className="text-[#708090]/70 text-sm mb-8">
            Déjanos tus datos y un asesor se pondrá en contacto contigo a la
            brevedad.
          </p>

          {submitted ? (
            <div className="bg-[#8c9768]/10 border border-[#8c9768]/30 rounded-xl p-6 text-center text-[#708090]">
              <div className="w-16 h-16 bg-[#8c9768] rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="text-white" size={24} />
              </div>
              <h4 className="font-bold text-lg mb-2">¡Solicitud Enviada!</h4>
              <p className="text-sm opacity-90">
                Gracias por tu interés en Stella Joyería. Pronto nos pondremos
                en contacto.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#708090] uppercase tracking-wide">
                    Nombre o Negocio
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-[#f6f4ef] border border-[#708090]/20 rounded-xl px-4 py-3 text-[#708090] text-sm focus:outline-none focus:border-[#b76e79]/50 focus:shadow-[0_0_0_3px_rgba(183,110,121,0.1)] transition-all"
                    placeholder="Ej. Boutique Luna"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#708090] uppercase tracking-wide">
                    Teléfono
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-[#f6f4ef] border border-[#708090]/20 rounded-xl px-4 py-3 text-[#708090] text-sm focus:outline-none focus:border-[#b76e79]/50 focus:shadow-[0_0_0_3px_rgba(183,110,121,0.1)] transition-all"
                    placeholder="Ej. 33 1234 5678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#708090] uppercase tracking-wide">
                    Correo Electrónico
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-[#f6f4ef] border border-[#708090]/20 rounded-xl px-4 py-3 text-[#708090] text-sm focus:outline-none focus:border-[#b76e79]/50 focus:shadow-[0_0_0_3px_rgba(183,110,121,0.1)] transition-all"
                    placeholder="tu@correo.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#708090] uppercase tracking-wide">
                    ¿Dónde vives? / Ciudad
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.location}
                    onChange={e =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-[#f6f4ef] border border-[#708090]/20 rounded-xl px-4 py-3 text-[#708090] text-sm focus:outline-none focus:border-[#b76e79]/50 focus:shadow-[0_0_0_3px_rgba(183,110,121,0.1)] transition-all"
                    placeholder="Ej. Guadalajara (ZMG)"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#708090] uppercase tracking-wide">
                  Esquema de Interés
                </label>
                <select
                  value={formData.businessType}
                  onChange={e =>
                    setFormData({ ...formData, businessType: e.target.value })
                  }
                  className="w-full bg-[#f6f4ef] border border-[#708090]/20 rounded-xl px-4 py-3 text-[#708090] text-sm focus:outline-none focus:border-[#b76e79]/50 focus:shadow-[0_0_0_3px_rgba(183,110,121,0.1)] transition-all appearance-none cursor-pointer"
                >
                  <option value="consignacion">Venta a Consignación</option>
                  <option value="mayoreo">
                    Compra de Mayoreo (Precios más bajos)
                  </option>
                  <option value="ambos">Me interesan ambos modelos</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#708090] uppercase tracking-wide">
                  Mensaje o Detalles Adicionales
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-[#f6f4ef] border border-[#708090]/20 rounded-xl px-4 py-3 text-[#708090] text-sm focus:outline-none focus:border-[#b76e79]/50 focus:shadow-[0_0_0_3px_rgba(183,110,121,0.1)] transition-all resize-none"
                  placeholder="Cuéntanos un poco sobre tu negocio o cómo planeas vender..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#b76e79] text-[#f6f4ef] font-bold py-3.5 rounded-xl disabled:opacity-50 transition-colors hover:bg-[#a05d68]"
              >
                {loading ? "Enviando..." : "Solicitar Información"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
