"use client";

import { useState, Suspense } from "react";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import ChatbotPage from "@/app/chatbot/page";
import { useAuth } from "@/lib/hooks/useAuth";

import FaqHero from "./_components/FaqHero";
import FaqCategories from "./_components/FaqCategories";
import FaqAccordion from "./_components/FaqAccordion";
import FaqLocation from "./_components/FaqLocation";
import FaqWholesale from "./_components/FaqWholesale";

import {
  Package,
  Sparkles,
  MapPin,
  Gem,
  Users,
  ShieldCheck,
  ChevronRight,
  Building2,
  Plane,
  Store,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Coins,
  Calendar,
  CreditCard,
  Smartphone,
  Instagram,
  Facebook,
  MessageSquare,
  PenTool,
  Ruler,
  Gift,
  Zap,
  Palette,
  Timer,
  Droplets,
  HardHat,
  Eye,
  CreditCard as CardIcon,
  Search,
} from "lucide-react";

import type { FaqCategory, FaqSection } from "./type";

// ── Componente para íconos en línea estilizados ───────────────────
const FaqInlineIcon = ({
  icon,
  color = "#b76e79",
}: {
  icon: React.ReactNode;
  color?: string;
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      borderRadius: 6,
      background:
        color === "#b76e79"
          ? "rgba(183,110,121,0.1)"
          : "rgba(112,128,144,0.08)",
      border: `1px solid ${color === "#b76e79" ? "rgba(183,110,121,0.2)" : "rgba(112,128,144,0.15)"}`,
      color: color,
      marginRight: 6,
      verticalAlign: "middle",
      transform: "translateY(-1px)",
    }}
  >
    <span style={{ transform: "scale(0.7)", display: "flex" }}>{icon}</span>
  </span>
);

