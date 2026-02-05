"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductoRow from "./ProductRow";

type ProductoConsignacion = {
  id: number;
  producto: string;
  cantidad: number;
  precio: number;
};

export default function NuevaConsignacionForm() {
  const router = useRouter();

  const [cliente, setCliente] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [productos, setProductos] = useState<ProductoConsignacion[]>([
    { id: Date.now(), producto: "", cantidad: 0, precio: 0 },
  ]);

  const agregarProducto = () => {
    setProductos(prev => [
      ...prev,
      { id: Date.now() + Math.random(), producto: "", cantidad: 0, precio: 0 },
    ]);
  };

  const eliminarProducto = (id: number) => {
    setProductos(prev => prev.filter(p => p.id !== id));
  };

  const actualizarProducto = (
    id: number,
    campo: keyof Omit<ProductoConsignacion, "id">,
    valor: string | number
  ) => {
    setProductos(prev =>
      prev.map(p => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ cliente, fechaInicio, fechaFin, productos });
    router.push("/consignaciones");
  };

  const inputBase = `
    w-full
    rounded-lg
    px-4 py-2
    bg-white
    border border-[#8c8c76]
    shadow-inner
    focus:outline-none
    focus:ring-2
    focus:ring-[#708090]/40
  `;

  return (
    <div className="min-h-screen bg-[#f6f4ef] p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 space-y-10 shadow-[0_12px_30px_rgba(140,140,118,0.18)]">
        <form onSubmit={onSubmit} className="space-y-10">
          {/* Cliente */}
          <section>
            <h2 className="text-lg font-semibold text-[#708090] mb-4">
              Información del cliente
            </h2>

            <div className="bg-[#f6f4ef] rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-[#708090] mb-2">
                Cliente / Mayorista
              </label>
              <input
                className={inputBase}
                placeholder="Seleccionar cliente"
                value={cliente}
                onChange={e => setCliente(e.target.value)}
                required
              />
            </div>
          </section>

          {/* Fechas */}
          <section>
            <h2 className="text-lg font-semibold text-[#708090] mb-4">
              Periodo de consignación
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#f6f4ef] rounded-xl p-6 shadow-sm">
              <div>
                <label className="block text-sm font-medium text-[#708090] mb-2">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  className={inputBase}
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#708090] mb-2">
                  Fecha fin
                </label>
                <input
                  type="date"
                  className={inputBase}
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          {/* Productos */}
          <section>
            <h2 className="text-lg font-semibold text-[#708090] mb-4">
              Productos en consignación
            </h2>

            <div className="space-y-4">
              {productos.map(p => (
                <ProductoRow
                  key={p.id}
                  data={p}
                  onChange={actualizarProducto}
                  onDelete={eliminarProducto}
                  disableDelete={productos.length === 1}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={agregarProducto}
              className="
                px-6 py-2 rounded-lg
                bg-[#708090]
                text-[#f6f4ef]
                font-medium
                shadow-[0_6px_18px_rgba(183,110,121,0.4)]
                hover:translate-y-[-1px]
                transition
              "
            >
              + Agregar otro producto
            </button>
          </section>

          {/* Acciones */}
          <div className="flex justify-end gap-4 pt-6 border-t border-[#e5e5e0]">
            <button
              type="button"
              onClick={() => router.push("/dashboard/consignaciones")}
              className="
                px-6 py-2 rounded-lg
                bg-[#708090]
                text-[#f6f4ef]
                font-medium
                shadow-[0_6px_18px_rgba(183,110,121,0.4)]
                hover:translate-y-[-1px]
                transition
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="
                px-6 py-2 rounded-lg
                bg-[#b76e79]
                text-[#f6f4ef]
                font-medium
                shadow-[0_6px_18px_rgba(183,110,121,0.4)]
                hover:translate-y-[-1px]
                transition
              "
            >
              Guardar consignación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
