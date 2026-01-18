import Header from "@/(auth)/_components/Header";
import HeroSection from "./_components/HeroSection";
import ProductGrid from "./_components/ProductGrid";
import ReviewsSection from "./_components/ReviewsSection";
import Footer from "@/(auth)/_components/Footer";
export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProductGrid />
      <ReviewsSection />
      <Footer />
    </div>
  );
}
