
import React from "react";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8eedc]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Stella Logo" className="h-26 w-26 mb-2" />
        </div>
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