// ────────────────────────────────────────────────────────────────
//  CONTENIDO FAQ
// ────────────────────────────────────────────────────────────────
const FAQ_SECTIONS: FaqSection[] = [
  // ── ENVÍOS ───────────────────────────────────────────────────
  {
    id: "envios",
    label: "Envíos",
    icon: <Package size={18} />,
    description: "Todo sobre tiempos de entrega y política de envío",
    items: [
      {
        id: "e1",
        category: "envios",
        question: "¿Cuánto tarda mi pedido en llegar?",
        answer: (
          <>
            Los tiempos de entrega varían según tu ubicación:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<Building2 size={18} />} />{" "}
                <strong>Guadalajara y ZMG:</strong> 1 – 2 días hábiles
              </li>
              <li>
                <FaqInlineIcon icon={<Plane size={18} />} />{" "}
                <strong>Interior de la República:</strong> 3 – 5 días hábiles
                (paquetería express)
              </li>
              <li>
                <FaqInlineIcon icon={<Store size={18} />} />{" "}
                <strong>Recoger en tienda:</strong> Disponible el mismo día si
                el artículo está en existencia
              </li>
            </ul>
            <br />
            Los pedidos realizados antes de las <strong>14:00 h</strong> se
            procesan el mismo día.
          </>
        ),
      },
      {
        id: "e2",
        category: "envios",
        question: "¿Hacen envíos a todo México?",
        answer: (
          <>
            Sí, enviamos a toda la República Mexicana a través de paquetería
            certificada.
            <br />
            <br />
            También contamos con{" "}
            <strong>
              envío a domicilio en Guadalajara y Zona Metropolitana
            </strong>{" "}
            para pedidos superiores a <strong>$800 MXN</strong>.
          </>
        ),
      },
      {
        id: "e3",
        category: "envios",
        question: "¿Cuánto cuesta el envío?",
        answer: (
          <>
            El costo de envío depende de la paquetería y destino:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<MapPin size={18} />} />{" "}
                <strong>ZMG (compra +$800 MXN):</strong>{" "}
                <span style={{ color: "#b76e79", fontWeight: 600 }}>
                  Gratis
                </span>
              </li>
              <li>
                <FaqInlineIcon icon={<MapPin size={18} />} />{" "}
                <strong>ZMG (compra -$800 MXN):</strong> $60 – $80 MXN
              </li>
              <li>
                <FaqInlineIcon icon={<Building2 size={18} />} />{" "}
                <strong>Nacional express:</strong> $120 – $180 MXN
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "e4",
        category: "envios",
        question: "¿Puedo rastrear mi pedido?",
        answer: (
          <>
            Sí. Una vez que tu pedido sea enviado, recibirás por WhatsApp o
            correo electrónico el <strong>número de guía</strong> para
            rastrearlo en tiempo real a través del sitio de la paquetería
            asignada.
          </>
        ),
      },
      {
        id: "e5",
        category: "envios",
        question: "¿Qué pasa si mi pedido llega dañado?",
        answer: (
          <>
            Si recibes un artículo dañado, contáctanos dentro de las{" "}
            <strong>24 horas</strong> de recibido con fotografías del empaque y
            la pieza. Gestionaremos un reemplazo o devolución sin costo
            adicional.
            <br />
            <br />
            Puedes escribirnos a nuestro Instagram:{" "}
            <strong>@stellajoyeriar</strong>
          </>
        ),
      },
    ],
  },

  // ── PERSONALIZADOS ──────────────────────────────────────────
  {
    id: "personalizados",
    label: "Personalizados",
    icon: <Sparkles size={18} />,
    description: "Pedidos a medida y joyería personalizada",
    items: [
      {
        id: "p1",
        category: "personalizados",
        question: "¿Qué tipo de personalizaciones ofrecen?",
        answer: (
          <>
            Podemos personalizar:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<PenTool size={18} />} />{" "}
                <strong>Grabado de nombres o iniciales</strong> en pulseras,
                dijes y anillos
              </li>
              <li>
                <FaqInlineIcon icon={<Gem size={18} />} />{" "}
                <strong>Elección de piedra o color</strong> (según diseño
                disponible)
              </li>
              <li>
                <FaqInlineIcon icon={<Ruler size={18} />} />{" "}
                <strong>Ajuste de talla</strong> en anillos y pulseras
              </li>
              <li>
                <FaqInlineIcon icon={<Gift size={18} />} />{" "}
                <strong>Empaque especial</strong> para regalo con mensaje
                personalizado
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "p2",
        category: "personalizados",
        question: "¿Cuánto tiempo tarda un pedido personalizado?",
        answer: (
          <>
            Los tiempos varían según la complejidad:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} />{" "}
                <strong>Grabado simple:</strong> 2 – 3 días hábiles adicionales
              </li>
              <li>
                <FaqInlineIcon icon={<Clock size={18} />} />{" "}
                <strong>Diseño complejo o ajuste de talla:</strong> 5 – 7 días
                hábiles
              </li>
              <li>
                <FaqInlineIcon icon={<Palette size={18} />} />{" "}
                <strong>Pieza completamente personalizada:</strong> 10 – 15 días
                hábiles
              </li>
            </ul>
            <br />
            Te mantendremos informado durante todo el proceso de fabricación.
          </>
        ),
      },
      {
        id: "p3",
        category: "personalizados",
        question: "¿Tienen costo extra los pedidos personalizados?",
        answer: (
          <>
            Depende del tipo de personalización:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} />{" "}
                <strong>Mensaje de regalo:</strong> Sin costo
              </li>
              <li>
                <FaqInlineIcon icon={<Coins size={18} />} />{" "}
                <strong>Grabado de texto:</strong> Desde $80 MXN
              </li>
              <li>
                <FaqInlineIcon icon={<Coins size={18} />} />{" "}
                <strong>Ajuste de talla:</strong> $50 – $150 MXN según la pieza
              </li>
              <li>
                <FaqInlineIcon icon={<Coins size={18} />} />{" "}
                <strong>Diseño único:</strong> Cotización personalizada
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "p4",
        category: "personalizados",
        question: "¿Puedo cancelar o modificar un pedido personalizado?",
        answer: (
          <>
            Los pedidos personalizados pueden modificarse{" "}
            <strong>únicamente en las primeras 24 horas</strong> tras la
            confirmación del pago. Una vez iniciada la producción, no es posible
            realizarchangios. Por eso siempre confirmamos los detalles contigo
            antes de comenzar.
          </>
        ),
      },
    ],
  },

  // ── UBICACIÓN ───────────────────────────────────────────────
  {
    id: "ubicacion",
    label: "Ubicación",
    icon: <MapPin size={18} />,
    description: "Dónde encontrarnos y horarios de atención",
    items: [
      {
        id: "u1",
        category: "ubicacion",
        question: "¿Dónde está la tienda física de Stella?",
        answer: (
          <>
            Nos encontramos en:
            <br />
            <br />
            <FaqInlineIcon icon={<MapPin size={18} />} />{" "}
            <strong>
              C. Agustín de Iturbide 578, Santa Teresita, 44200 Guadalajara,
              Jalisco
            </strong>
            <br />
            <br />
            Puedes visitarnos durante nuestros horarios de atención o agendar
            una cita para atención personalizada.
          </>
        ),
      },
      {
        id: "u2",
        category: "ubicacion",
        question: "¿Cuáles son los horarios de atención?",
        answer: (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <li>
              <FaqInlineIcon icon={<Clock size={18} />} />{" "}
              <strong>Lunes – Viernes:</strong> 10:00 – 19:00 h
            </li>
            <li>
              <FaqInlineIcon icon={<Clock size={18} />} />{" "}
              <strong>Sábado:</strong> 10:00 – 17:00 h
            </li>
            <li>
              <FaqInlineIcon icon={<XCircle size={18} />} color="#708090" />{" "}
              <strong>Domingo:</strong> Cerrado
            </li>
          </ul>
        ),
      },
      {
        id: "u3",
        category: "ubicacion",
        question: "¿Puedo recoger mi pedido en tienda?",
        answer: (
          <>
            ¡Claro que sí! Selecciona la opción{" "}
            <strong>"Recoger en tienda"</strong> al momento de comprar. Tu
            pedido estará listo el mismo día si el artículo está en existencia.
            <br />
            <br />
            Te avisaremos por WhatsApp cuando puedas venir a recogerlo.
          </>
        ),
      },
    ],
  },

  // ── MATERIALES ──────────────────────────────────────────────
  {
    id: "materiales",
    label: "Materiales",
    icon: <Gem size={18} />,
    description: "Cuidados, durabilidad y tipos de materiales",
    items: [
      {
        id: "m1",
        category: "materiales",
        question: "¿Qué materiales usan en sus joyas?",
        answer: (
          <>
            Trabajamos principalmente con dos materiales:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<HardHat size={18} />} />{" "}
                <strong>Acero Inoxidable 316L:</strong> El más resistente a la
                corrosión, alergias y desgaste diario.
              </li>
              <li>
                <FaqInlineIcon icon={<Sparkles size={18} />} />{" "}
                <strong>Chapa de Oro / Chapa de Plata:</strong> Base de acero
                inoxidable recubierta con una capa de oro o plata de alta
                calidad.
              </li>
            </ul>
            <br />
            Todos nuestros productos son <strong>libres de níquel</strong>,
            ideales para pieles sensibles.
          </>
        ),
      },
      {
        id: "m2",
        category: "materiales",
        question: "¿Cuánto dura el acero inoxidable?",
        answer: (
          <>
            El acero inoxidable 316L es prácticamente{" "}
            <strong>permanente</strong> si se cuida correctamente:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> No se oxida
                ni se mancha con agua
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Resistente a
                sudor y contacto con la piel
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Mantiene su
                brillo por años
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Ideal para
                uso diario
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "m3",
        category: "materiales",
        question: "¿Cómo cuido mis piezas de acero inoxidable?",
        answer: (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <li>
              <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Puedes usarlas
              en el agua (ducha, alberca, mar)
            </li>
            <li>
              <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Limpia con un
              paño suave húmedo
            </li>
            <li>
              <FaqInlineIcon icon={<AlertCircle size={18} />} /> Evita contacto
              prolongado con cloro concentrado
            </li>
            <li>
              <FaqInlineIcon icon={<AlertCircle size={18} />} /> Guárdalas
              separadas para evitar rayones entre piezas
            </li>
            <li>
              <FaqInlineIcon icon={<XCircle size={18} />} color="#708090" /> No
              uses limpiadores abrasivos ni joya-cleaner químico fuerte
            </li>
          </ul>
        ),
      },
      {
        id: "m4",
        category: "materiales",
        question: "¿Cómo cuido mis piezas de chapa de oro o plata?",
        answer: (
          <>
            Las piezas con baño de oro o plata requieren cuidados adicionales
            para preservar el recubrimiento:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Limpia con
                paño suave y seco
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Guárdalas en
                su estuche o en una bolsita anti-oxidante
              </li>
              <li>
                <FaqInlineIcon icon={<AlertCircle size={18} />} /> Retíralas
                antes de ducharte, nadar o hacer ejercicio
              </li>
              <li>
                <FaqInlineIcon icon={<AlertCircle size={18} />} /> Evita
                perfumes, cremas y productos químicos directo en la pieza
              </li>
              <li>
                <FaqInlineIcon icon={<AlertCircle size={18} />} /> El desgaste
                natural del baño depende del uso — con buen cuidado puede durar{" "}
                <strong>1 a 3 años</strong>
              </li>
              <li>
                <FaqInlineIcon icon={<XCircle size={18} />} color="#708090" />{" "}
                No mojes las piezas de chapa constantemente
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "m5",
        category: "materiales",
        question: "¿Cómo sé si mi pieza es acero o chapa?",
        answer: (
          <>
            En cada producto de nuestra tienda indicamos claramente el material.
            Generalmente:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<HardHat size={18} />} />{" "}
                <strong>Acero Inoxidable:</strong> Tono plateado natural, más
                frío al tacto, sin recubrimiento
              </li>
              <li>
                <FaqInlineIcon icon={<Sparkles size={18} />} />{" "}
                <strong>Chapa de Oro:</strong> Tono dorado brillante,
                recubrimiento visible en los bordes con el tiempo
              </li>
              <li>
                <FaqInlineIcon icon={<Coins size={18} />} />{" "}
                <strong>Chapa de Plata:</strong> Tono plateado con acabado muy
                brillante, similar al rodio
              </li>
            </ul>
            <br />
            En caso de duda, escríbenos y con gusto te orientamos.
          </>
        ),
      },
      {
        id: "m6",
        category: "materiales",
        question: "¿Sus joyas son aptas para pieles sensibles o alérgicas?",
        answer: (
          <>
            Sí. Todas nuestras piezas están fabricadas con acero inoxidable
            médico <strong>316L libre de níquel</strong>, el metal más utilizado
            en cirugía e implantes médicos.
            <br />
            <br />
            Si tienes alergia extrema al metal, te recomendamos iniciar con
            piezas 100% de acero inoxidable sin baño y observar la reacción de
            tu piel.
          </>
        ),
      },
    ],
  },

  // ── MAYOREO ─────────────────────────────────────────────────
  {
    id: "mayoreo",
    label: "Mayoreo",
    icon: <Users size={18} />,
    description: "Programas, descuentos y consignación",
    items: [
      {
        id: "may1",
        category: "mayoreo",
        question: "¿Cómo puedo convertirme en mayorista de Stella?",
        answer: (
          <>
            El proceso es sencillo:
            <br />
            <br />
            <ol
              style={{
                padding: "0 0 0 18px",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                Contáctanos por Instagram <strong>@stellajoyeriar</strong> o
                WhatsApp indicando tu interés
              </li>
              <li>
                Cuéntanos sobre tu punto de venta, ubicación y canal (tienda
                física, online, mercados, etc.)
              </li>
              <li>
                Evaluamos tu perfil en <strong>máximo 5 días hábiles</strong>
              </li>
              <li>
                Si eres aprobado, te damos acceso a nuestro catálogo mayorista y
                haces tu primer pedido
              </li>
            </ol>
          </>
        ),
      },
      {
        id: "may2",
        category: "mayoreo",
        question: "¿Qué descuento tienen los mayoristas?",
        answer: (
          <>
            Los mayoristas activos reciben un{" "}
            <strong style={{ color: "#b76e79" }}>
              descuento permanente del 30%
            </strong>{" "}
            sobre el precio de lista en todos los productos del catálogo.
            <br />
            <br />
            Este descuento se aplica automáticamente en cada pedido mayorista
            confirmado.
          </>
        ),
      },
      {
        id: "may3",
        category: "mayoreo",
        question: "¿Cuál es el pedido mínimo para mayoreo?",
        answer: (
          <>
            Para acceder a precios mayoristas se requiere:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<Package size={18} />} />{" "}
                <strong>Mínimo 10 piezas por pedido</strong> (pueden ser de
                diferentes referencias)
              </li>
              <li>
                <FaqInlineIcon icon={<Coins size={18} />} />{" "}
                <strong>Monto mínimo:</strong> $1,500 MXN por pedido
              </li>
            </ul>
            <br />
            No hay mínimo de categoría — puedes mezclar aretes, anillos,
            collares y pulseras libremente.
          </>
        ),
      },
      {
        id: "may4",
        category: "mayoreo",
        question: "¿Qué es la consignación y cómo funciona?",
        answer: (
          <>
            La consignación es un modelo donde{" "}
            <strong>Stella te presta productos para que los vendas</strong> en
            tu punto, y solo pagas por lo que efectivamente se vendió.
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> No pagas por
                el inventario por adelantado
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Al final del
                periodo acordado, liquidas las piezas vendidas
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Las piezas
                no vendidas se devuelven sin cargo
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "may5",
        category: "mayoreo",
        question: "¿Puedo acceder a consignación desde el inicio?",
        answer: (
          <>
            La consignación es un beneficio para mayoristas{" "}
            <strong>consolidados</strong>. Para acceder necesitas:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<Calendar size={18} />} />{" "}
                <strong>Mínimo 3 meses</strong> como mayorista activo con Stella
              </li>
              <li>
                <FaqInlineIcon icon={<MapPin size={18} />} />{" "}
                <strong>
                  Vivir en la Zona Metropolitana de Guadalajara (ZMG)
                </strong>{" "}
                (requerido para gestión y visitas)
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Historial de
                pagos en tiempo y forma
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Al menos 2
                pedidos mayoristas previos
              </li>
            </ul>
            <br />
            Si cumples los requisitos, contáctanos para iniciar el proceso de
            evaluación.
          </>
        ),
      },
      {
        id: "may6",
        category: "mayoreo",
        question: "¿Qué pasa si no vendo todo el inventario en consignación?",
        answer: (
          <>
            No hay penalización. Al finalizar el periodo de consignación
            (usualmente <strong>30 – 60 días</strong> según acuerdo):
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Liquidas el
                importe de las piezas vendidas (con tu descuento del 30%)
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Las piezas
                no vendidas las devuelves en perfecto estado
              </li>
              <li>
                <FaqInlineIcon icon={<AlertCircle size={18} />} /> Piezas
                dañadas se cobran al precio mayorista correspondiente
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "may7",
        category: "mayoreo",
        question:
          "¿Pueden mis clientes hacer pedidos personalizados a través de mí?",
        answer: (
          <>
            Sí. Como mayorista puedes gestionar pedidos personalizados para tus
            clientes finales. Los tiempos de producción son los mismos, y el
            costo de personalización se cotiza caso por caso.
            <br />
            <br />
            Solo comunícate con tu contacto en Stella con los detalles del
            pedido.
          </>
        ),
      },
    ],
  },

  // ── GENERAL ─────────────────────────────────────────────────
  {
    id: "general",
    label: "General",
    icon: <ShieldCheck size={18} />,
    description: "Cuenta, pagos, devoluciones y más",
    items: [
      {
        id: "g1",
        category: "general",
        question: "¿Qué métodos de pago aceptan?",
        answer: (
          <>
            Aceptamos:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<CardIcon size={18} />} />{" "}
                <strong>Tarjetas de crédito y débito</strong> (Visa, Mastercard,
                American Express)
              </li>
              <li>
                <FaqInlineIcon icon={<Smartphone size={18} />} />{" "}
                <strong>Transferencia bancaria / SPEI</strong>
              </li>
              <li>
                <FaqInlineIcon
                  icon={<CheckCircle2 size={18} />}
                  color="#00C04B"
                />{" "}
                <strong>Mercado Pago</strong>
              </li>
              <li>
                <FaqInlineIcon icon={<Coins size={18} />} />{" "}
                <strong>Efectivo en tienda</strong>
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "g2",
        category: "general",
        question: "¿Tienen política de devoluciones?",
        answer: (
          <>
            Sí. Aceptamos devoluciones dentro de los{" "}
            <strong>7 días naturales</strong> siguientes a la recepción del
            pedido, siempre que:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> La pieza
                esté en perfectas condiciones (sin uso, sin daños)
              </li>
              <li>
                <FaqInlineIcon icon={<CheckCircle2 size={18} />} /> Cuente con
                su empaque original
              </li>
              <li>
                <FaqInlineIcon icon={<XCircle size={18} />} color="#708090" />{" "}
                Piezas personalizadas no son sujetas a devolución
              </li>
            </ul>
            <br />
            El reembolso se realiza por el mismo medio de pago en 3 – 5 días
            hábiles.
          </>
        ),
      },
      {
        id: "g3",
        category: "general",
        question: "¿Cómo puedo contactar a Stella?",
        answer: (
          <>
            Puedes comunicarte con nosotros a través de:
            <br />
            <br />
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <li>
                <FaqInlineIcon icon={<Instagram size={18} />} />{" "}
                <strong>Instagram:</strong> @stellajoyeriar
              </li>
              <li>
                <FaqInlineIcon icon={<Facebook size={18} />} />{" "}
                <strong>Facebook:</strong> Stella Joyería Artesanal
              </li>
              <li>
                <FaqInlineIcon icon={<MessageSquare size={18} />} />{" "}
                <strong>Chatbot:</strong> Disponible en nuestra tienda en línea
                24/7
              </li>
              <li>
                <FaqInlineIcon icon={<Store size={18} />} />{" "}
                <strong>Tienda física:</strong> Agustín de Iturbide 578,
                Guadalajara
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
];

// ────────────────────────────────────────────────────────────────
export default function FaqPage() {
  const { usuario } = useAuth();
  const [activeCategory, setActiveCategory] = useState<FaqCategory>("envios");

  const currentSection = FAQ_SECTIONS.find(s => s.id === activeCategory)!;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f4ef",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
                @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <Suspense fallback={<div>Loading...</div>}>
        <HeaderClient user={usuario} />
      </Suspense>
      <ChatbotPage />

      {/* Hero */}
      <FaqHero />

      {/* Contenido principal */}
      <main
        style={{
          flex: 1,
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "clamp(36px,5vw,60px) clamp(20px,5vw,48px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(28px,4vw,44px)",
        }}
      >
        {/* ── Categorías / Tabs ── */}
        <FaqCategories
          sections={FAQ_SECTIONS}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* ── Descripción de sección ── */}
        <div
          style={{
            textAlign: "center",
            animation: "fadeUp 0.4s cubic-bezier(.22,1,.36,1) both",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          {/* Icon Preview */}
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "rgba(183,110,121,0.1)",
              border: "1px solid rgba(183,110,121,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b76e79",
            }}
          >
            <div style={{ transform: "scale(0.8)", display: "flex" }}>
              {currentSection.icon}
            </div>
          </div>
          <span
            style={{
              fontFamily: "var(--font-sans, Inter, sans-serif)",
              fontSize: "0.82rem",
              color: "#708090",
            }}
          >
            {currentSection.description}
          </span>
        </div>

        {/* ── Accordion de preguntas ── */}
        <FaqAccordion items={currentSection.items} />

        {/* ── Mapa y ubicación (siempre visible) ── */}
        <section>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span style={{ height: 1, width: 36, background: "#b76e79" }} />
              <span
                style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#b76e79",
                }}
              >
                Encuentranos
              </span>
              <span style={{ height: 1, width: 36, background: "#b76e79" }} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.8rem,3vw,2.6rem)",
                fontWeight: 500,
                color: "#4a5568",
                margin: 0,
              }}
            >
              Nuestra{" "}
              <em style={{ color: "#b76e79", fontStyle: "italic" }}>tienda</em>
            </h2>
          </div>
          <FaqLocation />
        </section>

        {/* ── Mayoreo banner (siempre visible) ── */}
        <section>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span style={{ height: 1, width: 36, background: "#b76e79" }} />
              <span
                style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#b76e79",
                }}
              >
                Distribuidores
              </span>
              <span style={{ height: 1, width: 36, background: "#b76e79" }} />
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                fontSize: "clamp(1.8rem,3vw,2.6rem)",
                fontWeight: 500,
                color: "#4a5568",
                margin: 0,
              }}
            >
              ¿Te interesa el{" "}
              <em style={{ color: "#b76e79", fontStyle: "italic" }}>
                mayoreo?
              </em>
            </h2>
          </div>
          <FaqWholesale />
        </section>
      </main>

      <Footer />
    </div>
  );
}
