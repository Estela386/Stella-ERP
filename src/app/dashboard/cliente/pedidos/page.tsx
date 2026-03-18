"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@utils/supabase/client";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import OrderCard from "./_components/OrderCard";
import OrdersStats from "./_components/OrdersStats";
import { Order, OrderItem, OrdersStats as IOrdersStats, OrderStatus } from "./type";
import { ShoppingBag } from "lucide-react";

const MOCK_ORDERS: Order[] = [
  {
    id: 9901,
    fecha: "15 Mar 2024",
    total: 2450,
    estado: "enviado",
    direccion_envio: "C. Agustín de Iturbide 578, Guadalajara, Jal.",
    metodo_pago: "Tarjeta de Crédito",
    items: [
      { id: 101, id_producto: 1, nombre_producto: "Anillo Constelación Oro", cantidad: 1, precio_unitario: 1850, imagen_url: "/LogoM.svg" },
      { id: 102, id_producto: 2, nombre_producto: "Aretes Luna Plata", cantidad: 1, precio_unitario: 600, imagen_url: "/LogoM.svg" }
    ]
  },
  {
    id: 9842,
    fecha: "10 Mar 2024",
    total: 1200,
    estado: "pagado",
    direccion_envio: "Av. Chapultepec 123, Guadalajara, Jal.",
    metodo_pago: "Transferencia",
    items: [
      { id: 103, id_producto: 3, nombre_producto: "Collar Infinito", cantidad: 1, precio_unitario: 1200, imagen_url: "/LogoM.svg" }
    ]
  }
];

