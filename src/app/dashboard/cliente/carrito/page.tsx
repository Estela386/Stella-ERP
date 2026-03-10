"use client";
import HeaderClient from "@auth/_components/HeaderClient";
import Footer from "@auth/_components/Footer";
import CartView from "../_components/CartView";
import { useAuth } from "@/lib/hooks/useAuth";

export default function CartPage() {
  const { usuario } = useAuth();
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderClient user={usuario} />

      <main className="flex-grow">
        <CartView />
      </main>

      <Footer />
    </div>
  );
}
