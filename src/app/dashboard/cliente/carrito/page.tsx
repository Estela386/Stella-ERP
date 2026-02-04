import React from "react";
import Header from "@auth/_components/Header";
import Footer from "@auth/_components/Footer";
import CartView from "../_components/CartView";

export default function CartPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <CartView />
      </main>

      <Footer />
    </div>
  );
}