export default function OrdersPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [stats, setStats] = useState<IOrdersStats>({
    totalPedidos: MOCK_ORDERS.length,
    pedidosEnviados: MOCK_ORDERS.filter(o => o.estado === "enviado").length,
    puntosAcumulados: Math.floor(MOCK_ORDERS.reduce((acc, o) => acc + o.total, 0) / 10)
  });

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient();
      let finalMockOrders = [...MOCK_ORDERS];

      try {
        // Intentar obtener algunos productos reales para la simulación
        const { data: realProducts } = await supabase
          .from("producto")
          .select("id, nombre, precio, imagen_url")
          .limit(3);

        if (realProducts && realProducts.length > 0) {
          finalMockOrders = [
            {
              id: 9901,
              fecha: "15 Mar 2024",
              total: realProducts[0].precio + (realProducts[1]?.precio || 0),
              estado: "enviado",
              direccion_envio: "C. Agustín de Iturbide 578, Guadalajara, Jal.",
              metodo_pago: "Tarjeta de Crédito",
              items: [
                { 
                  id: 101, 
                  id_producto: realProducts[0].id, 
                  nombre_producto: realProducts[0].nombre, 
                  cantidad: 1, 
                  precio_unitario: realProducts[0].precio, 
                  imagen_url: realProducts[0].imagen_url 
                },
                ...(realProducts[1] ? [{
                  id: 102,
                  id_producto: realProducts[1].id,
                  nombre_producto: realProducts[1].nombre,
                  cantidad: 1,
                  precio_unitario: realProducts[1].precio,
                  imagen_url: realProducts[1].imagen_url
                }] : [])
              ]
            },
            {
              id: 9842,
              fecha: "10 Mar 2024",
              total: realProducts[2]?.precio || realProducts[0].precio,
              estado: "pagado",
              direccion_envio: "Av. Chapultepec 123, Guadalajara, Jal.",
              metodo_pago: "Transferencia",
              items: [
                { 
                  id: 103, 
                  id_producto: realProducts[2]?.id || realProducts[0].id, 
                  nombre_producto: realProducts[2]?.nombre || realProducts[0].nombre, 
                  cantidad: 1, 
                  precio_unitario: realProducts[2]?.precio || realProducts[0].precio, 
                  imagen_url: realProducts[2]?.imagen_url || realProducts[0].imagen_url 
                }
              ]
            }
          ];
        }

        if (!usuario) {
          setOrders(finalMockOrders);
          updateStats(finalMockOrders);
          setLoading(false);
          return;
        }

        const { data: ventasData, error: ventasError } = await supabase
          .from("ventas")
          .select(`
            *,
            estatus:id_estatus (id, nombre)
          `)
          .eq("id_usuario", usuario.id)
          .order("fecha", { ascending: false });

        if (ventasError) throw ventasError;

        if (ventasData && ventasData.length > 0) {
          const formattedOrders: Order[] = [];

          for (const venta of ventasData) {
            const { data: detallesData } = await supabase
              .from("detalle_venta")
              .select(`
                *,
                producto:id_producto (id, nombre, imagen_url)
              `)
              .eq("id_venta", venta.id);

            const items: OrderItem[] = detallesData?.map(d => ({
              id: d.id,
              id_producto: d.id_producto,
              nombre_producto: d.producto?.nombre || "Producto Stella",
              cantidad: d.cantidad,
              precio_unitario: d.precio_unitario,
              imagen_url: d.producto?.imagen_url
            })) || [];

            let estado: OrderStatus = "pendiente";
            const statusName = venta.estatus?.nombre?.toLowerCase() || "";
            if (statusName.includes("envia") || statusName.includes("ruta")) estado = "enviado";
            else if (statusName.includes("paga") || statusName.includes("completodo")) estado = "pagado";
            else if (statusName.includes("cancel")) estado = "cancelado";

            formattedOrders.push({
              id: venta.id,
              fecha: new Date(venta.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }),
              total: Number(venta.total),
              estado: estado,
              items: items,
              metodo_pago: venta.id_metodopago === 1 ? "Tarjeta" : "Transferencia",
              direccion_envio: "Envío a domicilio"
            });
          }

          const allOrders = [...finalMockOrders, ...formattedOrders];
          setOrders(allOrders);
          updateStats(allOrders);
        } else {
          setOrders(finalMockOrders);
          updateStats(finalMockOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders(finalMockOrders);
        updateStats(finalMockOrders);
      } finally {
        setLoading(false);
      }
    }

    function updateStats(allOrders: Order[]) {
      setStats({
        totalPedidos: allOrders.length,
        pedidosEnviados: allOrders.filter(o => o.estado === "enviado").length,
        puntosAcumulados: Math.floor(allOrders.reduce((acc, o) => acc + o.total, 0) / 10)
      });
    }

    if (!authLoading) {
      fetchOrders();
    }
  }, [usuario, authLoading]);

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f6f4ef", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#708090" }}>Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f4ef", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <HeaderClient user={usuario} />

      <main style={{
        flex: 1,
        maxWidth: 1000,
        width: "100%",
        margin: "0 auto",
        padding: "40px 20px",
        animation: "fadeIn 0.6s ease-out"
      }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2.8rem",
            fontWeight: 500,
            color: "#4a5568",
            margin: "0 0 8px 0",
            fontStyle: "italic"
          }}>Mis Pedidos</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#708090", fontSize: "1rem" }}>
            Realiza el seguimiento de tus joyas y revisa tu historial de compras.
          </p>
        </div>

        <OrdersStats stats={stats} />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {orders.length > 0 ? (
            orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#ffffff",
              borderRadius: 24,
              border: "1px dashed rgba(112,128,144,0.2)"
            }}>
              <ShoppingBag size={48} color="#b76e79" style={{ marginBottom: 16, opacity: 0.5 }} />
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#4a5568", margin: "0 0 8px 0" }}>
                Aún no tienes pedidos
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#708090", marginBottom: 24 }}>
                ¡Es un buen momento para encontrar tu próxima joya favorita!
              </p>
              <button 
                onClick={() => window.location.href = "/dashboard/cliente/catalogo"}
                style={{
                  padding: "12px 24px",
                  background: "#b76e79",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 12px rgba(183,110,121,0.2)"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                Explorar Catálogo
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
