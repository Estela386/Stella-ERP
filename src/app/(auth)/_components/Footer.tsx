import React from "react";
import Image from "next/image";
import { FaInstagram, FaYoutube, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-[#e5d3c2] py-12 px-8 md:px-12 text-[#7c5c4a]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Logo y Redes Sociales */}
        <div className="flex flex-col items-center gap-4">
          {/* Redes Sociales */}
          <div className="flex gap-3">
            <a href="#" className="hover:text-[#5c4a37] transition-colors">
              <FaXTwitter size={18} />
            </a>
            <a
              href="https://www.instagram.com/stellajoyeriar?igsh=dTQ5dWtnZ21ibXJt"
              className="hover:text-[#5c4a37] transition-colors"
              target="_blank"
            >
              <FaInstagram size={18} />
            </a>
            <a href="#" className="hover:text-[#5c4a37] transition-colors">
              <FaYoutube size={18} />
            </a>
            <a
              href="https://www.facebook.com/share/17iQQTmRbi/?mibextid=wwXIfr"
              className="hover:text-[#5c4a37] transition-colors"
              target="_blank"
            >
              <FaFacebook size={18} />
            </a>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-start gap-2">
            <Image
              src="/logo.png"
              alt="Stella Logo"
              width={96}
              height={96}
              className="h-36 w-36"
            />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-3 gap-12 md:gap-16">
          {/* Explorar */}
          <div>
            <h4 className="font-semibold mb-3">Explorar</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Aretes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Anillos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Collares
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Pulseras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Colecciones
                </a>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="font-semibold mb-3">Ayuda</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Política de envío
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Lista de espera
                </a>
              </li>
            </ul>
          </div>

          {/* Sobre */}
          <div>
            <h4 className="font-semibold mb-3">Sobre Stella Joyería</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  ¿Quiénes somos?
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#5c4a37] transition-colors">
                  Inicio
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
