import { Producto } from "../type";
import { CreateProductoDTO, UpdateProductoDTO } from "@lib/models";
import ProductForm, { OpcionForm } from "./ProductForm";
import { FiX } from "react-icons/fi";

interface ProductModalProps {
  isOpen: boolean;
  producto?: Producto;
  categorias: any[];
  onSubmit: (
    data: CreateProductoDTO | UpdateProductoDTO,
    imagenFile?: File,
    opciones?: OpcionForm[]
  ) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function ProductModal({
  isOpen,
  producto,
  categorias,
  onSubmit,
  onClose,
  loading = false,
}: ProductModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 duration-300 animate-in fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#4a5568]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-[32px] shadow-[0_30px_80px_rgba(140,151,104,0.35)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-[rgba(112,128,144,0.12)] z-10">
        
        {/* Header Decor */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#b76e79] via-[#ede9e3] to-[#8c9768]/30" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-[#708090] hover:bg-[#f6f4ef] rounded-full transition-all z-20 group"
        >
          <FiX size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-10 pt-12">
          <header className="mb-10 space-y-1">
            <p className="text-[#8c9768] text-[0.7rem] font-bold uppercase tracking-[0.25em] font-sans">
              Sistema de Gestión
            </p>
            <h2 className="text-4xl font-sans font-bold text-[#4a5568] tracking-tight">
              {producto ? "Editar" : "Nuevo"} <em className="text-[#b76e79] not-italic">Producto</em>
            </h2>
          </header>

          <ProductForm
            producto={producto}
            categorias={categorias}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
