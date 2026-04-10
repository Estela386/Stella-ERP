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
import Skeleton from "@/app/_components/ui/Skeleton";

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
      <section className="min-h-screen flex items-center justify-center" style={{ background: "var(--beige)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%", maxWidth: 1200, padding: 40 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
             <Skeleton width={150} height={40} borderRadius={12} />
           </div>
           <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
             <Skeleton height={140} borderRadius={24} />
             <Skeleton height={140} borderRadius={24} />
             <Skeleton height={140} borderRadius={24} />
             <Skeleton height={140} borderRadius={24} />
           </div>
           <Skeleton height={500} borderRadius={24} />
        </div>
      </section>
    );
  }

  if (!usuario || !usuario.esAdmin()) return null;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--beige)" }}>
      <SidebarMenu />

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto" style={{ background: "var(--beige)" }}>
        <div className="relative min-h-screen">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b76e79]/5 rounded-full blur-3xl -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8c9768]/5 rounded-full blur-3xl -ml-64 -mb-64" />

          <div className="mx-auto max-w-[1440px] space-y-10">
            
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="h-px w-12" style={{ background: "var(--rose-gold)" }} />
                  <span className="text-xs tracking-[0.4em] uppercase font-medium" style={{ color: "var(--rose-gold)", fontFamily: "var(--font-marcellus)" }}>
                    Gestión de insumos  
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold" style={{ color: "var(--charcoal)", fontFamily: "var(--font-marcellus)" }}>
                  Galería de <span style={{ color: "var(--rose-gold)" }}>Insumos</span>
                </h1>
              </div>

              <div className="flex flex-col items-end gap-2">
                 <div className="px-4 py-2 rounded-2xl border" style={{ background: "var(--white)", borderColor: "var(--border-subtle)" }}>
                    <p className="text-[0.6rem] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--slate-light)" }}>Última Actualización</p>
                    <p className="text-xs font-bold" style={{ color: "var(--charcoal)" }}>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                 </div>
              </div>
            </header>

            {/* Content Area */}
            <div className="space-y-10">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-3xl text-sm flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
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
              <div 
                className="p-8 rounded-3xl border"
                style={{
                  background: "var(--white)",
                  borderColor: "var(--border-subtle)",
                  boxShadow: "var(--shadow-md)"
                }}
              >
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

              {/* Results Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <p className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: "var(--slate-light)" }}>
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
                  <div className="py-24 flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed" style={{ borderColor: "var(--border-subtle)", background: "rgba(255,255,255,0.2)" }}>
                    <div className="p-8 rounded-full" style={{ background: "var(--beige-light)", color: "var(--rose-gold)" }}>
                      <Package size={64} strokeWidth={1} />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xl font-bold" style={{ color: "var(--charcoal)", fontFamily: "var(--font-marcellus)" }}>No se encontraron materiales</p>
                      <p className="text-sm" style={{ color: "var(--slate-light)" }}>Intenta ajustar los filtros de búsqueda o categoría.</p>
                    </div>
                    <button 
                      onClick={() => { setSearch(""); setCategoryFilter("TODAS"); setFiltro("TODOS"); }}
                      className="mt-6 text-[0.7rem] font-bold uppercase tracking-widest hover:underline"
                      style={{ color: "var(--rose-gold)" }}
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