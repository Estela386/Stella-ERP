import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#e5d3c2] py-6 px-8 flex flex-col md:flex-row justify-between items-center text-[#7c5c4a] text-sm mt-8">
      <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
        <div className="flex gap-2 mb-2">
          <a href="#">
            <Image
              src="/icon-instagram.svg"
              alt="Instagram"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </a>
          <a href="#">
            <Image
              src="/icon-youtube.svg"
              alt="YouTube"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </a>
          <a href="#">
            <Image
              src="/icon-linkedin.svg"
              alt="LinkedIn"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          </a>
        </div>
        <Image
          src="/logo.svg"
          alt="Stella Logo"
          width={32}
          height={32}
          className="h-8 w-8"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          <div className="font-semibold mb-1">Explorar</div>
          <div className="flex flex-col gap-1">
            <a href="#">Aretes</a>
            <a href="#">Anillos</a>
            <a href="#">Collares</a>
            <a href="#">Pulseras</a>
            <a href="#">Colecciones</a>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-1">Ayuda</div>
          <div className="flex flex-col gap-1">
            <a href="#">Política de envío</a>
            <a href="#">Preguntas frecuentes</a>
            <a href="#">Contacto</a>
            <a href="#">Lista de espera</a>
          </div>
        </div>
        <div>
          <div className="font-semibold mb-1">Sobre Stella Joyería</div>
          <div className="flex flex-col gap-1">
            <a href="#">¿Quiénes somos?</a>
            <a href="#">Inicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
