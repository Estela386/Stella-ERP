import { CreateCategoriaDTO } from "@lib/models";
import CategoryForm from "./CategoryForm";

interface CategoryModalProps {
  isOpen: boolean;
  onSubmit: (data: CreateCategoriaDTO) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export default function CategoryModal({
  isOpen,
  onSubmit,
  onClose,
  loading = false,
}: CategoryModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full z-50">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Nueva Categoría
        </h2>

        <CategoryForm
          onSubmit={onSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </>
  );
}
