import { Consignacion, Usuario } from "../type";
import ProductRow from "./ProductRow";

export default function ProductTable({
  consignaciones,
  usuario,
}: {
  consignaciones: Consignacion[];
  usuario: Usuario;
}) {
  return (
    <div className="space-y-4">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden border border-[#8c9796]">
          <thead className="bg-[#D1BBAA] border-b border-[#8c8c76]">
            <tr>
              <th className="p-3 text-center text-sm font-semibold text-[#4a5d6b]">
                Producto
              </th>

              {usuario.rol === "admin" && (
                <th className="p-3 text-center text-sm font-semibold text-[#4a5d6b]">
                  Cliente
                </th>
              )}

              <th className="p-3 text-center text-sm font-semibold text-[#4a5d6b]">
                Cantidad
              </th>

              <th className="p-3 text-center text-sm font-semibold text-[#4a5d6b]">
                Periodo
              </th>

              <th className="p-3 text-center text-sm font-semibold text-[#4a5d6b]">
                Precio
              </th>

              <th className="p-3 text-center text-sm font-semibold text-[#4a5d6b]">
                Estado
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-[#e3e0da]">
            {consignaciones.map(c => (
              <ProductRow key={c.id} consignacion={c} usuario={usuario} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {consignaciones.map(c => (
          <div
            key={c.id}
            className="
              rounded-xl
              p-4
              space-y-2
              bg-white
              border border-[#8c8c76]
            "
          >
            <p className="font-medium text-[#2f2f2f]">{c.producto.nombre}</p>

            <p className="text-sm text-[#708090]">
              Cliente: {c.cliente.nombre}
            </p>

            <p className="text-sm text-[#2f2f2f]">Cantidad: {c.cantidad}</p>

            <p className="text-sm text-[#2f2f2f]">
              Periodo: {c.fecha_inicio} → {c.fecha_fin ?? "-"}
            </p>

            <p className="text-sm font-semibold text-[#4a5d6b]">
              ${c.precio_consignado}
            </p>

            <span
              className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                c.estado === "ACTIVA"
                  ? "bg-[#708090] text-[#f6f4ef]"
                  : "bg-[#b76e79] text-[#f6f4ef]"
              }`}
            >
              {c.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
