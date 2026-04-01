import type { Metadata } from "next";
import { Poppins, Lora, Marcellus, Bodoni_Moda } from "next/font/google";
import { CartProvider } from "@lib/context/CartContext";
import { Toaster } from "sonner";
import "./styles/globals.css";
import ChatbotPage from "./chatbot/page";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const marcellus = Marcellus({
  subsets: ["latin"],
  variable: "--font-marcellus",
  weight: "400",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Stella ERP",
  description: "ERP orientado a venta de joyería",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${lora.variable} ${marcellus.variable} ${bodoni.variable}`}>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body
        className="antialiased bg-[#f6f4ef] text-[#708090]"
      >
        <CartProvider>
          {children}
          <ChatbotPage />
          <Toaster position="top-right" richColors />
        </CartProvider>
      </body>
    </html>
  );
}
