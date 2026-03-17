"use client";

import { useRouter } from "next/navigation";

export default function ClientFooter() {
  const router = useRouter();

  const footerSections = [
    {
      title: "Explorar",
      links: [
        { label: "Inicio",    href: "/dashboard/cliente" },                    // ✅ ya existe
        { label: "Catálogo",  href: "/dashboard/cliente/catalogo" },           // ✅ ya existe
        { label: "Reseñas",   href: "/dashboard/cliente/resenas" },            // TODO → cambia por tu ruta real de reseñas
        { label: "Contacto",  href: "/dashboard/cliente/contacto" },           // TODO → cambia por tu ruta real de contacto
      ],
    },
    {
      title: "Ayuda",
      links: [
        { label: "Política de envíos",    href: "#envios" },                   // TODO → ancla en página de ayuda
        { label: "Devoluciones",          href: "#devoluciones" },             // TODO → ancla en página de ayuda
        { label: "Preguntas frecuentes",  href: "#faq" },                      // TODO → ancla en página de ayuda
        { label: "Lista de espera",       href: "#lista-espera" },             // TODO → ancla en página de ayuda
      ],
    },
    {
      title: "Sobre Stella",
      links: [
        { label: "Nosotros",              href: "/dashboard/cliente/nosotros" }, // TODO → cambia por tu ruta real
        { label: "Ofertas especiales",    href: "/dashboard/cliente/ofertas" },  // TODO → cambia por tu ruta real
        { label: "Política privada",      href: "#privacidad" },                 // TODO → ancla o ruta real
        { label: "Términos y condiciones",href: "#terminos" },                   // TODO → ancla o ruta real
      ],
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .footer-link { transition: color 0.18s ease; }
        .footer-link:hover { color: rgba(246,244,239,0.92) !important; }
        .footer-social {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(246,244,239,0.15);
          background: transparent;
          color: rgba(246,244,239,0.45);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem;
          transition: all 0.2s ease;
        }
        .footer-social:hover {
          background: rgba(183,110,121,0.3) !important;
          border-color: rgba(183,110,121,0.5) !important;
          color: #f6f4ef !important;
          transform: translateY(-2px);
        }
        .footer-bottom-btn { transition: color 0.18s ease; }
        .footer-bottom-btn:hover { color: rgba(246,244,239,0.75) !important; }
      `}</style>

      <footer
        style={{
          background: "#3d4a5c",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "clamp(44px,5.5vw,68px) clamp(20px,5vw,52px) 0",
          }}
        >
          {/* ── Grid superior ── */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
            style={{ gap: "clamp(28px,4vw,52px)", paddingBottom: 48 }}
          >

            {/* Brand */}
            <div>
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(183,110,121,0.2)",
                    border: "1px solid rgba(183,110,121,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 600, color: "#b76e79", fontStyle: "italic" }}>
                    S
                  </span>
                </div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 400, color: "#f6f4ef", letterSpacing: "0.04em" }}>
                  Stella
                </span>
              </div>

              <p style={{ fontSize: "0.82rem", color: "rgba(246,244,239,0.5)", lineHeight: 1.75, maxWidth: 210, margin: "0 0 20px" }}>
                Joyería artesanal de calidad con diseños exclusivos y elegantes.
              </p>

              {/* Redes sociales */}
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { icon: "𝕏",  label: "Twitter" },
                  { icon: "f",  label: "Facebook" },
                  { icon: "◉",  label: "Instagram" },
                  { icon: "in", label: "LinkedIn" },
                ].map(({ icon, label }) => (
                  <button key={label} className="footer-social" title={label}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Columnas de links */}
            {footerSections.map(section => (
              <div key={section.title}>
                <h4
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.63rem",
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(246,244,239,0.55)",
                    margin: "0 0 18px",
                  }}
                >
                  {section.title}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                  {section.links.map(link => (
                    <li key={link.label}>
                      <button
                        onClick={() =>
                          link.href.startsWith("#")
                            ? document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" })
                            : router.push(link.href)
                        }
                        className="footer-link"
                        style={{
                          background: "none", border: "none", cursor: "pointer", padding: 0,
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.84rem",
                          color: "rgba(246,244,239,0.4)",
                          textAlign: "left",
                          display: "flex", alignItems: "center", gap: 6,
                        }}
                      >
                        {/* Chevron decorativo */}
                        <span style={{ color: "rgba(183,110,121,0.5)", fontSize: "0.6rem" }}>›</span>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(183,110,121,0.3), rgba(140,151,104,0.2), transparent)",
            }}
          />

          {/* ── Barra inferior ── */}
          <div
            className="flex flex-col md:flex-row justify-between items-center"
            style={{ padding: "20px 0", gap: 12 }}
          >
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.76rem", color: "rgba(246,244,239,0.28)", margin: 0 }}>
              © {new Date().getFullYear()} Stella-Ayarela. Todos los derechos reservados.
            </p>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { label: "Política privada",   href: "#privacidad" },   // TODO → cambia por tu ruta real
                { label: "Términos de uso",    href: "#terminos" },     // TODO → cambia por tu ruta real
                { label: "Cookies",            href: "#cookies" },      // TODO → cambia por tu ruta real
              ].map(({ label, href }) => (
                <button
                  key={label}
                  className="footer-bottom-btn"
                  onClick={() =>
                    href.startsWith("#")
                      ? document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
                      : router.push(href)
                  }
                  style={{
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.74rem",
                    color: "rgba(246,244,239,0.28)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}