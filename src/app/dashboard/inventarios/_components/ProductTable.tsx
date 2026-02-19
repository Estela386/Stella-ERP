import { Producto } from "../type";
import ProductRow from "./ProductRow";

interface Props {
  productos: Producto[];
  search: string;
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: number) => void;
}

export default function ProductTable({
  productos,
  search,
  onEdit,
  onDelete,
}: Props) {
  const productosFiltrados = productos.filter(p => {
    const term = search.toLowerCase();

    return (
      p.nombre.toLowerCase().includes(term) ||
      p.id.toString().includes(term) ||
      p.categoria.nombre.toLowerCase().includes(term)
    );
  });

  return (
    <div
      className="
        bg-white
        rounded-xl
        border border-[#8C9796]/30
        overflow-x-auto
      "
    >
      <table className="min-w-full text-sm text-[#111111]">
        {/* HEADER */}
        <thead className="bg-[#D1BBAA]/35">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-[#708090]">
              Código
            </th>
            <th className="px-4 py-3 text-left font-medium text-[#708090]">
              Nombre
            </th>
            <th className="px-4 py-3 font-medium text-[#708090]">Categoría</th>
            <th className="px-4 py-3 font-medium text-[#708090]">Stock</th>
            <th className="px-4 py-3 font-medium text-[#708090]">Precio</th>
            <th className="px-4 py-3 font-medium text-[#708090]">Estado</th>
            <th className="px-4 py-3 font-medium text-[#708090]">Ubicación</th>
            <th className="px-4 py-3 text-right font-medium text-[#708090]">
              Acciones
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="divide-y divide-[#8C9796]/20">
          {productosFiltrados.map(p => (
            <ProductRow
              key={p.id}
              producto={p}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {productosFiltrados.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center text-[#708090]">
                No se encontraron productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
