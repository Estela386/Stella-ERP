"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SidebarMenu from "@/app/_components/SideBarMenu";
import InventoryStats from "./_components/InventoryStats";
import InventoryToolbar from "./_components/InventoryToolbar";
import ProductTable from "./_components/ProductTable";
import ProductModalForm from "./_components/ProductModalForm";
import CategoryModal from "./_components/CategoryModal";
import { Producto } from "./type";
import { ProductoService, ImageUploadService } from "@lib/services";
import { CategoriaService } from "@lib/services";
import { createClient } from "@utils/supabase/client";
import { useAuth } from "@lib/hooks/useAuth";
import {
  CreateProductoDTO,
  UpdateProductoDTO,
  CreateCategoriaDTO,
} from "@lib/models";

export default function InventariosPage() {
  const router = useRouter();
  const { usuario, loading: loadingUser } = useAuth();
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<
    Producto | undefined
  >();
  const [formLoading, setFormLoading] = useState(false);

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

        // Transformar productos a incluir la categoría
        if (productosData && categoriasData) {
          const productosConCategoria = productosData.map(p => {
            const cat = categoriasData.find(c => c.id === p.id_categoria);
            return {
              id: p.id,
              nombre: p.nombre || "",
              precio: p.precio || 0,
              costo: p.costo || 0,
              stock_actual: p.stock_actual || 0,
              stock_min: p.stock_min || 0,
              tiempo: p.tiempo || 0,
              url_imagen: p.url_imagen,
              id_categoria: p.id_categoria,
              categoria: cat
                ? { id: cat.id, nombre: cat.nombre }
                : { id: 0, nombre: "Sin categoría" },
            } as Producto;
          });
          setProductos(productosConCategoria as any);
        }

        setCategorias(categoriasData || []);
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

  const handleSubmitForm = async (
    data: CreateProductoDTO | UpdateProductoDTO,
    imagenFile?: File
  ) => {
    try {
      setFormLoading(true);
      const supabase = createClient();
      const productoService = new ProductoService(supabase);
      const categoriaService = new CategoriaService(supabase);
      const imageUploadService = new ImageUploadService(supabase);

      let urlImagen: string | undefined = undefined;

      // Si hay una imagen nueva, subirla
      console.log("Imagen recibida en submit:", imagenFile);
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

      // Preparar datos con la URL de imagen si existe
      const dataConImagen = urlImagen
        ? { ...data, url_imagen: urlImagen }
        : data;

      if (selectedProducto) {
        // Actualizar producto existente
        const { producto: productoActualizado, error } =
          await productoService.actualizar(
            selectedProducto.id,
            dataConImagen as UpdateProductoDTO
          );

        if (error) {
          setError(error);
          return;
        }

        // Actualizar en la lista local
        const { categorias: categoriasData } =
          await categoriaService.obtenerTodas();
        const cat = categoriasData?.find(
          c => c.id === productoActualizado?.id_categoria
        );
        const productoConCategoria: Producto = {
          id: productoActualizado?.id || 0,
          nombre: productoActualizado?.nombre || "",
          precio: productoActualizado?.precio || 0,
          costo: productoActualizado?.costo || 0,
          stock_actual: productoActualizado?.stock_actual || 0,
          stock_min: productoActualizado?.stock_min || 0,
          tiempo: productoActualizado?.tiempo,
          url_imagen: productoActualizado?.url_imagen,
          id_categoria: productoActualizado?.id_categoria,
          categoria: cat
            ? { id: cat.id, nombre: cat.nombre || "" }
            : { id: 0, nombre: "Sin categoría" },
        };

        setProductos(prev =>
          prev.map(p =>
            p.id === selectedProducto.id ? productoConCategoria : p
          )
        );
      } else {
        // Crear nuevo producto
        const { producto: productoNuevo, error } = await productoService.crear(
          dataConImagen as CreateProductoDTO
        );

        if (error) {
          setError(error);
          return;
        }

        // Obtener la categoría
        const { categorias: categoriasData } =
          await categoriaService.obtenerTodas();
        const cat = categoriasData?.find(
          c => c.id === productoNuevo?.id_categoria
        );
        const productoConCategoria: Producto = {
          id: productoNuevo?.id || 0,
          nombre: productoNuevo?.nombre || "",
          precio: productoNuevo?.precio || 0,
          costo: productoNuevo?.costo || 0,
          stock_actual: productoNuevo?.stock_actual || 0,
          stock_min: productoNuevo?.stock_min || 0,
          tiempo: productoNuevo?.tiempo,
          url_imagen: productoNuevo?.url_imagen,
          id_categoria: productoNuevo?.id_categoria,
          categoria: cat
            ? { id: cat.id, nombre: cat.nombre || "" }
            : { id: 0, nombre: "Sin categoría" },
        };

        setProductos(prev => [...prev, productoConCategoria]);
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
          <p className="text-gray-600">Cargando inventario...</p>
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
              <span className="text-xs tracking-[0.4em] uppercase text-[#B76E79] font-medium">
                Inventarios
              </span>
            </div>

            {/* Título principal */}
            <h1
              className="
                font-serif
                text-5xl md:text-6xl
                font-medium
                leading-tight
                text-[#708090]
              "
            >
              Consulta de Inventario
            </h1>

            {/* Subtle divider */}
            <div className="h-px w-full bg-black/5" />
          </header>

          {/* Card principal */}
          <div
            className="
              relative
              rounded-3xl
              bg-white
              p-8
              space-y-8
              border border-black/10
              shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            "
          >
            {/* Accent line */}
            <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-[#B76E79]" />

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <InventoryStats productos={productos} />

            <div className="flex justify-between items-center gap-4">
              <InventoryToolbar search={search} setSearch={setSearch} />
              <div className="flex gap-3">
                <button
                  onClick={handleOpenCategoryModal}
                   className="
            bg-[#B76E79]
            text-white
            px-5 py-2.5
            rounded-full
            text-sm font-medium
            shadow-sm
            hover:bg-[#A45F69]
            hover:shadow-md
            transition
          "
                  >
                  + Categoría
                </button>
                <button
                  onClick={() => handleOpenModal()}
                   className="
            bg-[#B76E79]
            text-white
            px-5 py-2.5
            rounded-full
            text-sm font-medium
            shadow-sm
            hover:bg-[#A45F69]
            hover:shadow-md
            transition
          ">
                  + Nuevo Producto
                </button>
              </div>
            </div>

            <ProductTable
              productos={productos}
              search={search}
              onEdit={handleOpenModal}
              onDelete={handleDeleteProducto}
            />
          </div>
        </div>
      </main>

      {/* Modal de Producto */}
      <ProductModalForm
        isOpen={modalOpen}
        producto={selectedProducto}
        categorias={categorias}
        onSubmit={handleSubmitForm}
        onClose={handleCloseModal}
        loading={formLoading}
      />

      {/* Modal de Categoría */}
      <CategoryModal
        isOpen={categoryModalOpen}
        onSubmit={handleCreateCategory}
        onClose={handleCloseCategoryModal}
        loading={formLoading}
      />
    </div>
  );
}
