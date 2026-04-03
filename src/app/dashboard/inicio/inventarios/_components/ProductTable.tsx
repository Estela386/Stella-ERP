import { Producto } from "../type";
import ProductRow from "./ProductRow";
import StockBadge from "./StockBadge";
import { Package, Pencil, Trash2, Tag, Layers } from "lucide-react";

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
    <div className="bg-white rounded-2xl border border-[#8C9796]/30 overflow-hidden shadow-sm">
      {/* ── DESKTOP VIEW ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm text-[#111111]">
          <thead className="bg-[#D1BBAA]/35">
            <tr>
              <th className="px-4 py-4 text-left font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Código</th>
              <th className="px-4 py-4 text-left font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Nombre</th>
              <th className="px-4 py-4 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Categoría</th>
              <th className="px-4 py-4 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Tipo</th>
              <th className="px-4 py-4 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Stock</th>
              <th className="px-4 py-4 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Precio</th>
              <th className="px-4 py-4 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Costo</th>
              <th className="px-4 py-4 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Mayorista</th>
              <th className="px-4 py-4 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Estado</th>
              <th className="px-4 py-4 font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Personal.</th>
              <th className="px-4 py-4 text-right font-medium text-[#708090]" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em", fontWeight: 700 }}>Acciones</th>
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
                <td colSpan={11} className="px-4 py-12 text-center text-[#708090]" style={{ fontFamily: "var(--font-sans)" }}>
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE VIEW ── */}
      <div className="md:hidden flex flex-col gap-4 p-4 bg-[#F8F6F4]/50">
        {productosFiltrados.length === 0 && (
          <div className="py-10 text-center text-[#708090] bg-white rounded-2xl border border-black/5 flex flex-col items-center justify-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
            <Package className="opacity-30 mb-2" size={32} />
            No se encontraron productos
          </div>
        )}
        
        {productosFiltrados.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#8C9796]/20 flex flex-col gap-4 relative overflow-hidden transition-all hover:shadow-md">
            {/* Margen decorativo superior */}
            <div className={`absolute top-0 inset-x-0 h-1.5 transition-colors ${p.tipo === 'fabricado' ? 'bg-[#8c9768]' : 'bg-[#b76e79]'}`} />
            
            {/* Header: Nombre & Badge */}
            <div className="flex justify-between items-start z-10 gap-2 pt-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#8C9796] font-bold uppercase tracking-widest font-sans mb-1">
                  JOY-{p.id}
                </span>
                <span className="font-bold text-[#1C1C1C] text-lg leading-tight" style={{ fontFamily: "var(--font-marcellus)" }}>
                  {p.nombre}
                </span>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-[#708090]" style={{ fontFamily: "var(--font-sans)" }}>
                  <Tag size={12} className="opacity-60 text-[#b76e79]" /> {p.categoria.nombre}
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="h-px w-full bg-black/5" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 z-10">
              <div className="flex flex-col bg-[#F8F6F4] p-3.5 rounded-xl border border-black/5">
                <span className="text-[9px] text-[#8C9796] uppercase font-bold tracking-widest mb-1.5">Precio Público</span>
                <span className="text-base font-bold text-[#b76e79]" style={{ fontFamily: "var(--font-marcellus)" }}>${p.precio?.toFixed(2)}</span>
              </div>
              <div className="flex flex-col bg-[#F8F6F4] p-3.5 rounded-xl border border-black/5">
                <span className="text-[9px] text-[#8C9796] uppercase font-bold tracking-widest mb-1.5">Stock</span>
                <div className="flex items-center mt-auto">
                  <StockBadge actual={p.stock_actual} minimo={p.stock_min} />
                </div>
              </div>
            </div>

            {/* Badges Info */}
            <div className="flex flex-wrap gap-2 z-10">
              <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                p.tipo === "fabricado" 
                  ? "bg-[#8c9768]/15 text-[#8c9768]" 
                  : "bg-[#b76e79]/15 text-[#b76e79]"
              }`} style={{ fontFamily: "var(--font-sans)" }}>
                {p.tipo === "fabricado" ? "Fabricado" : "Revendido"}
              </span>
              {p.es_personalizable && (
                <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#1C1C1C] text-white" style={{ fontFamily: "var(--font-sans)" }}>
                  Personalizable
                </span>
              )}
            </div>

            {/* Separador */}
            <div className="h-px w-full bg-black/5" />

            {/* Acciones */}
            <div className="flex gap-2 z-10">
              <button
                className="flex-1 flex justify-center items-center gap-2 py-3 rounded-xl bg-[#F6F4EF] text-[#708090] hover:bg-[#b76e79] hover:text-white transition font-bold text-[11px] uppercase tracking-wider shadow-sm"
                style={{ fontFamily: "var(--font-sans)" }}
                onClick={() => onEdit?.(p)}
              >
                <Pencil size={15} /> Editar
              </button>
              <button
                className="flex-none px-5 flex justify-center items-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition border border-red-200/50 shadow-sm"
                onClick={() => onDelete?.(p.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
