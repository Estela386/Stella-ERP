"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarMenu from "@/app/_components/SideBarMenu";
import InventoryStats from "./_components/InventoryStats";
import InventoryToolbar from "./_components/InventoryToolbar";
import ProductTable from "./_components/ProductTable";
import ProductModalForm from "./_components/ProductModalForm";
import CategoryModal from "./_components/CategoryModal";
import LabelPrintModal from "./_components/LabelPrintModal";
import { Producto } from "./type";
import { type OpcionForm } from "./_components/ProductForm";
import { FileText } from "lucide-react";

import {
  ProductoService,
  ImageUploadService,
  ProductoPersonalizacionService,
  ProductoProveedorService,
  ProveedorService,
  InsumoService,
  ProductoInsumoService,
  MaterialService,
  ProductoMaterialService,
} from "@lib/services";
import { CategoriaService } from "@lib/services";
import { createClient } from "@utils/supabase/client";
import { useAuth } from "@lib/hooks/useAuth";
import {
  CreateProductoDTO,
  UpdateProductoDTO,
  CreateCategoriaDTO,
  ICategoria,
  IProveedor,
  IInsumo,
} from "@lib/models";
import { type IMaterial } from "@lib/services/MaterialService";

export default function InventariosPage() {
  const router = useRouter();
  const { usuario, loading: loadingUser } = useAuth();
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [proveedores, setProveedores] = useState<IProveedor[]>([]);
  const [insumos, setInsumos] = useState<IInsumo[]>([]);
  const [materiales, setMateriales] = useState<IMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<
    Producto | undefined
  >();
  const [formLoading, setFormLoading] = useState(false);
  const [filtro, setFiltro] = useState<"todos" | "bajo" | "agotados">("todos");

  // Verificar rol en cliente
  useEffect(() => {
    if (!loadingUser && usuario && !usuario.esAdmin()) {
      router.push("/dashboard/cliente");
      // console.log("Acceso denegado: no es administrador");
      console.log("USUARIO:", usuario);
    }
  }, [usuario, loadingUser, router]);

  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario || !usuario.esAdmin()) return;

      try {
        setLoading(true);
        const supabase = createClient();

        // Cargar productos
        const productoService = new ProductoService(supabase);
        const { productos: productosData, error: errorProductos } =
          await productoService.obtenerTodos();

        if (errorProductos) {
          setError(errorProductos);
          return;
        }

        // Cargar categorías
        const categoriaService = new CategoriaService(supabase);
        const { categorias: categoriasData, error: errorCategorias } =
          await categoriaService.obtenerTodas();

        if (errorCategorias) {
          setError(errorCategorias);
          return;
        }

        // Cargar proveedores
        const proveedorService = new ProveedorService(supabase);
        const { proveedores: proveedoresData, error: errorProveedores } =
          await proveedorService.obtenerTodos();
        
        if (errorProveedores) {
          setError(errorProveedores);
          return;
        }
        
        // Cargar insumos
        const insumoService = new InsumoService(supabase);
        const { insumos: insumosData, error: errorInsumos } = await insumoService.obtenerTodos();

        if (errorInsumos) {
          setError(errorInsumos);
          return;
        }

        // Cargar materiales
        const materialService = new MaterialService(supabase);
        const { materiales: materialesData, error: errorMateriales } = await materialService.obtenerTodos();

        if (errorMateriales) {
          setError(errorMateriales);
          return;
        }

        // Transformar productos a incluir la categoría
        if (productosData && categoriasData) {
          const productosConCategoria = productosData.map(p => {
            const cat = categoriasData.find(c => c.id === p.id_categoria);
            return {
              id: p.id,
              nombre: p.nombre || "",
              precio: p.precio || 0,
              costo: p.costo || 0,
              costo_mayorista: p.costo_mayorista || 0,
              stock_actual: p.stock_actual || 0,
              stock_min: p.stock_min || 0,
              tiempo: p.tiempo || 0,
              url_imagen: p.url_imagen,
              id_categoria: p.id_categoria,
              es_personalizable: p.es_personalizable,
              descripcion: p.descripcion || "",
              tipo: p.tipo,
              categoria: cat
                ? { id: cat.id, nombre: cat.nombre }
                : { id: 0, nombre: "Sin categoría" },
            } as Producto;
          });
          setProductos(productosConCategoria as unknown as Producto[]);
        }

        setCategorias(categoriasData || []);
        setProveedores(proveedoresData || []);
        setInsumos(insumosData || []);
        setMateriales(materialesData || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!loadingUser) {
      cargarDatos();
    }
  }, [usuario, loadingUser]);

  const handleOpenModal = (producto?: Producto) => {
    setSelectedProducto(producto);
    setModalOpen(true);
  };

  const handleOpenCategoryModal = () => {
    setCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setCategoryModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProducto(undefined);
  };
  // Helper para convertir OpcionForm al formato del servicio
  const mapOpcionesParaServicio = (opciones: OpcionForm[]) =>
    opciones.map(({ nombre, tipo, obligatorio, valores }) => ({
      opcion: { nombre, tipo, obligatorio },
      valores,
    }));
  const handleSubmitForm = async (
    data: CreateProductoDTO | UpdateProductoDTO,
    imagenFile?: File,
    opciones?: OpcionForm[],
    relacionProveedor?: { id_proveedor: number; precio_compra: number; tiempo_entrega: number },
    insumosSeleccionados?: { id_insumo: number; cantidad_necesaria: number }[],
    materialesSeleccionados?: number[],
    id_actualizar?: number
  ) => {
    try {
      setFormLoading(true);
      const supabase = createClient();
      const productoService = new ProductoService(supabase);
      const categoriaService = new CategoriaService(supabase);
      const imageUploadService = new ImageUploadService(supabase);
      const personalizacionService = new ProductoPersonalizacionService(supabase);
      const productoProveedorService = new ProductoProveedorService(supabase);
      const productoInsumoService = new ProductoInsumoService(supabase);
      const productoMaterialService = new ProductoMaterialService(supabase);

      let urlImagen: string | undefined = undefined;

      if (imagenFile) {
        const { url, error: uploadError } =
          await imageUploadService.uploadImage(
            imagenFile,
            selectedProducto?.id
          );
        if (uploadError) {
          setError(uploadError);
          return;
        }
        urlImagen = url || undefined;
      }

      const dataConImagen = urlImagen
        ? { ...data, url_imagen: urlImagen }
        : data;

      const targetId = id_actualizar || selectedProducto?.id;

      if (targetId) {
        // ── Actualizar ──────────────────────────────────────────────
        const { producto: productoActualizado, error } =
          await productoService.actualizar(
            targetId,
            dataConImagen as UpdateProductoDTO
          );

        if (error) {
          setError(error);
          return;
        } // ← verificar error ANTES de guardar opciones

        // Luego en ambos bloques (actualizar y crear):
        // Sincronizar Opciones de Personalización (Elimina anteriores y guarda nuevas)
        // Se llama siempre que sea personalizable, o si deja de serlo para limpiar
        if (data.es_personalizable) {
          await personalizacionService.guardarOpcionesProducto(
            targetId,
            mapOpcionesParaServicio(opciones || [])
          );
        } else {
          const personalizacionSvc = new ProductoPersonalizacionService(supabase);
          await personalizacionSvc.eliminarOpcionesDeProducto(targetId);
        }

        // Guardar relación proveedor si es revendido
        if (data.tipo === "revendido" && relacionProveedor) {
          const provResult = await productoProveedorService.guardarRelacion({
            id_producto: targetId,
            id_proveedor: relacionProveedor.id_proveedor,
            precio_compra: relacionProveedor.precio_compra,
            tiempo_entrega: relacionProveedor.tiempo_entrega,
          });
          if (provResult?.error) console.error("Error guardando proveedor:", provResult.error);
        } else if (data.tipo === "fabricado") {
          // Si cambia de revendido a fabricado, eliminar relación proveedor
          await productoProveedorService.eliminarPorProducto(targetId);
        }

        // Guardar insumos: siempre, ya sea lista llena o vacía (para borrar al cambiar tipo)
        const insumosParaGuardar = data.tipo === "fabricado" ? (insumosSeleccionados ?? []) : [];
        const insumoResult = await productoInsumoService.guardarInsumosProducto(targetId, insumosParaGuardar);
        if (insumoResult && !insumoResult.success) console.error("Error guardando insumos:", insumoResult.error);

        // Guardar materiales
        if (materialesSeleccionados) {
          const materialResult = await productoMaterialService.guardarRelaciones(targetId, materialesSeleccionados);
          if (!materialResult.success) console.error("Error guardando materiales:", materialResult.error);
        }

        const { categorias: categoriasData } =
          await categoriaService.obtenerTodas();
        const cat = categoriasData?.find(
          c => c.id === productoActualizado?.id_categoria
        );

        setProductos(prev =>
          prev.map(p =>
            p.id === targetId
              ? {
                  id: productoActualizado?.id || targetId,
                  nombre: productoActualizado?.nombre || "",
                  precio: productoActualizado?.precio || 0,
                  costo: productoActualizado?.costo || 0,
                  costo_mayorista: productoActualizado?.costo_mayorista || 0,
                  stock_actual: productoActualizado?.stock_actual || 0,
                  stock_min: productoActualizado?.stock_min || 0,
                  tiempo: productoActualizado?.tiempo,
                  url_imagen: productoActualizado?.url_imagen,
                  id_categoria: productoActualizado?.id_categoria,
                  es_personalizable: productoActualizado?.es_personalizable,
                  descripcion: productoActualizado?.descripcion || "",
                  tipo: productoActualizado?.tipo || "fabricado",
                  categoria: cat
                    ? { id: cat.id, nombre: cat.nombre || "" }
                    : { id: 0, nombre: "Sin categoría" },
                }
              : p
          )
        );
      } else {
        // ── Crear ───────────────────────────────────────────────────
        const { producto: productoNuevo, error } = await productoService.crear(
          dataConImagen as CreateProductoDTO
        );

        if (error) {
          setError(error);
          return;
        } // ← verificar error ANTES de guardar opciones

        // Guardar opciones usando el id del producto recién creado
        if (data.es_personalizable && opciones?.length && productoNuevo?.id) {
          await personalizacionService.guardarOpcionesProducto(
            productoNuevo.id,
            mapOpcionesParaServicio(opciones)
          );
        }

        // Guardar relación proveedor si es revendido
        if (data.tipo === "revendido" && relacionProveedor && productoNuevo?.id) {
          const provResult = await productoProveedorService.guardarRelacion({
            id_producto: productoNuevo.id,
            id_proveedor: relacionProveedor.id_proveedor,
            precio_compra: relacionProveedor.precio_compra,
            tiempo_entrega: relacionProveedor.tiempo_entrega,
          });
          if (provResult?.error) console.error("Error guardando proveedor:", provResult.error);
        }

        // Guardar insumos siempre (lista vacía si es revendido, para limpiar)
        if (productoNuevo?.id) {
          const insumosParaGuardar = data.tipo === "fabricado" ? (insumosSeleccionados ?? []) : [];
          const insumoResult = await productoInsumoService.guardarInsumosProducto(productoNuevo.id, insumosParaGuardar);
          if (insumoResult && !insumoResult.success) console.error("Error guardando insumos:", insumoResult.error);
          
          if (materialesSeleccionados) {
            const materialResult = await productoMaterialService.guardarRelaciones(productoNuevo.id, materialesSeleccionados);
            if (!materialResult.success) console.error("Error guardando materiales:", materialResult.error);
          }
        }

        const { categorias: categoriasData } =
          await categoriaService.obtenerTodas();
        const cat = categoriasData?.find(
          c => c.id === productoNuevo?.id_categoria
        );

        setProductos(prev => [
          ...prev,
          {
            id: productoNuevo?.id || 0,
            nombre: productoNuevo?.nombre || "",
            precio: productoNuevo?.precio || 0,
            costo: productoNuevo?.costo || 0,
            costo_mayorista: productoNuevo?.costo_mayorista || 0,
            stock_actual: productoNuevo?.stock_actual || 0,
            stock_min: productoNuevo?.stock_min || 0,
            tiempo: productoNuevo?.tiempo,
            url_imagen: productoNuevo?.url_imagen,
            id_categoria: productoNuevo?.id_categoria,
            es_personalizable: productoNuevo?.es_personalizable,
            descripcion: productoNuevo?.descripcion || "",
            tipo: productoNuevo?.tipo || "fabricado",
            categoria: cat
              ? { id: cat.id, nombre: cat.nombre || "" }
              : { id: 0, nombre: "Sin categoría" },
          },
        ]);
      }

      handleCloseModal();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar producto"
      );
      console.error("Error guardando producto:", err);
    } finally {
      setFormLoading(false);
    }
  };
  const handleDeleteProducto = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    try {
      setFormLoading(true);
      const supabase = createClient();
      const productoService = new ProductoService(supabase);

      const { error } = await productoService.eliminar(id);

      if (error) {
        setError(error);
        return;
      }

      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar producto"
      );
      console.error("Error eliminando producto:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateCategory = async (data: CreateCategoriaDTO) => {
    try {
      setFormLoading(true);
      const supabase = createClient();
      const categoriaService = new CategoriaService(supabase);

      const { categoria: categoriaNueva, error } =
        await categoriaService.crear(data);

      if (error) {
        setError(error);
        return;
      }

      if (categoriaNueva) {
        setCategorias(prev => [...prev, categoriaNueva]);
      }

      handleCloseCategoryModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear categoría");
      console.error("Error creando categoría:", err);
    } finally {
      setFormLoading(false);
    }
  };

  // Mostrar carga mientras se verifica el usuario
  if (loadingUser || loading) {
    return (
      <section className="min-h-screen bg-[#F8F6F2] px-8 py-14 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B76E79] mx-auto mb-4" />
          <p className="text-gray-600" style={{ fontFamily: "var(--font-sans)" }}>Cargando inventario...</p>
        </div>
      </section>
    );
  }

  // Verificar acceso
  if (!usuario || !usuario.esAdmin()) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F3EF]">
      <SidebarMenu />

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl space-y-10">
          {/* Header */}
          <header className="space-y-6">
            {/* Línea editorial */}
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[#B76E79]" />
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium" style={{ fontFamily: "var(--font-marcellus)" }}>
                Inventarios
              </span>
            </div>
            {/* Subtle divider */}
            <div className="h-px w-full bg-black/5" />
          </header>

          {/* Card principal */}
          <div
            className="
              relative
              rounded-3xl
              bg-white
              p-4 md:p-8
              space-y-8
              border border-black/10
              shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            "
          >
            {/* Accent line */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-[#b76e79]" />

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" style={{ fontFamily: "var(--font-sans)" }}>
                {error}
              </div>
            )}

            <InventoryStats productos={productos} onFilterChange={setFiltro} />

            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
              <div className="w-full lg:w-auto">
                <InventoryToolbar search={search} setSearch={setSearch} />
              </div>
              <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
                <button
                  onClick={handleOpenCategoryModal}
                  className="
                    flex-1 lg:flex-none justify-center
                    bg-[#B76E79]
                    text-white
                    px-4 py-2.5
                    rounded-full
                    text-xs sm:text-sm font-medium
                    shadow-sm  
                    hover:bg-[#A45F69]
                    hover:shadow-md
                    transition
                  "
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  + Categoría
                </button>
                <button
                  onClick={() => setLabelModalOpen(true)}
                  className="
                    flex-1 lg:flex-none justify-center
                    bg-[#B76E79]
                    text-white
                    px-4 py-2.5
                    rounded-full
                    text-xs sm:text-sm font-medium
                    shadow-sm
                    hover:bg-[#A45F69]
                    hover:shadow-md
                    transition
                    flex items-center gap-2
                  "
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Imprimir Etiquetas</span>
                  <span className="sm:hidden">Etiquetas</span>
                </button>
                <button
                  onClick={() => handleOpenModal()}
                  className="
                    flex-1 lg:flex-none justify-center
                    bg-[#B76E79]
                    text-white
                    px-4 py-2.5
                    rounded-full
                    text-xs sm:text-sm font-medium
                    shadow-sm
                    hover:bg-[#A45F69]
                    hover:shadow-md
                    transition
                    whitespace-nowrap
                  "
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  + Producto
                </button>
              </div>
            </div>

            <ProductTable
              productos={productos}
              search={search}
              onEdit={handleOpenModal}
              onDelete={handleDeleteProducto}
              filtro={filtro}
            />
          </div>
        </div>
      </main>

      {/* Modal de Producto */}
      <ProductModalForm
        isOpen={modalOpen}
        producto={selectedProducto}
        categorias={categorias}
        proveedores={proveedores}
        insumos={insumos}
        materiales={materiales}
        onSubmit={handleSubmitForm}
        onClose={handleCloseModal}
        loading={formLoading}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onSubmit={handleCreateCategory}
        onClose={handleCloseCategoryModal}
        loading={formLoading}
      />

      {/* Modal de Etiquetas */}
      <LabelPrintModal
        isOpen={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        productos={productos}
      />
    </div>
  );
}
