"use client";

import { useState, useEffect } from "react";
import SideBarMenu from "@/app/_components/SideBarMenu";
import PedidosStats from "./_components/PedidosStats";
import PedidosToolbar from "./_components/PedidosToolbar";
import PedidosTable from "./_components/PedidosTable";
import NuevoPedido from "./_components/NuevoPedido";
import { Pedido, PedidoEstado } from "./type";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { Loader2, Plus, ClipboardList, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import Skeleton from "@/app/_components/ui/Skeleton";

function PedidosPageContent() {
  const { usuario } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"LISTA" | "NUEVO">("LISTA");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<PedidoEstado | "TODOS">("TODOS");
  const [search, setSearch] = useState("");
  const [showImportBanner, setShowImportBanner] = useState(false);

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

  useEffect(() => {
    if (searchParams.get("fromCart") === "true") {
      setActiveTab("NUEVO");
      setShowImportBanner(true);
      setTimeout(() => setShowImportBanner(false), 5000);
    }
  }, [searchParams]);

  const pedidosFiltrados = (pedidos || [])
    .filter((p) => filtro === "TODOS" || p.estado === filtro)
    .filter((p) => 
      !search || 
      p.id.toString().includes(search) || 
      p.usuario?.nombre?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--beige)" }}>
      <SideBarMenu />

      <main className="flex-1 px-4 sm:px-6 py-8 overflow-y-auto" style={{ background: "var(--beige)" }}>
        <div className="mx-auto max-w-[1440px] space-y-8">

          {/* HEADER */}
          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-12" style={{ background: "var(--rose-gold)" }} />
              <span className="text-xs tracking-[0.4em] uppercase font-medium" style={{ color: "var(--rose-gold)" }}>
                Pedidos
              </span>
            </div>

            {/* Banner Importación */}
            <AnimatePresence>
              {showImportBanner && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-0 right-0 border px-6 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-xl z-50 overflow-hidden"
                  style={{
                    background: "rgba(183,110,121,0.1)",
                    borderColor: "rgba(183,110,121,0.3)",
                    color: "var(--rose-gold)"
                  }}
                >
                  <div className="absolute inset-0 bg-white/40 pointer-events-none" />
                  <div className="relative flex items-center gap-3">
                     <Sparkles size={18} className="animate-pulse" />
                     <span className="text-sm font-bold tracking-wide">Artículos importados desde el carrito</span>
                     <button onClick={() => setShowImportBanner(false)} className="hover:bg-[#B76E79]/20 p-1 rounded-lg transition duration-200">
                        <X size={14} />
                     </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          <div 
            className="relative rounded-3xl p-6 sm:p-8 md:p-10 space-y-8 border"
            style={{
              background: "var(--white)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-md)"
            }}
          >
            
            {/* TABS DE NAVEGACIÓN */}
            <div className="flex p-1.5 rounded-2xl w-fit" style={{ background: "var(--beige-light)" }}>
              <button
                onClick={() => setActiveTab("LISTA")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition duration-300 cursor-pointer ${
                  activeTab === "LISTA" 
                    ? "bg-white shadow-sm scale-105" 
                    : "text-[#8C9796] hover:text-[#708090]"
                }`}
                style={{
                  color: activeTab === "LISTA" ? "var(--rose-gold)" : "var(--slate-light)"
                }}
              >
                <ClipboardList size={18} />
                {usuario?.id_rol === 1 ? "Gestión de Pedidos" : "Mis Pedidos"}
              </button>
              {usuario?.id_rol === 3 && (
                <button
                  onClick={() => setActiveTab("NUEVO")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition duration-300 cursor-pointer ${
                    activeTab === "NUEVO" 
                      ? "bg-white shadow-sm scale-105" 
                      : "text-[#8C9796] hover:text-[#708090]"
                  }`}
                  style={{
                    color: activeTab === "NUEVO" ? "var(--rose-gold)" : "var(--slate-light)"
                  }}
                >
                  <Plus size={18} />
                  Levantar Pedido
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col gap-6">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                  <Skeleton height={100} borderRadius={16} />
                  <Skeleton height={100} borderRadius={16} />
                  <Skeleton height={100} borderRadius={16} />
                </div>
                <Skeleton height={400} borderRadius={20} />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "LISTA" ? (
                    <div className="space-y-6">
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
                    <NuevoPedido 
                      usuarioId={usuario?.id as unknown as string | number} 
                      onSuccess={() => {
                        setActiveTab("LISTA");
                        cargarPedidos();
                      }} 
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PedidosPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center" style={{ background: "var(--beige)" }}>
        <div className="flex flex-col items-center gap-4">
          <Skeleton width={120} height={120} borderRadius="50%" />
          <Skeleton width={150} height={20} />
        </div>
      </div>
    }>
      <PedidosPageContent />
    </Suspense>
  );
}