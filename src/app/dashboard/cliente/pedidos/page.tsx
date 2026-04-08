"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@utils/supabase/client";
import HeaderClient from "@/app/(auth)/_components/HeaderClient";
import Footer from "@/app/(auth)/_components/Footer";
import OrderCard from "./_components/OrderCard";
import {
  Order,
  OrderItem,
  OrdersStats as IOrdersStats,
  OrderStatus,
} from "./type";
import { ShoppingBag, Search } from "lucide-react";

// Importamos el servicio que acabamos de crear
import { VentaService } from "@/lib/services/VentaService"; // Ajusta esta ruta a tu estructura

export type TabType = "pedidos" | "comprar_nuevo" | "cancelados";

export default function OrdersPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<IOrdersStats>({
    totalPedidos: 0,
    pedidosEnviados: 0,
    puntosAcumulados: 0,
  });

  const [activeTab, setActiveTab] = useState<TabType>("pedidos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchOrders() {
      // Si no hay usuario cargado, salimos temprano
      if (!usuario?.id) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const ventaService = new VentaService(supabase);

        // Llamamos a nuestro servicio limpio
        const { ventas, error } = await ventaService.obtenerPedidosDeUsuario(
          usuario.id as unknown as number
        );

        if (error) throw new Error(error);

        if (ventas && mounted) {
          const formattedOrders: Order[] = ventas.map(venta => {
            // Mapeamos los items de "detallesventas" al formato OrderItem de la UI
            const items: OrderItem[] =
              venta.detalles?.map(detalle => ({
                id: detalle.id,
                id_producto: detalle.id_producto || 0,
                nombre_producto:
                  detalle.producto?.nombre || "Producto Desconocido",
                cantidad: detalle.cantidad || 1,
                precio_unitario: detalle.producto?.precio || 0,
                imagen_url: detalle.producto?.url_imagen || "/LogoM.svg",
              })) || [];

            // Normalizamos el estado de la base de datos para la UI
            let estadoUI: OrderStatus = "pendiente";
            const dbEstado = (venta.estado || "").toLowerCase();
            if (dbEstado.includes("envia") || dbEstado.includes("ruta"))
              estadoUI = "enviado";
            else if (
              dbEstado.includes("paga") ||
              dbEstado.includes("completado")
            )
              estadoUI = "pagado";
            else if (dbEstado.includes("cancel")) estadoUI = "cancelado";

            // Retornamos el objeto con la interfaz exacta que espera tu <OrderCard />
            return {
              id: venta.id,
              fecha: venta.fecha
                ? new Date(venta.fecha).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Fecha desconocida",
              total: Number(venta.total) || 0,
              estado: estadoUI,
              items,
              metodo_pago: "Método en tienda", // Ajustar si agregas métodos de pago después
              direccion_envio: "Envío a domicilio", // Ajustar si agregas direcciones después
            };
          });

          setOrders(formattedOrders);
          updateStats(formattedOrders);
        }
      } catch (error) {
        console.error("Error cargando pedidos:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    function updateStats(allOrders: Order[]) {
      if (mounted) {
        setStats({
          totalPedidos: allOrders.length,
          pedidosEnviados: allOrders.filter(o => o.estado === "enviado").length,
          puntosAcumulados: Math.floor(
            allOrders.reduce((acc, o) => acc + o.total, 0) / 10
          ),
        });
      }
    }

    if (!authLoading) {
      fetchOrders();
    }

    return () => {
      mounted = false;
    };
  }, [usuario, authLoading]);

  const displayedOrders = orders.filter(order => {
    if (activeTab === "pedidos" && order.estado === "cancelado") return false;
    if (activeTab === "cancelados" && order.estado !== "cancelado")
      return false;
    if (activeTab === "comprar_nuevo" && order.estado === "cancelado")
      return false;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const matchId = order.id.toString().includes(term);
      const matchItem = order.items.some(item =>
        item.nombre_producto.toLowerCase().includes(term)
      );
      if (!matchId && !matchItem) return false;
    }
    return true;
  });

  if (authLoading || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f6f4ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B76E79]" />
      </div>
    );
  }

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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <HeaderClient user={usuario} />

      <main
        style={{
          flex: 1,
          maxWidth: 1000,
          width: "100%",
          margin: "0 auto",
          padding: "40px 20px",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: "clamp(2.8rem, 5.2vw, 5.2rem)",
              fontWeight: 400,
              color: "#4a5568",
              margin: "0 0 8px 0",
            }}
          >
            Mis{" "}
            <span style={{ color: "#b76e79", fontStyle: "italic" }}>
              Pedidos
            </span>
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              borderBottom: "1px solid rgba(112,128,144,0.18)",
              gap: 24,
            }}
          >
            <button
              onClick={() => setActiveTab("pedidos")}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === "pedidos"
                    ? "3px solid #b76e79"
                    : "3px solid transparent",
                padding: "8px 4px",
                fontSize: "0.95rem",
                fontWeight: activeTab === "pedidos" ? 600 : 500,
                color: activeTab === "pedidos" ? "#b76e79" : "#4a5568",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-sans, Inter, sans-serif)",
              }}
            >
              Pedidos
            </button>
            <button
              onClick={() => setActiveTab("comprar_nuevo")}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === "comprar_nuevo"
                    ? "3px solid #b76e79"
                    : "3px solid transparent",
                padding: "8px 4px",
                fontSize: "0.95rem",
                fontWeight: activeTab === "comprar_nuevo" ? 600 : 500,
                color: activeTab === "comprar_nuevo" ? "#b76e79" : "#4a5568",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-sans, Inter, sans-serif)",
              }}
            >
              Comprar de nuevo
            </button>
            <button
              onClick={() => setActiveTab("cancelados")}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === "cancelados"
                    ? "3px solid #b76e79"
                    : "3px solid transparent",
                padding: "8px 4px",
                fontSize: "0.95rem",
                fontWeight: activeTab === "cancelados" ? 600 : 500,
                color: activeTab === "cancelados" ? "#b76e79" : "#4a5568",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-sans, Inter, sans-serif)",
              }}
            >
              Pedidos cancelados
            </button>

            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                position: "relative",
                alignSelf: "center",
                paddingBottom: 6,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: "45%",
                  transform: "translateY(-50%)",
                }}
              >
                <Search size={14} color="#708090" />
              </div>
              <input
                placeholder="Buscar en pedidos"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  padding: "8px 14px 8px 34px",
                  fontSize: "0.85rem",
                  border: "1px solid rgba(112,128,144,0.25)",
                  borderRadius: 6,
                  outline: "none",
                  background: "#ffffff",
                  color: "#4a5568",
                  minWidth: 240,
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                }}
              />
              <button
                style={{
                  background: "#4a5568",
                  color: "#fff",
                  border: "none",
                  padding: "9px 16px",
                  borderRadius: "0 6px 6px 0",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  marginLeft: "-2px",
                }}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {activeTab === "pedidos" && !searchTerm && (
          <div style={{ marginBottom: 24 }}>
            <span
              style={{ fontSize: "0.9rem", color: "#4a5568", fontWeight: 600 }}
            >
              {displayedOrders.length} pedidos
            </span>
            <span style={{ fontSize: "0.9rem", color: "#708090" }}>
              {" "}
              realizados en tu cuenta.
            </span>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {displayedOrders.length > 0 ? (
            displayedOrders.map(order => (
              <OrderCard key={order.id} order={order} activeTab={activeTab} />
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#ffffff",
                borderRadius: 12,
                border: "1px dashed rgba(112,128,144,0.4)",
                marginTop: 20,
              }}
            >
              <ShoppingBag
                size={48}
                color="#b76e79"
                style={{ margin: "0 auto 16px auto", opacity: 0.5 }}
              />
              <h3
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                  fontSize: "1.5rem",
                  color: "#4a5568",
                  margin: "0 0 8px 0",
                }}
              >
                No encontramos pedidos
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans, Inter, sans-serif)",
                  color: "#708090",
                  marginBottom: 24,
                }}
              >
                {searchTerm
                  ? `No hay resultados para "${searchTerm}"`
                  : "Te invitamos a realizar tu primera compra en nuestra tienda."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() =>
                    (window.location.href = "/dashboard/cliente/catalogo")
                  }
                  style={{
                    padding: "10px 24px",
                    background: "#b76e79",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontFamily: "var(--font-sans, Inter, sans-serif)",
                    fontWeight: 500,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(183,110,121,0.2)",
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
