import { Producto } from "../type";
import { CreateProductoDTO, UpdateProductoDTO } from "@lib/models";
import ProductForm, { OpcionForm } from "./ProductForm";
import { FiX } from "react-icons/fi";

interface ProductModalProps {
  isOpen: boolean;
  producto?: Producto;
  categorias: any[];
  proveedores?: any[];
  insumos?: any[];
  onSubmit: (
    data: CreateProductoDTO | UpdateProductoDTO,
    imagenFile?: File,
    opciones?: OpcionForm[],
    relacionProveedor?: { id_proveedor: number; precio_compra: number; tiempo_entrega: number },
    insumosSeleccionados?: { id_insumo: number; cantidad_necesaria: number }[]
  ) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function ProductModal({
  isOpen,
  producto,
  categorias,
  proveedores = [],
  insumos = [],
  onSubmit,
  onClose,
  loading = false,
}: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#4a5568]/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container — responsive */}
      <div
        className="relative bg-[#f6f4ef] rounded-none sm:rounded-[24px] w-full z-10 flex flex-col overflow-hidden"
        style={{
          maxWidth: 'min(680px, 100vw)',
          height: '100dvh',
          maxHeight: '100dvh',
          // en desktop limitamos a 92vh
          ...(typeof window !== 'undefined' && window.innerWidth >= 640 ? { height: 'auto', maxHeight: '92vh' } : {}),
          boxShadow: "0 20px 56px rgba(140,151,104,0.22)",
          border: "1px solid rgba(112,128,144,0.18)"
        }}
      >
        {/* Header compacto pegado arriba */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[rgba(112,128,144,0.12)] flex-shrink-0">
          <div>
            <p className="text-[0.55rem] text-[#8c9768] font-bold uppercase tracking-widest">Stella ERP — Inventario</p>
            <h2 className="text-base font-black text-[#4a5568] leading-tight" style={{ fontFamily: "var(--font-display, Manrope, sans-serif)" }}>
              {producto ? "Editar" : "Nuevo"} <span className="text-[#b76e79]">Producto</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#708090] hover:bg-[rgba(112,128,144,0.08)] rounded-full transition-all"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Área scrollable del formulario */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          <ProductForm
            producto={producto}
            categorias={categorias}
            proveedores={proveedores}
            insumosDisponibles={insumos}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
