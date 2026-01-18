"use client";

export default function HeroSection() {
  return (
    <section className="relative w-full h-96 md:h-[500px] bg-gradient-to-b from-[#e5d3c2] to-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#d6c1b1] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-[#e5d3c2] rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-light text-[#7c5c4a] mb-4">
            Joyería Artesanal
          </h1>
          <p className="text-lg text-[#7c5c4a] mb-8 max-w-2xl mx-auto">
            Descubre nuestra colección exclusiva de joyas elegantes y
            sofisticadas, diseñadas con los mejores materiales y detalles únicos
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-[#7c5c4a] text-white rounded-lg hover:bg-[#5c4a37] transition-colors font-medium">
              Ver Catálogo
            </button>
            <button className="px-8 py-3 border-2 border-[#7c5c4a] text-[#7c5c4a] rounded-lg hover:bg-[#e5d3c2] transition-colors font-medium">
              Conocer Más
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d6c1b1] to-transparent"></div>
    </section>
  );
}
