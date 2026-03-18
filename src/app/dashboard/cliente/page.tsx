"use client";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import HeroSection from "./_components/HeroSection";
import ProductGrid from "./_components/ProductGrid";
import ReviewsSection from "./_components/ReviewsSection";
import Footer from "@auth/_components/Footer";
import { useAuth } from "@/lib/hooks/useAuth";
import ChatbotPage from "@/app/chatbot/page";
export default function ClientDashboard() {
  const { usuario } = useAuth();
  return (
    <div className="min-h-screen bg-white">
      <HeaderClient user={usuario} />
      <ChatbotPage />
      <HeroSection />
      <ProductGrid />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
