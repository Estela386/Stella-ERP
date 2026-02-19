import { useState, useEffect } from "react";
import { Producto } from "../type";
import { CreateProductoDTO, UpdateProductoDTO } from "@lib/models";

interface ProductFormProps {
  producto?: Producto;
  categorias: any[];
  onSubmit: (
    data: CreateProductoDTO | UpdateProductoDTO,
    imagenFile?: File
  ) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProductForm({
  producto,
  categorias,
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    nombre: producto?.nombre || "",
    precio: producto?.precio || 0,
    costo: producto?.costo || 0,
    stock_actual: producto?.stock_actual || 0,
    stock_min: producto?.stock_min || 0,
    tiempo: producto?.tiempo || 0,
    id_categoria: producto?.id_categoria || categorias[0]?.id || 0,
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    producto?.url_imagen || null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "nombre" ? value : parseFloat(value) || 0,
    }));
    // Limpiar error cuando el usuario empieza a editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Archivo seleccionado:", file);
    if (file) {
      // Validar tamaño
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imagen: "La imagen no puede ser mayor a 5MB",
        }));
        return;
      }

      // Validar tipo
      if (!file.type.startsWith("image/")) {
        setErrors(prev => ({
          ...prev,
          imagen: "El archivo debe ser una imagen",
        }));
        return;
      }

      setImagenFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, imagen: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del producto es requerido";
    }
    if (formData.precio < 0) {
      newErrors.precio = "El precio no puede ser negativo";
    }
    if (formData.costo < 0) {
      newErrors.costo = "El costo no puede ser negativo";
    }
    if (formData.precio < formData.costo) {
      newErrors.precio = "El precio no puede ser menor al costo";
    }
    if (formData.stock_actual < 0) {
      newErrors.stock_actual = "El stock actual no puede ser negativo";
    }
    if (formData.stock_min < 0) {
      newErrors.stock_min = "El stock mínimo no puede ser negativo";
    }
    // validar imagen solo si se seleccionó una nueva
    if (imagenFile) {
      if (imagenFile.size > 5 * 1024 * 1024) {
        newErrors.imagen = "La imagen no puede ser mayor a 5MB";
      } else if (!imagenFile.type.startsWith("image/")) {
        newErrors.imagen = "El archivo debe ser una imagen";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData, imagenFile || undefined);
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Nombre del Producto
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          disabled={loading}
          className={`text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] ${
            errors.nombre ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ej: Anillo Solitario Diamante"
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <label
          htmlFor="id_categoria"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Categoría
        </label>
        <select
          id="id_categoria"
          name="id_categoria"
          value={formData.id_categoria}
          onChange={handleChange}
          disabled={loading}
          className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
        >
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id} className="text-gray-700">
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Precio y Costo - en una fila */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="costo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Costo
          </label>
          <input
            type="number"
            id="costo"
            name="costo"
            value={formData.costo}
            onChange={handleChange}
            disabled={loading}
            step="0.01"
            className={`text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] ${
              errors.costo ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
          />
          {errors.costo && (
            <p className="mt-1 text-sm text-red-600">{errors.costo}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="precio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Precio
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            disabled={loading}
            step="0.01"
            className={`text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] ${
              errors.precio ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
          />
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
          )}
        </div>
      </div>

      {/* Stock Actual y Stock Mínimo - en una fila */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="stock_actual"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Stock Actual
          </label>
          <input
            type="number"
            id="stock_actual"
            name="stock_actual"
            value={formData.stock_actual}
            onChange={handleChange}
            disabled={loading}
            className={`text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] ${
              errors.stock_actual ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0"
          />
          {errors.stock_actual && (
            <p className="mt-1 text-sm text-red-600">{errors.stock_actual}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="stock_min"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Stock Mínimo
          </label>
          <input
            type="number"
            id="stock_min"
            name="stock_min"
            value={formData.stock_min}
            onChange={handleChange}
            disabled={loading}
            className={`text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] ${
              errors.stock_min ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0"
          />
          {errors.stock_min && (
            <p className="mt-1 text-sm text-red-600">{errors.stock_min}</p>
          )}
        </div>
      </div>

      {/* Imagen del Producto */}
      <div>
        <label
          htmlFor="imagen"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Imagen del Producto
        </label>

        {/* Preview */}
        {previewUrl && (
          <div className="mb-4 relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                setImagenFile(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input File */}
        <input
          type="file"
          id="imagen"
          name="imagen"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading}
          className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#B76E79] file:text-white hover:file:bg-[#a05a65]"
        />
        {errors.imagen && (
          <p className="mt-1 text-sm text-red-600">{errors.imagen}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Máximo 5MB. Formatos: JPG, PNG, WebP
        </p>
      </div>

      {/* Tiempo */}
      <div>
        <label
          htmlFor="tiempo"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Tiempo (días)
        </label>
        <input
          type="number"
          id="tiempo"
          name="tiempo"
          value={formData.tiempo}
          onChange={handleChange}
          disabled={loading}
          className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
          placeholder="0"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer flex-1 bg-[#B76E79] text-white py-2 rounded-lg hover:bg-[#a05a65] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
        >
          {loading
            ? "Guardando..."
            : producto
              ? "Actualizar Producto"
              : "Crear Producto"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="cursor-pointer flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
