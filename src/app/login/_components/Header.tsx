import React from "react";

export default function Header() {
  return (
    <header className="w-full bg-[#d6c1b1] flex items-center justify-between px-8 py-3">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Stella Logo" className="h-16" />
      </div>
      <nav className="flex gap-4">
        <a className="px-2 py-1 rounded bg-[#e5d3c2] text-[#7c5c4a] font-semibold" href="#">Inicio</a>
        <a className="px-2 py-1 rounded hover:bg-[#e5d3c2]" href="#">Catálogo</a>
        <a className="px-2 py-1 rounded hover:bg-[#e5d3c2]" href="#">Reseñas</a>
        <a className="px-2 py-1 rounded hover:bg-[#e5d3c2]" href="#">Contacto</a>
        <a className="px-2 py-1 rounded hover:bg-[#e5d3c2]" href="#">Redes</a>
      </nav>
      <div className="flex gap-2">
        <button className="px-4 py-1 rounded border border-[#7c5c4a] text-[#7c5c4a] bg-white">Log in</button>
        <button className="px-4 py-1 rounded bg-[#b97a7a] text-white">Registro</button>
      </div>
    </header>
  );
}
