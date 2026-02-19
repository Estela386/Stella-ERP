import { useState } from "react";
import { CreateCategoriaDTO } from "@lib/models";

interface CategoryFormProps {
  onSubmit: (data: CreateCategoriaDTO) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CategoryForm({
  onSubmit,
  onCancel,
  loading = false,
}: CategoryFormProps) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    if (!nombre.trim()) {
      setError("El nombre de la categoría es requerido");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({ nombre: nombre.trim() });
      setNombre("");
    } catch (err) {
      console.error("Error al guardar categoría:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nombre de la Categoría
        </label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={handleChange}
          disabled={loading}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ej: Anillos, Pulseras, Collares"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#B76E79] text-white py-2 rounded-lg hover:bg-[#a05a65] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
        >
          {loading ? "Guardando..." : "Crear Categoría"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
