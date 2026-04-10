"use client";

import { useState, useEffect, useMemo } from "react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import MaterialsStats from "./_components/MaterialsStats";
import MaterialsToolbar from "./_components/MaterialsToolbar";
import MaterialsGrid from "./_components/MaterialsGrid";
import NewMaterialModal from "./_components/NewMaterialModal";
import SuppliersModal from "./_components/SuppliersModal";
import { createClient } from "@utils/supabase/client";
import { InsumoService } from "@/lib/services/InsumoService";
import { Insumo, UpdateInsumoDTO } from "@lib/models";
import { useAuth } from "@lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

export default function MaterialsPage() {
  const router = useRouter();
  const { usuario, loading: loadingUser } = useAuth();

  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<"TODOS" | "BAJO" | "AGOTADO">("TODOS");
  const [categoryFilter, setCategoryFilter] = useState("TODAS");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);

  // 🔐 Validación admin
  useEffect(() => {
    if (!loadingUser && usuario && !usuario.esAdmin()) {
      router.push("/dashboard/cliente");
    }
  }, [usuario, loadingUser, router]);

  // 📦 Cargar insumos
  useEffect(() => {
    const cargarInsumos = async () => {
      if (!usuario || !usuario.esAdmin()) return;

      try {
        setLoading(true);
        const supabase = createClient();
        const insumoService = new InsumoService(supabase);

        const { insumos: data, error } =
          await insumoService.obtenerTodos();

        if (error) {
          setError(error);
          return;
        }

        setInsumos(data || []);
      } catch {
        setError("Error cargando materiales");
      } finally {
        setLoading(false);
      }
    };

    if (!loadingUser) {
      cargarInsumos();
    }
  }, [usuario, loadingUser]);

  // 🔄 ACTUALIZAR MATERIAL
  const actualizarMaterial = async (materialActualizado: Insumo) => {
    const supabase = createClient();
    const insumoService = new InsumoService(supabase);

    const { id, ...rest } = materialActualizado;

    const data: UpdateInsumoDTO = {
      nombre: rest.nombre,
      tipo: rest.tipo,
      precio: rest.precio,
      cantidad: rest.cantidad,
      unidad_medida: rest.unidad_medida,
      stock_minimo: rest.stock_minimo,
      id_proveedor: rest.id_proveedor,
      activo: rest.activo,
    };

    const { insumo, error } = await insumoService.actualizar(id, data);

    if (error || !insumo) {
      alert("Error actualizando material");
      return;
    }

    setInsumos(prev =>
      prev.map(m =>
        m.id === insumo.id ? insumo : m
      )
    );
  };

  // 🗑️ ELIMINAR MATERIAL
  const eliminarMaterial = async (id: number) => {
    const supabase = createClient();
    const insumoService = new InsumoService(supabase);

    const { success, error } = await insumoService.eliminar(id);

    if (error || !success) {
      alert("Error eliminando material: " + error);
      return;
    }

    setInsumos(prev => prev.filter(m => m.id !== id));
  };

  // 🏷️ Obtener categorías únicas para el filtro
  const categories = useMemo(() => {
    const types = insumos.map(m => m.tipo).filter(Boolean);
    return Array.from(new Set(types)).sort();
  }, [insumos]);

  // 🔎 Filtros combinados
  const filtrados = useMemo(() => {
    return insumos
      .filter(m => {
        // Filtrar por nombre
        const matchesSearch = m.nombre.toLowerCase().includes(search.toLowerCase());
        
        // Filtrar por estado de stock
        let matchesStatus = true;
        if (filtro === "BAJO") matchesStatus = m.cantidad > 0 && m.cantidad < (m.stock_minimo || 5);
        if (filtro === "AGOTADO") matchesStatus = m.cantidad === 0;

        // Filtrar por categoría
        const matchesCategory = categoryFilter === "TODAS" || m.tipo === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      });
  }, [insumos, search, filtro, categoryFilter]);

  if (loadingUser || loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#F6F3EF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#b76e79]/20 border-t-[#b76e79] rounded-full animate-spin" />
          <p className="text-[#708090] font-serif tracking-widest text-sm uppercase">Cargando Galería de Insumos...</p>
        </div>
      </section>
    );
  }

  if (!usuario || !usuario.esAdmin()) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="relative min-h-screen">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b76e79]/5 rounded-full blur-3xl -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8c9768]/5 rounded-full blur-3xl -ml-64 -mb-64" />

          <div className="relative z-10 mx-auto max-w-7xl px-8 py-12 space-y-12">
            
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[rgba(112,128,144,0.1)] pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="h-[1px] w-12 bg-[#b76e79]" />
                  <span className="text-[0.7rem] font-bold text-[#8c9768] uppercase tracking-[0.3em] font-sans">
                    Gestión de insumos  
                  </span>
                </div>
                <h1 className="text-5xl font-bold text-[#4a5568] font-serif" style={{ fontFamily: "var(--font-marcellus)" }}>
                  Galería de <span className="text-[#b76e79]">Insumos</span>
                </h1>
              </div>

              <div className="flex flex-col items-end gap-2">
                 <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white shadow-sm">
                    <p className="text-[0.6rem] font-bold text-[#708090] uppercase tracking-widest mb-1">Última Actualización</p>
                    <p className="text-xs font-bold text-[#4a5568]">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                 </div>
              </div>
            </header>

            {/* Content Area */}
            <div className="space-y-10">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-[20px] font-sans text-sm flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  {error}
                </div>
              )}

              {/* Stats Grid */}
              <MaterialsStats
                materiales={insumos}
                onFilter={setFiltro}
                activeFilter={filtro}
              />

              {/* Advanced Toolbar */}
              <div className="bg-white/40 backdrop-blur-md p-1 rounded-[32px] border border-white/60 shadow-xl">
                <div className="bg-white p-8 rounded-[28px] shadow-sm border border-[rgba(112,128,144,0.05)]">
                  <MaterialsToolbar
                    search={search}
                    setSearch={setSearch}
                    onNewMaterial={() => setShowModal(true)}
                    onManageSuppliers={() => setShowSuppliersModal(true)}
                    categories={categories}
                    selectedCategory={categoryFilter}
                    setSelectedCategory={setCategoryFilter}
                  />
                </div>
              </div>

              {/* Results Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <p className="text-[0.7rem] font-bold text-[#708090] uppercase tracking-[0.1em]">
                    Resultados: <span className="text-[#b76e79]">{filtrados.length}</span> Insumos Encontrados
                  </p>
                </div>
                
                {filtrados.length > 0 ? (
                  <MaterialsGrid
                    materiales={filtrados}
                    onUpdate={actualizarMaterial}
                    onDelete={eliminarMaterial}
                  />
                ) : (
                  <div className="py-24 flex flex-col items-center justify-center gap-4 bg-white/30 rounded-[32px] border-2 border-dashed border-[rgba(112,128,144,0.1)]">
                    <div className="p-6 rounded-full bg-[#F6F4EF] text-[#b76e79]/30">
                      <Package size={48} strokeWidth={1} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-bold text-[#4a5568] font-serif">No se encontraron materiales</p>
                      <p className="text-sm text-[#708090]">Intenta ajustar los filtros de búsqueda o categoría.</p>
                    </div>
                    <button 
                      onClick={() => { setSearch(""); setCategoryFilter("TODAS"); setFiltro("TODOS"); }}
                      className="mt-4 text-[#b76e79] text-[0.7rem] font-bold uppercase tracking-widest hover:underline"
                    >
                      Limpiar todos los filtros
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <NewMaterialModal
          onClose={() => setShowModal(false)}
          onCreated={(nuevo) =>
            setInsumos(prev => [...prev, nuevo])
          }
        />
      )}

      {showSuppliersModal && (
        <SuppliersModal
          onClose={() => setShowSuppliersModal(false)}
        />
      )}
    </div>
  );
}