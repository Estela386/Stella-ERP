"use client";

import { useState, useEffect, useMemo } from "react";
import SidebarMenu from "@/app/_components/SideBarMenu";
import MaterialsStats from "./_components/MaterialsStats";
import MaterialsToolbar from "./_components/MaterialsToolbar";
import MaterialsGrid from "./_components/MaterialsGrid";
import NewMaterialModal from "./_components/NewMaterialModal";
import { createClient } from "@utils/supabase/client";
import { InsumoService } from "@/lib/services/InsumoService";
import { Insumo, UpdateInsumoDTO } from "@lib/models/Insumo";
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

  // 🔄 ACTUALIZAR MATERIAL (CORREGIDO)
  const actualizarMaterial = async (materialActualizado: Insumo) => {
    const supabase = createClient();
    const insumoService = new InsumoService(supabase);

    const { id, ...rest } = materialActualizado;

    const data: UpdateInsumoDTO = {
      nombre: rest.nombre,
      tipo: rest.tipo,
      precio: rest.precio,
      cantidad: rest.cantidad,
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
        if (filtro === "BAJO") return m.cantidad > 0 && m.cantidad < 5;
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

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6">

          <header className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Materiales
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-medium leading-tight text-[#708090]">
              Inventario de materia prima
            </h1>
          </header>

          <div className="relative rounded-3xl bg-white p-10 space-y-6 border border-black/10 shadow-[0_30px_70px_rgba(0,0,0,0.12)]">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
    </div>
  );
}