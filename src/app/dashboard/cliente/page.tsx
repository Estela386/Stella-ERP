"use client";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import HeroSection from "./_components/HeroSection";
import ProductGrid from "./_components/ProductGrid";
import ReviewsSection from "./_components/ReviewsSection";
import Footer from "@auth/_components/Footer";
import { useAuth } from "@/lib/hooks/useAuth";
export default function ClientDashboard() {
  const { usuario } = useAuth();
  console.log("user:", usuario);
  return (
    <div className="min-h-screen bg-white">
      <HeaderClient user={usuario} />
      <HeroSection />
      <ProductGrid />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
