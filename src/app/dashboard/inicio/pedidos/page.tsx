"use client";

import { useState, useEffect } from "react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import PedidosStats from "./_components/PedidosStats";
import PedidosToolbar from "./_components/PedidosToolbar";
import PedidosTable from "./_components/PedidosTable";
import NuevoPedido from "./_components/NuevoPedido";
import { Pedido, PedidoEstado } from "./type";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, Plus, ShoppingBag, ClipboardList } from "lucide-react";

export default function PedidosPage() {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState<"LISTA" | "NUEVO">("LISTA");
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<PedidoEstado | "TODOS">("TODOS");
  const [search, setSearch] = useState("");

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/pedidos");
      const data = await resp.json();
      if (data.pedidos) setPedidos(data.pedidos);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario) cargarPedidos();
  }, [usuario]);

  const pedidosFiltrados = (pedidos || [])
    .filter((p) => filtro === "TODOS" || p.estado === filtro)
    .filter((p) => 
      !search || 
      p.id.toString().includes(search) || 
      p.usuario?.nombre?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">

          {/* HEADER */}
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Pedidos
              </span>
            </div>
          </header>

          {/* CARD PRINCIPAL */}
          <div className="relative rounded-3xl bg-white p-6 sm:p-8 md:p-10 space-y-8 border border-black/10 shadow-[0_30px_70px_rgba(0,0,0,0.12)]">
            
            {/* TABS DE NAVEGACIÓN */}
            <div className="flex bg-[#F6F4EF] p-1.5 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab("LISTA")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition duration-300 cursor-pointer ${
                  activeTab === "LISTA" 
                    ? "bg-white text-[#B76E79] shadow-sm scale-105" 
                    : "text-[#8C9796] hover:text-[#708090]"
                }`}
              >
                <ClipboardList size={18} />
                {usuario?.id_rol === 1 ? "Gestión de Pedidos" : "Mis Pedidos"}
              </button>
              {usuario?.id_rol === 3 && (
                <button
                  onClick={() => setActiveTab("NUEVO")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition duration-300 cursor-pointer ${
                    activeTab === "NUEVO" 
                      ? "bg-white text-[#B76E79] shadow-sm scale-105" 
                      : "text-[#8C9796] hover:text-[#708090]"
                  }`}
                >
                  <Plus size={18} />
                  Levantar Pedido
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin text-[#B76E79]" size={40} />
                <p className="text-[#8C9796] font-medium italic">Sincronizando pedidos...</p>
              </div>
            ) : activeTab === "LISTA" ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <PedidosStats pedidos={pedidosFiltrados} />
                
                <PedidosToolbar
                  filtro={filtro}
                  setFiltro={setFiltro}
                  search={search}
                  setSearch={setSearch}
                />

                <PedidosTable 
                  pedidos={pedidosFiltrados} 
                  usuario={usuario}
                  onStatusChange={cargarPedidos}
                />
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <NuevoPedido 
                  usuarioId={parseInt(usuario?.id || "0")} 
                  onSuccess={() => {
                    setActiveTab("LISTA");
                    cargarPedidos();
                  }} 
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}