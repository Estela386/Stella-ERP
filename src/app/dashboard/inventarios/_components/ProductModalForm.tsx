import { Producto } from "../type";
import { CreateProductoDTO, UpdateProductoDTO } from "@lib/models";
import ProductForm from "./ProductForm";

interface ProductModalProps {
  isOpen: boolean;
  producto?: Producto;
  categorias: any[];
  onSubmit: (data: CreateProductoDTO | UpdateProductoDTO) => Promise<void>;
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
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto z-50">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <ProductForm
          producto={producto}
          categorias={categorias}
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </>
  );
}
