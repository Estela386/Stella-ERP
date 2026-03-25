"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@utils/supabase/client";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import OrderCard from "./_components/OrderCard";
import OrdersStats from "./_components/OrdersStats";
import { Order, OrderItem, OrdersStats as IOrdersStats, OrderStatus } from "./type";
import { ShoppingBag, Search } from "lucide-react";

export type TabType = "pedidos" | "comprar_nuevo" | "cancelados";

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
  },
  {
    id: 9755,
    fecha: "20 Feb 2024",
    total: 800,
    estado: "cancelado",
    direccion_envio: "Av. Chapultepec 123, Guadalajara, Jal.",
    metodo_pago: "Tarjeta de Crédito",
    items: [
      { id: 104, id_producto: 4, nombre_producto: "Dije Estrella Fugaz", cantidad: 1, precio_unitario: 800, imagen_url: "/LogoM.svg" }
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

  const [activeTab, setActiveTab] = useState<TabType>("pedidos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      const supabase = createClient();
      let finalMockOrders = [...MOCK_ORDERS];

      try {
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
                { id: 101, id_producto: realProducts[0].id, nombre_producto: realProducts[0].nombre, cantidad: 1, precio_unitario: realProducts[0].precio, imagen_url: realProducts[0].imagen_url },
                ...(realProducts[1] ? [{ id: 102, id_producto: realProducts[1].id, nombre_producto: realProducts[1].nombre, cantidad: 1, precio_unitario: realProducts[1].precio, imagen_url: realProducts[1].imagen_url }] : [])
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
                { id: 103, id_producto: realProducts[2]?.id || realProducts[0].id, nombre_producto: realProducts[2]?.nombre || realProducts[0].nombre, cantidad: 1, precio_unitario: realProducts[2]?.precio || realProducts[0].precio, imagen_url: realProducts[2]?.imagen_url || realProducts[0].imagen_url }
              ]
            },
            {
              id: 9755,
              fecha: "20 Feb 2024",
              total: 800,
              estado: "cancelado",
              direccion_envio: "Av. Chapultepec 123, Guadalajara, Jal.",
              metodo_pago: "Tarjeta de Crédito",
              items: [
                { id: 104, id_producto: 4, nombre_producto: "Product XYZ", cantidad: 1, precio_unitario: 800, imagen_url: "/LogoM.svg" }
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
          .select(`*, estatus:id_estatus(id, nombre)`)
          .eq("id_usuario", usuario.id)
          .order("fecha", { ascending: false });

        if (ventasError) throw ventasError;

        if (ventasData && ventasData.length > 0) {
          const formattedOrders: Order[] = [];

          for (const venta of ventasData) {
            const { data: detallesData } = await supabase
              .from("detalle_venta")
              .select(`*, producto:id_producto(id, nombre, imagen_url)`)
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
              estado,
              items,
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

  // Derived filtered state for presentation
  const displayedOrders = orders.filter(order => {
    // Top-level tab filter
    if (activeTab === "pedidos" && order.estado === "cancelado") return false;
    if (activeTab === "cancelados" && order.estado !== "cancelado") return false;
    
    // In "comprar_nuevo", we filter only delivered/completed to show things they can re-buy easily.
    // For demo simplicity, we show non-cancelled.
    if (activeTab === "comprar_nuevo" && order.estado === "cancelado") return false;

    // Search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const matchId = order.id.toString().includes(term);
      const matchItem = order.items.some(item => item.nombre_producto.toLowerCase().includes(term));
      if (!matchId && !matchItem) return false;
    }

    return true;
  });

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f6f4ef", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", color: "#708090" }}>Cargando tus pedidos...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f4ef", display: "flex", flexDirection: "column" }}>
      <style>{`
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
        {/* Page Title & Breadcrumb style */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{
            fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
            fontSize: "clamp(2.8rem, 5.2vw, 5.2rem)",
            fontWeight: 400,
            color: "#4a5568",
            margin: "0 0 8px 0"
          }}>
            Mis <span style={{ color: "#b76e79", fontStyle: "italic" }}>Pedidos</span>
          </h1>
        </div>

        {/* Orders Tabs and Search Bar (Amazon Style) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          <div style={{ 
            display: "flex", flexWrap: "wrap", alignItems: "center", borderBottom: "1px solid rgba(112,128,144,0.18)", gap: 24 
          }}>
            <button 
              onClick={() => setActiveTab("pedidos")}
              style={{
                background: "none", border: "none", borderBottom: activeTab === "pedidos" ? "3px solid #b76e79" : "3px solid transparent",
                padding: "8px 4px", fontSize: "0.95rem", fontWeight: activeTab === "pedidos" ? 600 : 500,
                color: activeTab === "pedidos" ? "#b76e79" : "#4a5568", cursor: "pointer", transition: "all 0.2s ease",
                fontFamily: "var(--font-sans, Inter, sans-serif)"
              }}>
              Pedidos
            </button>
            <button 
              onClick={() => setActiveTab("comprar_nuevo")}
              style={{
                background: "none", border: "none", borderBottom: activeTab === "comprar_nuevo" ? "3px solid #b76e79" : "3px solid transparent",
                padding: "8px 4px", fontSize: "0.95rem", fontWeight: activeTab === "comprar_nuevo" ? 600 : 500,
                color: activeTab === "comprar_nuevo" ? "#b76e79" : "#4a5568", cursor: "pointer", transition: "all 0.2s ease",
                fontFamily: "var(--font-sans, Inter, sans-serif)"
              }}>
              Comprar de nuevo
            </button>
            <button 
              onClick={() => setActiveTab("cancelados")}
              style={{
                background: "none", border: "none", borderBottom: activeTab === "cancelados" ? "3px solid #b76e79" : "3px solid transparent",
                padding: "8px 4px", fontSize: "0.95rem", fontWeight: activeTab === "cancelados" ? 600 : 500,
                color: activeTab === "cancelados" ? "#b76e79" : "#4a5568", cursor: "pointer", transition: "all 0.2s ease",
                fontFamily: "var(--font-sans, Inter, sans-serif)"
              }}>
              Pedidos cancelados
            </button>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", position: "relative", alignSelf: "center", paddingBottom: 6 }}>
              <div style={{ position: "absolute", left: 12, top: "45%", transform: "translateY(-50%)" }}>
                <Search size={14} color="#708090" />
              </div>
              <input 
                placeholder="Buscar en pedidos" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px 14px 8px 34px", fontSize: "0.85rem", border: "1px solid rgba(112,128,144,0.25)", borderRadius: 6,
                  outline: "none", background: "#ffffff", color: "#4a5568", minWidth: 240, fontFamily: "var(--font-sans, Inter, sans-serif)"
                }}
              />
              <button style={{
                  background: "#4a5568", color: "#fff", border: "none", padding: "9px 16px",
                  borderRadius: "0 6px 6px 0", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                  fontFamily: "var(--font-sans, Inter, sans-serif)", marginLeft: "-2px" // overlap border
              }}>
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Informative Stats */}
        {activeTab === "pedidos" && !searchTerm && (
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: "0.9rem", color: "#4a5568", fontWeight: 600 }}>
              {displayedOrders.length} pedidos
            </span>
            <span style={{ fontSize: "0.9rem", color: "#708090" }}> realizados en tu cuenta.</span>
          </div>
        )}

        {/* Orders Filtered Mapping */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {displayedOrders.length > 0 ? (
            displayedOrders.map(order => (
              <OrderCard key={order.id} order={order} activeTab={activeTab} />
            ))
          ) : (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#ffffff",
              borderRadius: 12,
              border: "1px dashed rgba(112,128,144,0.4)",
              marginTop: 20
            }}>
              <ShoppingBag size={48} color="#b76e79" style={{ marginBottom: 16, opacity: 0.5 }} />
              <h3 style={{ fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)", fontSize: "1.5rem", color: "#4a5568", margin: "0 0 8px 0" }}>
                No encontramos pedidos
              </h3>
              <p style={{ fontFamily: "var(--font-sans, Inter, sans-serif)", color: "#708090", marginBottom: 24 }}>
                {searchTerm ? `No hay resultados para "${searchTerm}"` : "Te invitamos a realizar tu primera compra en nuestra tienda."}
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => window.location.href = "/dashboard/cliente/catalogo"}
                  style={{
                    padding: "10px 24px", background: "#b76e79", color: "#fff", border: "none",
                    borderRadius: 8, fontFamily: "var(--font-sans, Inter, sans-serif)", fontWeight: 500, cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(183,110,121,0.2)"
                  }}
                >
                  Continuar comprando
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
