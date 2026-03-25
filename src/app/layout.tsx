import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Manrope } from "next/font/google";
import { CartProvider } from "@lib/context/CartContext";
import "./globals.css";

// ── Serif elegante — Títulos, Branding, Logo ──────────────────
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// ── Sans-serif primaria — UI, ERP, Formularios ─────────────────
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// ── Sans-serif expresiva — Subtítulos, Botones, Badges ─────────
const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stella ERP",
  description: "ERP orientado a venta de joyería",
};

import ChatbotPage from "./chatbot/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} ${manrope.variable} antialiased bg-[#f6f4ef] text-[#708090]`}
      >
        <CartProvider>
          {children}
        </CartProvider>
        <ChatbotPage />
      </body>
    </html>
  );
}
