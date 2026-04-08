"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "@assets/logo.png";

const NAV = [
  {
    heading: "Explorar",
    links: [
      { label: "Aretes", href: "/dashboard/cliente/catalogo?categoria=aretes" },
      {
        label: "Anillos",
        href: "/dashboard/cliente/catalogo?categoria=anillos",
      },
      {
        label: "Collares",
        href: "/dashboard/cliente/catalogo?categoria=collares",
      },
      {
        label: "Pulseras",
        href: "/dashboard/cliente/catalogo?categoria=pulseras",
      },
      { label: "Colecciones", href: "/dashboard/cliente/catalogo" },
    ],
  },
  {
    heading: "Ayuda",
    links: [
      { label: "Política de envío", href: "/terminos" },
      { label: "Preguntas frecuentes", href: "/dashboard/cliente/faq" },
      { label: "Contacto", href: "/dashboard/cliente/nosotros" },
      { label: "Carrito", href: "/dashboard/cliente/carrito" },
    ],
  },
  {
    heading: "Sobre Stella Joyería",
    links: [
      { label: "¿Quiénes somos?", href: "/dashboard/cliente/nosotros" },
      { label: "Inicio", href: "/dashboard/cliente" },
      { label: "Catálogo", href: "/dashboard/cliente/catalogo" },
    ],
  },
];

const SOCIALS = [
  {
    icon: FaXTwitter,
    href: "#",
    label: "X / Twitter",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/stellajoyeriar?igsh=dTQ5dWtnZ21ibXJt",
    label: "Instagram",
    external: true,
  },
  {
    icon: FaYoutube,
    href: "#",
    label: "YouTube",
  },
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/share/17iQQTmRbi/?mibextid=wwXIfr",
    label: "Facebook",
    external: true,
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        
        .stella-footer { background: #3d4a5c; font-family: var(--font-sans), sans-serif; }

        .footer-link {
          color: rgba(246,244,239,0.52);
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 400;
          transition: color 0.18s ease, padding-left 0.18s ease;
          display: inline-block;
        }
        .footer-link:hover { color: #b76e79; padding-left: 3px; }

        .footer-social {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid rgba(246,244,239,0.14);
          background: rgba(246,244,239,0.06);
          color: rgba(246,244,239,0.5);
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .footer-social:hover {
          background: rgba(183,110,121,0.18);
          border-color: rgba(183,110,121,0.4);
          color: #b76e79;
          transform: translateY(-2px);
        }

        .footer-col-heading {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 0.95rem;
          font-weight: 600;
          font-style: italic;
          color: rgba(246,244,239,0.82);
          letter-spacing: 0.02em;
          margin-bottom: 14px;
        }

        .footer-divider {
          height: 1px;
          background: rgba(246,244,239,0.08);
          border: none;
          margin: 32px 0 20px;
        }

        .footer-brand-name {
          font-family: var(--font-serif, 'Cormorant Garamond', serif);
          font-size: 1.08rem;
          font-weight: 500;
          font-style: italic;
          color: rgba(246,244,239,0.7);
          letter-spacing: 0.06em;
        }
        .footer-copy {
          font-family: var(--font-sans), sans-serif;
          font-size: 0.72rem;
          color: rgba(246,244,239,0.28);
        }
        .footer-rose-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #b76e79; display: inline-block; margin: 0 8px; flex-shrink: 0;
        }
      `}</style>

      <footer
        className="stella-footer"
        style={{
          padding: "clamp(44px,5.5vw,68px) clamp(20px,5vw,52px) 32px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blob decorativo fondo */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "rgba(183,110,121,0.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -80,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(140,151,104,0.04)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          {/* Grid principal */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "clamp(32px,5vw,80px)",
              alignItems: "flex-start",
            }}
          >
            {/* ── Columna izquierda: Logo + redes ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                minWidth: 120,
              }}
            >
              <Link href="/dashboard/cliente">
                <Image
                  src={logo}
                  alt="Stella Joyería"
                  width={96}
                  height={96}
                  style={{
                    filter: "brightness(0) invert(1)",
                    opacity: 0.65,
                    width: "clamp(72px,8vw,96px)",
                    height: "auto",
                  }}
                />
              </Link>

              <p
                style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.78rem",
                  color: "rgba(246,244,239,0.38)",
                  lineHeight: 1.6,
                  maxWidth: 160,
                }}
              >
                Joyería artesanal hecha con amor y detalle.
              </p>

              {/* Redes sociales */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="footer-social"
                    target={s.external ? "_blank" : undefined}
                    rel={s.external ? "noopener noreferrer" : undefined}
                  >
                    <s.icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Columna derecha: Links ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "clamp(24px,3vw,48px)",
              }}
            >
              {NAV.map(col => (
                <div key={col.heading}>
                  <h4 className="footer-col-heading">{col.heading}</h4>
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {col.links.map(link => (
                      <li key={link.label}>
                        <Link href={link.href} className="footer-link">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── Divider + copyright ── */}
          <hr className="footer-divider" />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className="footer-brand-name">
                Stella Joyería Artesanal
              </span>
              <span className="footer-rose-dot" />
              <span className="footer-copy">
                © {new Date().getFullYear()} Todos los derechos reservados
              </span>
            </div>

            <div style={{ display: "flex", gap: 20 }}>
              <Link
                href="/terminos"
                className="footer-copy"
                style={{
                  color: "rgba(246,244,239,0.28)",
                  textDecoration: "none",
                  fontSize: "0.72rem",
                }}
              >
                Términos y condiciones
              </Link>
              <Link
                href="/dashboard/cliente/nosotros"
                className="footer-copy"
                style={{
                  color: "rgba(246,244,239,0.28)",
                  textDecoration: "none",
                  fontSize: "0.72rem",
                }}
              >
                Nosotros
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
