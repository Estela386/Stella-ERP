"use client";

import { useRouter } from "next/navigation";

export default function ClientFooter() {
  const router = useRouter();

  const footerSections = [
    {
      title: "Explorar",
      links: [
        { label: "Inicio", href: "/dashboard/cliente" },
        { label: "Catálogo", href: "/dashboard/cliente/catalogo" },
        { label: "Reseñas", href: "/dashboard/cliente/resenas" },
        { label: "Contacto", href: "/dashboard/cliente/contacto" },
      ],
    },
    {
      title: "Ayuda",
      links: [
        { label: "Política de envíos", href: "#" },
        { label: "Devoluciones", href: "#" },
        { label: "Preguntas frecuentes", href: "#" },
        { label: "Lista de espera", href: "#" },
      ],
    },
    {
      title: "Sobre Stella-Ayarela",
      links: [
        { label: "Nosotros", href: "#" },
        { label: "Ofertas especiales", href: "#" },
        { label: "Política privada", href: "#" },
        { label: "Términos y condiciones", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-2xl font-light">Stella</span>
            </div>
            <p className="text-gray-400 text-sm">
              Joyería artesanal de calidad con diseños exclusivos y elegantes.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="text-lg">𝕏</span>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="text-lg">f</span>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="text-lg">📷</span>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <span className="text-lg">in</span>
              </button>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h4 className="font-medium mb-4 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.label}>
                    <button
                      onClick={() => router.push(link.href)}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Stella. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <button className="text-gray-400 hover:text-white text-sm transition-colors">
                Política privada
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de uso
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors">
                Configuración de cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
