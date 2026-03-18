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
    router.push("/dashboard/inicio/consignaciones");
  };

  // 🎨 INPUT ESTILO PROFESIONAL
  const inputBase = `
    w-full
    h-11
    rounded-xl
    px-4
    bg-[#F8F6F2]

    border border-[#8C9796]/25
    text-[#1C1C1C]
    placeholder:text-[#9A9A9A]

    focus:outline-none
    focus:border-[#B76E79]
    focus:ring-2
    focus:ring-[#B76E79]/30

    transition
  `;

  const sectionCard = `
    space-y-4
    bg-white
    p-6
    rounded-2xl
    border border-black/5
    shadow-sm
  `;

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-5xl">

      {/* ================= CLIENTE ================= */}
      <section className={sectionCard}>
        <h2 className="text-lg font-medium text-[#708090]">
          Información del cliente
        </h2>

        <div>
          <label className="block text-sm font-medium text-[#708090] mb-1">
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

      {/* ================= FECHAS ================= */}
      <section className={sectionCard}>
        <h2 className="text-lg font-medium text-[#708090]">
          Periodo de consignación
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#708090] mb-1">
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
            <label className="block text-sm font-medium text-[#708090] mb-1">
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

      {/* ================= PRODUCTOS ================= */}
      <section className={sectionCard}>
        <h2 className="text-lg font-medium text-[#708090]">
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
            px-6 py-3 rounded-xl
            bg-[#708090]
            text-[#F6F4EF]
            font-medium
            hover:opacity-90
            transition
          "
        >
          + Agregar otro producto
        </button>
      </section>

      {/* ================= BOTONES ================= */}
      <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-black/10">
        <button
          type="button"
          onClick={() => router.push("/dashboard/inicio/consignaciones")}
          className="
            px-6 py-3 rounded-xl
            bg-[#708090]
            text-[#F6F4EF]
            font-medium
            hover:opacity-90
            transition
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="
            px-6 py-3 rounded-xl
            bg-[#B76E79]
            text-white
            font-medium
            hover:bg-[#A45F69]
            transition
          "
        >
          Guardar
        </button>
      </div>

    </form>
  );
}