import Header from "@/(auth)/_components/Header";
import Footer from "@/(auth)/_components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8eedc]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="Stella Logo"
            width={96}
            height={96}
            className="h-24 w-24 mb-2"
          />
          <h1 className="font-serif text-5xl text-[#7c5c4a] mb-2">404</h1>
          <p className="text-[#7c5c4a] text-lg mb-4">Página no encontrada</p>
          <Link
            href="/"
            className="mt-2 px-6 py-2 rounded bg-[#b97a7a] text-white hover:bg-[#a05e5e] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
