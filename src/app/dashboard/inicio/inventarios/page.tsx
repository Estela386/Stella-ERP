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
import ConfirmationModal from "../_components/ConfirmationModal";
import { Producto } from "./type";
import { type OpcionForm } from "./_components/ProductForm";
import { FileText } from "lucide-react";
import Skeleton from "@/app/_components/ui/Skeleton";
import { motion } from "framer-motion";

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

  // Estado para el modal de confirmación de eliminación
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: 0,
    nombre: "",
  });

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
        // console.log("Productos cargados:", productosData);

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
        const { insumos: insumosData, error: errorInsumos } =
          await insumoService.obtenerTodos();

        if (errorInsumos) {
          setError(errorInsumos);
          return;
        }

        // Cargar materiales
        const materialService = new MaterialService(supabase);
        const { materiales: materialesData, error: errorMateriales } =
          await materialService.obtenerTodos();

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
              imagenes: p.imagenes || [],
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
    imagenesNuevasFiles?: File[],
    imagenesAEliminar?: number[],
    ordenImagenesExistentes?: number[],
    opciones?: OpcionForm[],
    relacionProveedor?: {
      id_proveedor: number;
      precio_compra: number;
      tiempo_entrega: number;
    },
    insumosSeleccionados?: { id_insumo: number; cantidad_necesaria: number }[],
    materialesSeleccionados?: number[],
    id_actualizar?: number
  ) => {
    try {
      setFormLoading(true);
      const supabase = createClient();
      const productoService = new ProductoService(supabase);
      const categoriaService = new CategoriaService(supabase);
      const personalizacionService = new ProductoPersonalizacionService(
        supabase
      );
      const productoProveedorService = new ProductoProveedorService(supabase);
      const productoInsumoService = new ProductoInsumoService(supabase);
      const productoMaterialService = new ProductoMaterialService(supabase);

      const targetId = id_actualizar || selectedProducto?.id;
      let productoOperado: any = null;

      // ── 1. CREAR O ACTUALIZAR PRODUCTO BASE ──────────────────────
      if (targetId) {
        const { producto: productoActualizado, error } =
          await productoService.actualizar(targetId, data as UpdateProductoDTO);
        if (error) {
          setError(error);
          return;
        }
        productoOperado = productoActualizado;
      } else {
        const { producto: productoNuevo, error } = await productoService.crear(
          data as CreateProductoDTO
        );
        if (error) {
          setError(error);
          return;
        }
        productoOperado = productoNuevo;
      }

      const idProductoFinal = productoOperado.id;

      // ── 2. PROCESAR GALERÍA DE IMÁGENES ──────────────────────────
      if (idProductoFinal) {
        // A. Eliminar imágenes marcadas
        if (imagenesAEliminar && imagenesAEliminar.length > 0) {
          // Buscamos las URLs en la BD para poder borrarlas del Storage
          const { data: imgsToDelete } = await supabase
            .from("producto_imagenes")
            .select("id, url_imagen")
            .in("id", imagenesAEliminar);

          if (imgsToDelete) {
            for (const img of imgsToDelete) {
              await productoService.eliminarImagenProducto(
                img.id,
                img.url_imagen
              );
            }
          }
        }

        // B. Subir imágenes nuevas
        if (imagenesNuevasFiles && imagenesNuevasFiles.length > 0) {
          await productoService.agregarImagenesAProducto(
            idProductoFinal,
            imagenesNuevasFiles
          );
        }

        // C. Reordenar imágenes existentes (Drag & Drop / Favorito)
        if (ordenImagenesExistentes && ordenImagenesExistentes.length > 0) {
          const cambiosOrden = ordenImagenesExistentes.map((idImg, index) => ({
            id: idImg,
            id_producto: idProductoFinal, // Requerido para el upsert
            orden: index,
          }));
          await productoService.reordenarImagenes(cambiosOrden);
        }

        // D. Retrocompatibilidad: Sincronizar la portada con `url_imagen`
        const { data: portada } = await supabase
          .from("producto_imagenes")
          .select("url_imagen")
          .eq("id_producto", idProductoFinal)
          .order("orden", { ascending: true })
          .limit(1)
          .single();

        if (portada) {
          await productoService.actualizar(idProductoFinal, {
            url_imagen: portada.url_imagen,
          });
          productoOperado.url_imagen = portada.url_imagen;
        } else if (
          !portada &&
          imagenesAEliminar &&
          imagenesAEliminar.length > 0
        ) {
          // Si se borraron todas las fotos, limpiamos la portada
          await productoService.actualizar(idProductoFinal, {
            url_imagen: null,
          });
          productoOperado.url_imagen = null;
        }
      }

      // ── 3. GUARDAR RELACIONES (Opciones, Proveedor, Insumos) ─────
      if (data.es_personalizable) {
        // Transformamos el OpcionForm del frontend al formato que exige tu servicio
        const opcionesMapeadas = (opciones || []).map(op => ({
          opcion: {
            nombre: op.nombre,
            tipo: op.tipo,
            obligatorio: op.obligatorio,
          },
          valores: op.valores,
        }));

        await personalizacionService.guardarOpcionesProducto(
          idProductoFinal,
          opcionesMapeadas
        );
      } else {
        await personalizacionService.eliminarOpcionesDeProducto(
          idProductoFinal
        );
      }

      if (data.tipo === "revendido" && relacionProveedor) {
        const provResult = await productoProveedorService.guardarRelacion({
          id_producto: idProductoFinal,
          id_proveedor: relacionProveedor.id_proveedor,
          precio_compra: relacionProveedor.precio_compra,
          tiempo_entrega: relacionProveedor.tiempo_entrega,
        });
        if (provResult?.error)
          console.error("Error proveedor:", provResult.error);
      } else if (data.tipo === "fabricado") {
        await productoProveedorService.eliminarPorProducto(idProductoFinal);
      }

      const insumosParaGuardar =
        data.tipo === "fabricado" ? (insumosSeleccionados ?? []) : [];
      await productoInsumoService.guardarInsumosProducto(
        idProductoFinal,
        insumosParaGuardar
      );

      if (materialesSeleccionados) {
        await productoMaterialService.guardarRelaciones(
          idProductoFinal,
          materialesSeleccionados
        );
      }

      // ── 4. ACTUALIZAR ESTADO LOCAL (UI) ──────────────────────────
      const { categorias: categoriasData } =
        await categoriaService.obtenerTodas();
      const cat = categoriasData?.find(
        c => c.id === productoOperado.id_categoria
      );

      const productoParaEstado = {
        id: productoOperado.id,
        nombre: productoOperado.nombre || "",
        precio: productoOperado.precio || 0,
        costo: productoOperado.costo || 0,
        costo_mayorista: productoOperado.costo_mayorista || 0,
        stock_actual: productoOperado.stock_actual || 0,
        stock_min: productoOperado.stock_min || 0,
        tiempo: productoOperado.tiempo,
        url_imagen: productoOperado.url_imagen,
        url_filtro_tiktok: productoOperado.url_filtro_tiktok, // <-- TikTok Filter sincronizado localmente
        id_categoria: productoOperado.id_categoria,
        es_personalizable: productoOperado.es_personalizable,
        descripcion: productoOperado.descripcion || "",
        tipo: productoOperado.tipo || "fabricado",
        categoria: cat
          ? { id: cat.id, nombre: cat.nombre || "" }
          : { id: 0, nombre: "Sin categoría" },
      };

      if (targetId) {
        setProductos(prev =>
          prev.map(p => (p.id === targetId ? productoParaEstado : p))
        );
      } else {
        setProductos(prev => [...prev, productoParaEstado]);
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
  const handleDeleteProducto = (id: number, nombre?: string) => {
    setDeleteModal({ open: true, id, nombre: nombre || "este producto" });
  };

  const confirmDeleteProducto = async () => {
    const id = deleteModal.id;
    setDeleteModal(prev => ({ ...prev, open: false }));

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
      <section
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--beige)" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            width: "100%",
            maxWidth: 1200,
            padding: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Skeleton width={120} height={40} borderRadius={12} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
            }}
          >
            <Skeleton height={140} borderRadius={24} />
            <Skeleton height={140} borderRadius={24} />
            <Skeleton height={140} borderRadius={24} />
            <Skeleton height={140} borderRadius={24} />
          </div>
          <Skeleton height={500} borderRadius={24} />
        </div>
      </section>
    );
  }

  // Verificar acceso
  if (!usuario || !usuario.esAdmin()) {
    return null;
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--beige)" }}
    >
      <SidebarMenu />

      <main
        className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto"
        style={{ background: "var(--beige)" }}
      >
        <div className="mx-auto max-w-[1440px] space-y-8">
          {/* Header */}
          <header className="space-y-6">
            {/* Línea editorial */}
            <div className="flex items-center gap-4">
              <span
                className="h-px w-12"
                style={{ background: "var(--rose-gold)" }}
              />
              <span
                className="text-xs tracking-[0.4em] uppercase font-medium"
                style={{
                  color: "var(--rose-gold)",
                  fontFamily: "var(--font-marcellus)",
                }}
              >
                Inventarios
              </span>
            </div>
            {/* Subtle divider */}
            <div className="h-px w-full bg-black/5" />
          </header>

          {/* Card principal */}
          <div
            className="relative rounded-3xl p-6 md:p-10 space-y-10 border"
            style={{
              background: "var(--white)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            {/* Accent line */}
            <div
              className="absolute inset-x-0 top-0 h-1 rounded-t-3xl"
              style={{ background: "var(--rose-gold)" }}
            />

            {/* Error message */}
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {error}
              </div>
            )}

            <InventoryStats productos={productos} onFilterChange={setFiltro} />

            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
              <div className="w-full lg:w-auto">
                <InventoryToolbar search={search} setSearch={setSearch} />
              </div>
              <div className="flex flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
                <button
                  onClick={handleOpenCategoryModal}
                  className="
                    flex-1 lg:flex-none justify-center
                    text-white
                    px-6 py-3
                    rounded-xl
                    text-xs sm:text-sm font-bold
                    shadow-sm  
                    transition duration-300
                    hover:scale-[1.02]
                  "
                  style={{
                    background: "var(--rose-gold)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  + Categoría
                </button>
                <button
                  onClick={() => setLabelModalOpen(true)}
                  className="
                    flex-1 lg:flex-none justify-center
                    text-white
                    px-6 py-3
                    rounded-xl
                    text-xs sm:text-sm font-bold
                    shadow-sm
                    transition duration-300
                    hover:scale-[1.02]
                    flex items-center gap-2
                  "
                  style={{
                    background: "var(--rose-gold)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <FileText size={18} />
                  <span className="hidden sm:inline">Imprimir Etiquetas</span>
                  <span className="sm:hidden">Etiquetas</span>
                </button>
                <button
                  onClick={() => handleOpenModal()}
                  className="
                    flex-1 lg:flex-none justify-center
                    text-white
                    px-6 py-3
                    rounded-xl
                    text-xs sm:text-sm font-bold
                    shadow-sm
                    transition duration-300
                    hover:scale-[1.02]
                    whitespace-nowrap
                  "
                  style={{
                    background: "var(--rose-gold)",
                    fontFamily: "var(--font-sans)",
                  }}
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

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmationModal
        isOpen={deleteModal.open}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${deleteModal.nombre}"? Esta acción marcará el producto como inactivo.`}
        confirmLabel="Eliminar"
        cancelLabel="Volver"
        onConfirm={confirmDeleteProducto}
        onCancel={() => setDeleteModal({ open: false, id: 0, nombre: "" })}
        variant="danger"
      />
    </div>
  );
}
