import { Producto } from "../type";
import ProductRow from "./ProductRow";

interface Props {
  productos: Producto[];
  search: string;
  filtro: "todos" | "bajo" | "agotados";
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: number) => void;
}

export default function ProductTable({
  productos,
  search,
  filtro,
  onEdit,
  onDelete,
}: Props) {
  // FILTRO POR ESTADO
  let productosFiltrados = productos.filter(p => {
    if (filtro === "bajo")
      return p.stock_actual <= p.stock_min && p.stock_actual > 0;

    if (filtro === "agotados") return p.stock_actual === 0;

    return true;
  });

  // FILTRO POR BÚSQUEDA
  productosFiltrados = productosFiltrados.filter(p => {
    const term = search.toLowerCase();
    const nombre = p.nombre?.toLowerCase() || "";
    const categoria = p.categoria.nombre.toLowerCase();

    return (
      nombre.includes(term) ||
      p.id.toString().includes(term) ||
      categoria.includes(term)
    );
  });

  return (
    <div className="bg-white rounded-xl border border-[#8C9796]/30 overflow-x-auto">
      <table className="min-w-full text-sm text-[#111111]">
        <thead className="bg-[#D1BBAA]/35">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Código</th>
            <th className="px-4 py-3 text-left font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Nombre</th>
            <th className="px-4 py-3 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Categoría</th>
            <th className="px-4 py-3 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Tipo</th>
            <th className="px-4 py-3 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Stock</th>
            <th className="px-4 py-3 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Precio</th>
            <th className="px-4 py-3 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Costo</th>
            <th className="px-4 py-3 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Costo Mayorista</th>
            <th className="px-4 py-3 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Estado</th>
            <th className="px-4 py-3 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Personalizable</th>
            <th className="px-4 py-3 text-right font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Acciones</th>
          </tr>
        </thead>

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
              <td colSpan={11} className="px-4 py-6 text-center text-[#708090]" style={{ fontFamily: "var(--font-sans)" }}>
                No se encontraron productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
