"use client";

import { Suspense } from "react";
import HeaderClient          from "@/app/(auth)/_components/HeaderClient";
import HeroSection           from "./_components/HeroSection";            // <-- RECUPERAMOS EL VIEJO HERO INMERSIVO
import TrustStrip            from "./_components/TrustStrip";             // Garantías
import CategoriesSection     from "./_components/CategoriesSection";      // Más de catálogo (Filtros)
import ProductCenterCarousel from "./_components/ProductCenterCarousel";  // Carrusel central destacado
import QuoteSimple           from "./_components/QuoteSimple";            // Conexión de marca (Slogan Beige)
import BestSellersSection    from "./_components/BestSellersSection";     // Prueba social (Lo más vendido)
import AlternatingCollections from "./_components/AlternatingCollections"; // Editorial + Productos
import ReviewsSection        from "./_components/ReviewsSection";         // Confianza final
import NewsletterSection     from "./_components/NewsletterSection";      // Lead capture
import Footer                from "@auth/_components/Footer";
import { useAuth }           from "@/lib/hooks/useAuth";


export default function ClientDashboard() {
  const { usuario } = useAuth();

  return (
    <div style={{ background: "#f6f4ef", minHeight: "100vh" }}>
      {/* 1. NAVEGACIÓN */}
      <Suspense fallback={<div style={{ height: 60 }} />}>
        <HeaderClient user={usuario} />
      </Suspense>



      {/* 2. ATRACCIÓN: El Hero inmersivo que más te gustaba */}
      <HeroSection />

      {/* 3. CONFIANZA INMEDIATA: Garantías en barra oscura */}
      <TrustStrip />

      {/* 4. EXPLORACIÓN: Categorías para el que quiere buscar a detalle */}
      <CategoriesSection />

      {/* 5. CONEXIÓN DE MARCA: El slogan y estética beige */}
      <QuoteSimple />

      {/* 6. PRODUCTO ESTRELLA: Carrusel central grande */}
      <ProductCenterCarousel />

      {/* 8. CATÁLOGO EDITORIAL: Muestra colecciones con fotos + productos vinculados (NUEVO) */}
      <AlternatingCollections />

      {/* 10. VALIDACIÓN SOCIAL: Lo más vendido */}
      <BestSellersSection />

      {/* 11. VALIDACIÓN FINAL: Reseñas */}
      <ReviewsSection />

      {/* 12. RETENCIÓN: Newsletter para los que llegaron al final */}
      <NewsletterSection />

      <Footer />
    </div>
  );
}
