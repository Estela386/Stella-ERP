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

export default function MaterialsPage() {
  const router = useRouter();
  const { usuario, loading: loadingUser } = useAuth();

  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<"TODOS" | "BAJO" | "AGOTADO">("TODOS");
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

  // 🔎 Filtros
  const filtrados = useMemo(() => {
    return insumos
      .filter(m =>
        m.nombre.toLowerCase().includes(search.toLowerCase())
      )
      .filter(m => {
        if (filtro === "BAJO") return m.cantidad > 0 && m.cantidad < (m.stock_minimo || 5);
        if (filtro === "AGOTADO") return m.cantidad === 0;
        return true;
      });
  }, [insumos, search, filtro]);

  if (loadingUser || loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando materiales...</p>
      </section>
    );
  }

  if (!usuario || !usuario.esAdmin()) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 px-8 py-10 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-10">

          <header className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#b76e79]" />
              <span className="text-[0.65rem] tracking-[0.18em] uppercase text-[#8c9768] font-medium font-sans">
                Inventario
              </span>
            </div>
          </header>

          <div className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-sans text-sm">
                {error}
              </div>
            )}

            <MaterialsStats
              materiales={insumos}
              onFilter={setFiltro}
            />

            <MaterialsToolbar
              search={search}
              setSearch={setSearch}
              onNewMaterial={() => setShowModal(true)}
              onManageSuppliers={() => setShowSuppliersModal(true)}
            />

            <MaterialsGrid
              materiales={filtrados}
              onUpdate={actualizarMaterial}
            />

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