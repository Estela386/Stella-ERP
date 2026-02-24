import { useState } from "react";
import { Material } from "../type";

type Uso = {
  id: number;
  producto: string;
  cantidadUsada: number;
};

type Props = {
  material: Material;
  onClose: () => void;
};

export default function MaterialModal({ material, onClose }: Props) {
  const [form, setForm] = useState(material);

  const usosMock: Uso[] = [
    { id: 1, producto: "Anillo Oro", cantidadUsada: 2 },
    { id: 2, producto: "Pulsera Elegante", cantidadUsada: 1.5 },
    { id: 3, producto: "Collar Perlas", cantidadUsada: 3 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

      <div className="bg-white rounded-3xl w-full max-w-3xl p-8 shadow-xl space-y-8">

        {/* TITULO */}
        <h2 className="text-3xl font-semibold text-[#708090]">
          Detalles del material
        </h2>

        {/* 📦 DATOS DEL MATERIAL */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#708090]">
              Nombre
            </label>
            <input
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="
                w-full
                rounded-xl
                border border-[#8C9796]/40
                bg-[#F8F6F2]
                px-4 py-2.5
                text-[#1C1C1C]
                placeholder:text-[#8C9796]
                focus:outline-none
                focus:ring-2 focus:ring-[#B76E79]
              "
            />
          </div>

          {/* Tipo */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#708090]">
              Tipo
            </label>
            <input
              value={form.tipo}
              onChange={e => setForm({ ...form, tipo: e.target.value })}
              className="w-full rounded-xl border border-[#8C9796]/40 bg-[#F8F6F2] px-4 py-2.5 text-[#1C1C1C] focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>

          {/* Precio */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#708090]">
              Precio por unidad
            </label>
            <input
              type="number"
              value={form.precio}
              onChange={e => setForm({ ...form, precio: Number(e.target.value) })}
              className="w-full rounded-xl border border-[#8C9796]/40 bg-[#F8F6F2] px-4 py-2.5 text-[#1C1C1C] focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>

          {/* Stock */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#708090]">
              Stock disponible
            </label>
            <input
              type="number"
              value={form.cantidad}
              onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })}
              className="w-full rounded-xl border border-[#8C9796]/40 bg-[#F8F6F2] px-4 py-2.5 text-[#1C1C1C] focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>

        </section>

        {/* 📊 TABLA */}
        <section className="space-y-3">

          <h3 className="text-lg font-semibold text-[#708090]">
            Artículos que utilizan este material
          </h3>

          <div className="overflow-hidden rounded-2xl border border-[#8C9796]/40">
            <table className="w-full text-sm text-[#708090]">

              <thead className="bg-[#708090] text-white">
                <tr>
                  <th className="text-left px-5 py-3">
                    Artículo
                  </th>
                  <th className="text-center px-5 py-3">
                    Cantidad por pieza
                  </th>
                </tr>
              </thead>

              <tbody>
                {usosMock.map((u, i) => (
                  <tr
                    key={u.id}
                    className={`
                      border-t
                      ${i % 2 === 0 ? "bg-[#F8F6F2]" : "bg-white"}
                      hover:bg-[#F6F3EF]
                    `}
                  >
                    <td className="px-5 py-3 font-medium">
                      {u.producto}
                    </td>

                    <td className="px-5 py-3 text-center font-bold text-[#B76E79]">
                      {u.cantidadUsada} g
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

        </section>

        {/* BOTONES */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="
              px-6 py-2.5
              rounded-full
              border border-[#8C9796]/40
              text-[#708090]
              hover:bg-[#F6F3EF]
            "
          >
            Cancelar
          </button>

          <button
            className="
              bg-[#B76E79]
              text-white
              px-6 py-2.5
              rounded-full
              font-medium
              hover:bg-[#A45F69]
            "
          >
            Guardar cambios
          </button>

        </div>

      </div>
    </div>
  );
}