import { Suspense } from "react";
import { TerminosPageData } from "./type";
import TerminosContent from "./_componentes/TerminosContent";

// ─── Datos de los T&C ─────────────────────────────────────────────────────────
const terminosData: TerminosPageData = {
  lastUpdated: "Marzo 2025",
  sections: [
    {
      id: "aceptacion",
      number: "01",
      title: "Aceptación de los términos",
      content: [
        {
          type: "paragraph",
          text: "Al acceder o utilizar la plataforma Stella ERP, ya sea como cliente minorista, distribuidor mayorista o administrador, aceptas quedar vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguno de los términos aquí establecidos, debes abstenerte de usar la Plataforma.",
        },
      ],
    },
    {
      id: "descripcion",
      number: "02",
      title: "Descripción del servicio",
      content: [
        {
          type: "paragraph",
          text: "Stella Joyería Artesanal opera una plataforma digital que integra:",
        },
        {
          type: "list",
          items: [
            "Tienda en línea (E-commerce) para clientes minoristas y mayoristas.",
            "Sistema ERP para la gestión interna de inventario, ventas, consignaciones, reportes y administración de usuarios.",
            "Catálogo interactivo con visualización de productos y personalización.",
          ],
        },
      ],
    },
    {
      id: "registro",
      number: "03",
      title: "Registro y cuentas de usuario",
      content: [
        {
          type: "subheading",
          text: "3.1 Elegibilidad",
        },
        {
          type: "paragraph",
          text: "Para registrarte debes ser mayor de 18 años o contar con autorización de un tutor legal. Al crear una cuenta declaras que la información proporcionada es verídica, completa y actualizada.",
        },
        {
          type: "subheading",
          text: "3.2 Responsabilidad de la cuenta",
        },
        {
          type: "paragraph",
          text: "Eres responsable de mantener la confidencialidad de tus credenciales de acceso. Cualquier actividad realizada desde tu cuenta es tu responsabilidad. Debes notificar de inmediato a Stella ante cualquier uso no autorizado.",
        },
        {
          type: "subheading",
          text: "3.3 Roles de usuario",
        },
        {
          type: "list",
          items: [
            "Cliente minorista — acceso a catálogo, carrito, pedidos y perfil personal.",
            "Mayorista — acceso adicional a consignaciones, créditos, precios especiales y reportes personalizados.",
            "Administrador — acceso completo al sistema ERP, gestión de usuarios, inventario y configuración.",
          ],
        },
      ],
    },
    {
      id: "pagos",
      number: "04",
      title: "Compras y pagos",
      content: [
        {
          type: "subheading",
          text: "4.1 Precios",
        },
        {
          type: "paragraph",
          text: "Todos los precios están expresados en pesos mexicanos (MXN) e incluyen IVA cuando corresponda. Stella se reserva el derecho de modificar precios en cualquier momento sin previo aviso, salvo que el pedido ya haya sido confirmado.",
        },
        {
          type: "subheading",
          text: "4.2 Métodos de pago aceptados",
        },
        {
          type: "list",
          items: [
            "Tarjeta de crédito y débito (Visa, Mastercard, American Express)",
            "PayPal",
            "Transferencia bancaria (SPEI)",
            "Stripe",
          ],
        },
        {
          type: "subheading",
          text: "4.3 Seguridad de pagos",
        },
        {
          type: "paragraph",
          text: "Todos los pagos se procesan mediante pasarelas certificadas con cifrado TLS/AES y cumplimiento PCI-DSS. Stella no almacena datos de tarjetas en sus servidores.",
        },
        {
          type: "subheading",
          text: "4.4 Confirmación del pedido",
        },
        {
          type: "paragraph",
          text: "Un pedido se considera confirmado únicamente cuando el pago ha sido procesado exitosamente y el usuario recibe confirmación por correo electrónico.",
        },
      ],
    },
    {
      id: "envios",
      number: "05",
      title: "Envíos y entregas",
      content: [
        {
          type: "subheading",
          text: "5.1 Tiempos de entrega",
        },
        {
          type: "paragraph",
          text: "Los tiempos estimados de entrega se comunican al momento de confirmar el pedido y pueden variar según la disponibilidad del producto, la ubicación del destinatario y la paquetería seleccionada.",
        },
        {
          type: "subheading",
          text: "5.2 Responsabilidad de envío",
        },
        {
          type: "paragraph",
          text: "Una vez que el paquete es entregado a la empresa de paquetería, Stella no se hace responsable por retrasos, daños o extravíos causados por el transportista. En caso de incidencia, Stella asistirá al cliente en el proceso de reclamación.",
        },
        {
          type: "subheading",
          text: "5.3 Dirección de entrega",
        },
        {
          type: "paragraph",
          text: "El cliente es responsable de proporcionar una dirección de entrega correcta y completa. Stella no se responsabiliza por entregas fallidas derivadas de información incorrecta.",
        },
      ],
    },
    {
      id: "devoluciones",
      number: "06",
      title: "Devoluciones y cambios",
      content: [
        {
          type: "subheading",
          text: "6.1 Plazo",
        },
        {
          type: "paragraph",
          text: "El cliente puede solicitar devolución o cambio dentro de los 10 días naturales posteriores a la recepción del producto.",
        },
        {
          type: "subheading",
          text: "6.2 Condiciones",
        },
        {
          type: "list",
          items: [
            "Estar en su estado original, sin uso ni daños.",
            "Conservar el empaque y etiquetas originales.",
            "Incluir el comprobante de compra.",
          ],
        },
        {
          type: "subheading",
          text: "6.3 Productos personalizados",
        },
        {
          type: "paragraph",
          text: "Los productos elaborados con diseño personalizado o bajo pedido especial no son elegibles para devolución, salvo que presenten un defecto de fabricación comprobado.",
        },
        {
          type: "subheading",
          text: "6.4 Proceso",
        },
        {
          type: "paragraph",
          text: "Para iniciar una devolución debes contactar a Stella a través de la Plataforma o al correo de atención al cliente. Los costos de envío de devolución corren por cuenta del cliente, excepto cuando el motivo sea un defecto de fabricación o error de Stella.",
        },
      ],
    },
    {
      id: "consignaciones",
      number: "07",
      title: "Consignaciones (Mayoristas)",
      content: [
        {
          type: "subheading",
          text: "7.1 Acuerdo de consignación",
        },
        {
          type: "paragraph",
          text: "Los distribuidores mayoristas que operen bajo esquema de consignación aceptan recibir mercancía de Stella para su venta, sin transferencia de propiedad hasta que se realice la venta efectiva al consumidor final.",
        },
        {
          type: "subheading",
          text: "7.2 Trazabilidad",
        },
        {
          type: "paragraph",
          text: "Toda consignación queda registrada en la Plataforma con número de folio, descripción de piezas, fecha de entrega y valor acordado. El distribuidor es responsable de la custodia de las piezas consignadas.",
        },
        {
          type: "subheading",
          text: "7.3 Liquidación",
        },
        {
          type: "paragraph",
          text: "Las liquidaciones de consignaciones se realizan conforme al calendario pactado entre Stella y el distribuidor. Las piezas no vendidas deben devolverse en el estado original dentro del plazo acordado.",
        },
        {
          type: "subheading",
          text: "7.4 Responsabilidad por pérdida o daño",
        },
        {
          type: "paragraph",
          text: "El distribuidor responde económicamente por cualquier pieza consignada que resulte dañada, extraviada o robada mientras esté bajo su custodia.",
        },
      ],
    },
    {
      id: "propiedad",
      number: "08",
      title: "Propiedad intelectual",
      content: [
        {
          type: "paragraph",
          text: "Todo el contenido de la Plataforma — incluyendo logotipos, imágenes, diseños de productos, textos, código fuente y catálogos — es propiedad exclusiva de Stella Joyería Artesanal o cuenta con las licencias correspondientes. Queda prohibida su reproducción, distribución o uso comercial sin autorización escrita previa.",
        },
      ],
    },
    {
      id: "privacidad",
      number: "09",
      title: "Privacidad y protección de datos",
      content: [
        {
          type: "subheading",
          text: "9.1 Datos recopilados",
        },
        {
          type: "paragraph",
          text: "Stella recopila datos personales necesarios para la operación del servicio: nombre, correo electrónico, dirección, historial de pedidos y datos de pago (procesados por terceros certificados).",
        },
        {
          type: "subheading",
          text: "9.2 Uso de datos",
        },
        {
          type: "list",
          items: [
            "Procesar pedidos y pagos.",
            "Gestionar la relación comercial con mayoristas.",
            "Mejorar la experiencia de usuario en la Plataforma.",
            "Enviar comunicaciones relacionadas con el servicio (con posibilidad de cancelar suscripción).",
          ],
        },
        {
          type: "subheading",
          text: "9.3 Compartición de datos",
        },
        {
          type: "paragraph",
          text: "Stella no vende ni cede datos personales a terceros, excepto a proveedores de servicios indispensables para la operación (pasarelas de pago, servicios de envío) bajo acuerdos de confidencialidad.",
        },
        {
          type: "subheading",
          text: "9.4 Derechos ARCO",
        },
        {
          type: "paragraph",
          text: "El usuario tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP). Para ejercer estos derechos debe contactar a Stella mediante el correo de privacidad indicado en la Plataforma.",
        },
      ],
    },
    {
      id: "seguridad",
      number: "10",
      title: "Seguridad del sistema",
      content: [
        {
          type: "subheading",
          text: "10.1 Acceso no autorizado",
        },
        {
          type: "paragraph",
          text: "Queda estrictamente prohibido intentar acceder a secciones de la Plataforma para las que no se tiene autorización, realizar ingeniería inversa, inyectar código malicioso o explotar vulnerabilidades del sistema.",
        },
        {
          type: "subheading",
          text: "10.2 Suspensión de cuenta",
        },
        {
          type: "paragraph",
          text: "Stella se reserva el derecho de suspender o cancelar cuentas que incurran en uso fraudulento, actividad sospechosa, violación de estos términos o cualquier conducta que ponga en riesgo la integridad del sistema o de otros usuarios.",
        },
      ],
    },
    {
      id: "disponibilidad",
      number: "11",
      title: "Disponibilidad del servicio",
      content: [
        {
          type: "paragraph",
          text: "Stella no garantiza disponibilidad ininterrumpida de la Plataforma. Pueden existir períodos de mantenimiento programado o situaciones fuera del control de Stella que afecten temporalmente el servicio. Stella informará con anticipación sobre mantenimientos programados.",
        },
      ],
    },
    {
      id: "responsabilidad",
      number: "12",
      title: "Limitación de responsabilidad",
      content: [
        {
          type: "paragraph",
          text: "En la máxima medida permitida por la ley, Stella no será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso o imposibilidad de uso de la Plataforma, incluyendo pérdida de datos, ganancias no obtenidas o interrupción del negocio.",
        },
      ],
    },
    {
      id: "modificaciones",
      number: "13",
      title: "Modificaciones a los términos",
      content: [
        {
          type: "paragraph",
          text: "Stella se reserva el derecho de actualizar estos Términos y Condiciones en cualquier momento. Los cambios serán notificados mediante la Plataforma o por correo electrónico con al menos 15 días de anticipación. El uso continuado de la Plataforma tras la notificación implica la aceptación de los nuevos términos.",
        },
      ],
    },
    {
      id: "legislacion",
      number: "14",
      title: "Legislación aplicable y jurisdicción",
      content: [
        {
          type: "paragraph",
          text: "Estos Términos y Condiciones se rigen por las leyes vigentes de los Estados Unidos Mexicanos. Para cualquier controversia derivada del uso de la Plataforma, las partes se someten a la jurisdicción de los tribunales competentes de la ciudad de Guadalajara, Jalisco, renunciando a cualquier otro fuero que pudiera corresponderles.",
        },
      ],
    },
    {
      id: "contacto",
      number: "15",
      title: "Contacto",
      content: [
        {
          type: "paragraph",
          text: "Para dudas, aclaraciones o ejercicio de derechos relacionados con estos Términos y Condiciones:",
        },
        {
          type: "list",
          items: [
            "Correo: contacto@stellajoyeria.com",
            'Plataforma: sección "Contacto" en el menú principal',
            "Dirección: Guadalajara, Jalisco, México",
          ],
        },
      ],
    },
  ],
};

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata = {
  title: "Términos y Condiciones — Stella Joyería Artesanal",
  description:
    "Lee los términos y condiciones de uso de la plataforma Stella ERP y tienda en línea de Stella Joyería Artesanal.",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TerminosPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Cargando términos...</div>}
    >
      <TerminosContent data={terminosData} />
    </Suspense>
  );
}
