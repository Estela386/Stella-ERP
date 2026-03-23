import { useState, useEffect } from "react";
import { Producto } from "../type";
import { CreateProductoDTO, UpdateProductoDTO } from "@lib/models";
import { IProductoOpcion } from "@lib/models";

export interface OpcionForm {
  nombre: string;
  tipo: IProductoOpcion["tipo"];
  obligatorio: boolean;
  valores: string[];
}

interface ProductFormProps {
  producto?: Producto;
  categorias: any[];
  onSubmit: (
    data: CreateProductoDTO | UpdateProductoDTO,
    imagenFile?: File,
    opciones?: OpcionForm[]
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
    costo_mayorista: producto?.costo_mayorista || 0,
    stock_actual: producto?.stock_actual || 0,
    stock_min: producto?.stock_min || 0,
    tiempo: producto?.tiempo || 0,
    id_categoria: producto?.id_categoria || categorias[0]?.id || 0,
    es_personalizable: producto?.es_personalizable || false,
    descripcion: producto?.descripcion || "",
  });

  const [opciones, setOpciones] = useState<OpcionForm[]>([]);
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    producto?.url_imagen || null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingOpciones, setLoadingOpciones] = useState(false);

  // ── Opciones ────────────────────────────────────────────────────
  const agregarOpcion = () => {
    setOpciones(prev => [
      ...prev,
      { nombre: "", tipo: "select", obligatorio: false, valores: [] },
    ]);
  };

  const eliminarOpcion = (i: number) => {
    setOpciones(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateOpcion = (i: number, field: keyof OpcionForm, value: any) => {
    setOpciones(prev =>
      prev.map((op, idx) => (idx === i ? { ...op, [field]: value } : op))
    );
  };

  const agregarValor = (i: number) => {
    setOpciones(prev =>
      prev.map((op, idx) =>
        idx === i ? { ...op, valores: [...op.valores, ""] } : op
      )
    );
  };

  const updateValor = (opIdx: number, valIdx: number, value: string) => {
    setOpciones(prev =>
      prev.map((op, idx) =>
        idx === opIdx
          ? {
              ...op,
              valores: op.valores.map((v, vi) => (vi === valIdx ? value : v)),
            }
          : op
      )
    );
  };

  const eliminarValor = (opIdx: number, valIdx: number) => {
    setOpciones(prev =>
      prev.map((op, idx) =>
        idx === opIdx
          ? { ...op, valores: op.valores.filter((_, vi) => vi !== valIdx) }
          : op
      )
    );
  };

  // ── Handlers base ───────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = [
      "precio",
      "costo",
      "costo_mayorista",
      "stock_actual",
      "stock_min",
      "tiempo",
    ];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        imagen: "La imagen no puede ser mayor a 5MB",
      }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors(prev => ({
        ...prev,
        imagen: "El archivo debe ser una imagen",
      }));
      return;
    }
    setImagenFile(file);
    const reader = new FileReader();
    reader.onload = e => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
    setErrors(prev => ({ ...prev, imagen: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim())
      newErrors.nombre = "El nombre del producto es requerido";
    if (formData.precio < 0)
      newErrors.precio = "El precio no puede ser negativo";
    if (formData.costo < 0) newErrors.costo = "El costo no puede ser negativo";
    if (formData.precio < formData.costo)
      newErrors.precio = "El precio no puede ser menor al costo";
    if (formData.stock_actual < 0)
      newErrors.stock_actual = "El stock actual no puede ser negativo";
    if (formData.stock_min < 0)
      newErrors.stock_min = "El stock mínimo no puede ser negativo";
    if (imagenFile) {
      if (imagenFile.size > 5 * 1024 * 1024)
        newErrors.imagen = "La imagen no puede ser mayor a 5MB";
      else if (!imagenFile.type.startsWith("image/"))
        newErrors.imagen = "El archivo debe ser una imagen";
    }
    if (formData.es_personalizable) {
      opciones.forEach((op, i) => {
        if (!op.nombre.trim())
          newErrors[`opcion_${i}`] = "El nombre de la opción es requerido";
        if (op.tipo !== "text" && op.valores.length === 0)
          newErrors[`valores_${i}`] = "Agrega al menos un valor";
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await onSubmit(formData, imagenFile || undefined, opciones);
    } catch (error) {
      console.error("Error al guardar producto:", error);
    }
  };
  useEffect(() => {
    if (!producto?.id) return;

    const cargarOpciones = async () => {
      try {
        setLoadingOpciones(true);
        console.log("Cargando opciones para producto ID:", producto.id);
        const res = await fetch(`/api/productos/${producto.id}/opciones`);
        const data = await res.json();

        if (!res.ok || !data.opciones) return;

        const opcionesMapeadas: OpcionForm[] = data.opciones.map((op: any) => ({
          nombre: op.nombre,
          tipo: op.tipo,
          obligatorio: op.obligatorio,
          valores: op.valores?.map((v: any) => v.valor) ?? [],
        }));

        setOpciones(opcionesMapeadas);
      } catch (err) {
        console.error("Error cargando opciones:", err);
      } finally {
        setLoadingOpciones(false);
      }
    };

    cargarOpciones();
  }, [producto?.id]);

  // ── Render ──────────────────────────────────────────────────────
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

      {/* Precio y Costo */}
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

      {/* Costo Mayorista */}
      <div>
        <label
          htmlFor="costo_mayorista"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Costo Mayorista
        </label>
        <input
          type="number"
          id="costo_mayorista"
          name="costo_mayorista"
          value={formData.costo_mayorista}
          onChange={handleChange}
          disabled={loading}
          step="0.01"
          className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
          placeholder="0.00"
        />
      </div>

      {/* Descripción */}
      <div>
        <label
          htmlFor="descripcion"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={e => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
          }}
          disabled={loading}
          rows={3}
          className="text-gray-700 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B76E79] resize-none"
          placeholder="Describe el producto..."
        />
      </div>

      {/* Stock Actual y Stock Mínimo */}
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

      {/* Imagen */}
      <div>
        <label
          htmlFor="imagen"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Imagen del Producto
        </label>
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

      {/* Checkbox personalizable */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="es_personalizable"
          name="es_personalizable"
          checked={formData.es_personalizable}
          onChange={handleCheckboxChange}
          disabled={loading}
          className="w-5 h-5 cursor-pointer accent-[#B76E79] rounded"
        />
        <label
          htmlFor="es_personalizable"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          Este producto es personalizable
        </label>
      </div>

      {/* Sección de personalización */}

      {formData.es_personalizable && (
        <div className="border border-[#B76E79]/30 rounded-xl p-4 space-y-4 bg-rose-50/40">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Opciones de personalización
            </h3>
            <button
              type="button"
              onClick={agregarOpcion}
              className="text-sm px-3 py-1.5 bg-[#B76E79] text-white rounded-lg hover:bg-[#a05a65] transition"
            >
              + Agregar opción
            </button>
          </div>
          {loadingOpciones ? (
            <div className="flex items-center justify-center py-6 gap-2 text-sm text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#B76E79]" />
              Cargando opciones...
            </div>
          ) : opciones.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No hay opciones. Haz clic en "Agregar opción" para comenzar.
            </p>
          ) : null}
          {opciones.map((op, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
            >
              <div className="flex gap-3 items-start">
                {/* Nombre */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Nombre (ej: Color, Talla)"
                    value={op.nombre}
                    onChange={e => updateOpcion(i, "nombre", e.target.value)}
                    className={`text-gray-700 w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79] ${
                      errors[`opcion_${i}`]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors[`opcion_${i}`] && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors[`opcion_${i}`]}
                    </p>
                  )}
                </div>

                {/* Tipo */}
                <select
                  value={op.tipo}
                  onChange={e => updateOpcion(i, "tipo", e.target.value)}
                  className="text-gray-700 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
                >
                  <option value="select">Selección</option>
                  <option value="text">Texto libre</option>
                  <option value="number">Número</option>
                </select>

                {/* Obligatorio */}
                <label className="flex items-center gap-1.5 text-sm text-gray-600 whitespace-nowrap pt-2">
                  <input
                    type="checkbox"
                    checked={op.obligatorio}
                    onChange={e =>
                      updateOpcion(i, "obligatorio", e.target.checked)
                    }
                    className="accent-[#B76E79]"
                  />
                  Obligatorio
                </label>

                {/* Eliminar opción */}
                <button
                  type="button"
                  onClick={() => eliminarOpcion(i)}
                  className="text-red-400 hover:text-red-600 pt-2 text-lg leading-none"
                  title="Eliminar opción"
                >
                  ✕
                </button>
              </div>

              {/* Valores */}
              {op.tipo !== "text" && (
                <div className="space-y-2 pl-1">
                  <p className="text-xs text-gray-500 font-medium">
                    Valores posibles:
                  </p>
                  {op.valores.map((v, j) => (
                    <div key={j} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder={`Valor ${j + 1}`}
                        value={v}
                        onChange={e => updateValor(i, j, e.target.value)}
                        className="text-gray-700 flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
                      />
                      <button
                        type="button"
                        onClick={() => eliminarValor(i, j)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {errors[`valores_${i}`] && (
                    <p className="text-xs text-red-600">
                      {errors[`valores_${i}`]}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => agregarValor(i)}
                    className="text-xs text-[#B76E79] hover:underline"
                  >
                    + Agregar valor
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Botones */}
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
