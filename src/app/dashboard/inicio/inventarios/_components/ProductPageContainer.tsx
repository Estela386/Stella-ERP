"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@utils/supabase/client";
import { useAuth } from "@lib/hooks/useAuth";
import Skeleton from "@/app/_components/ui/Skeleton";

import ProductForm, { type OpcionForm } from "./ProductForm";
import { Producto } from "../type";
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
  CategoriaService,
} from "@lib/services";
import {
  CreateProductoDTO,
  UpdateProductoDTO,
  ICategoria,
  IProveedor,
  IInsumo,
} from "@lib/models";
import { type IMaterial } from "@lib/services/MaterialService";

interface ProductPageContainerProps {
  productoId?: number;
}

export default function ProductPageContainer({ productoId }: ProductPageContainerProps) {
  const router = useRouter();
  const { usuario, loading: loadingUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [producto, setProducto] = useState<Producto | undefined>();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [proveedores, setProveedores] = useState<IProveedor[]>([]);
  const [insumos, setInsumos] = useState<IInsumo[]>([]);
  const [materiales, setMateriales] = useState<IMaterial[]>([]);

  // Verificar rol en cliente
  useEffect(() => {
    if (!loadingUser && usuario && !usuario.esAdmin()) {
      router.push("/dashboard/cliente");
    }
  }, [usuario, loadingUser, router]);

  // Cargar datos
  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario || !usuario.esAdmin()) return;

      try {
        setLoading(true);
        const supabase = createClient();

        // Si estamos editando, cargar el producto
        if (productoId) {
          const productoService = new ProductoService(supabase);
          const { producto: productoData, error: errorProducto } = await productoService.obtenerPorId(productoId);
          if (errorProducto) {
            setError(errorProducto);
            return;
          }
          if (productoData) {
            setProducto(productoData);
          }
        }

        // Cargar catálogos
        const [
          { categorias: categoriasData, error: errorCategorias },
          { proveedores: proveedoresData, error: errorProveedores },
          { insumos: insumosData, error: errorInsumos },
          { materiales: materialesData, error: errorMateriales }
        ] = await Promise.all([
          new CategoriaService(supabase).obtenerTodas(),
          new ProveedorService(supabase).obtenerTodos(),
          new InsumoService(supabase).obtenerTodos(),
          new MaterialService(supabase).obtenerTodos()
        ]);

        if (errorCategorias) throw new Error(errorCategorias);
        if (errorProveedores) throw new Error(errorProveedores);
        if (errorInsumos) throw new Error(errorInsumos);
        if (errorMateriales) throw new Error(errorMateriales);

        setCategorias(categoriasData || []);
        setProveedores(proveedoresData || []);
        setInsumos(insumosData || []);
        setMateriales(materialesData || []);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido al cargar datos");
        toast.error("Error al cargar los datos necesarios");
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!loadingUser) {
      cargarDatos();
    }
  }, [usuario, loadingUser, productoId]);

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
    id_actualizar?: number // este viene del ProductForm pero usamos productoId preferiblemente
  ) => {
    try {
      setFormLoading(true);
      const supabase = createClient();
      const productoService = new ProductoService(supabase);
      const imageUploadService = new ImageUploadService(supabase);
      const personalizacionService = new ProductoPersonalizacionService(supabase);
      const productoProveedorService = new ProductoProveedorService(supabase);
      const productoInsumoService = new ProductoInsumoService(supabase);
      const productoMaterialService = new ProductoMaterialService(supabase);

      const targetId = productoId || id_actualizar;
      let urlImagen: string | undefined = undefined;

      if (imagenFile) {
        const { url, error: uploadError } = await imageUploadService.uploadImage(
          imagenFile,
          targetId
        );
        if (uploadError) {
          toast.error(`Error al subir imagen: ${uploadError}`);
          setError(uploadError);
          return;
        }
        urlImagen = url || undefined;
      }

      const dataConImagen = urlImagen ? { ...data, url_imagen: urlImagen } : data;

      if (targetId) {
        // ── Actualizar ──────────────────────────────────────────────
        const { error } = await productoService.actualizar(
          targetId,
          dataConImagen as UpdateProductoDTO
        );

        if (error) {
          toast.error(`Error al actualizar: ${error}`);
          setError(error);
          return;
        }

        if (data.es_personalizable) {
          await personalizacionService.guardarOpcionesProducto(
            targetId,
            mapOpcionesParaServicio(opciones || [])
          );
        } else {
          const personalizacionSvc = new ProductoPersonalizacionService(supabase);
          await personalizacionSvc.eliminarOpcionesDeProducto(targetId);
        }

        if (data.tipo === "revendido" && relacionProveedor) {
          const provResult = await productoProveedorService.guardarRelacion({
            id_producto: targetId,
            id_proveedor: relacionProveedor.id_proveedor,
            precio_compra: relacionProveedor.precio_compra,
            tiempo_entrega: relacionProveedor.tiempo_entrega,
          });
          if (provResult?.error) console.error("Error guardando proveedor:", provResult.error);
        } else if (data.tipo === "fabricado") {
          await productoProveedorService.eliminarPorProducto(targetId);
        }

        const insumosParaGuardar = data.tipo === "fabricado" ? (insumosSeleccionados ?? []) : [];
        const insumoResult = await productoInsumoService.guardarInsumosProducto(targetId, insumosParaGuardar);
        if (insumoResult && !insumoResult.success) console.error("Error guardando insumos:", insumoResult.error);

        if (materialesSeleccionados) {
          const materialResult = await productoMaterialService.guardarRelaciones(targetId, materialesSeleccionados);
          if (!materialResult.success) console.error("Error guardando materiales:", materialResult.error);
        }

        toast.success("¡Producto actualizado correctamente! ✨");
        router.push("/dashboard/inicio/inventarios");
      } else {
        // ── Crear ───────────────────────────────────────────────────
        const { producto: productoNuevo, error } = await productoService.crear(
          dataConImagen as CreateProductoDTO
        );

        if (error) {
          toast.error(`Error al crear: ${error}`);
          setError(error);
          return;
        }

        if (data.es_personalizable && opciones?.length && productoNuevo?.id) {
          await personalizacionService.guardarOpcionesProducto(
            productoNuevo.id,
            mapOpcionesParaServicio(opciones)
          );
        }

        if (data.tipo === "revendido" && relacionProveedor && productoNuevo?.id) {
          const provResult = await productoProveedorService.guardarRelacion({
            id_producto: productoNuevo.id,
            id_proveedor: relacionProveedor.id_proveedor,
            precio_compra: relacionProveedor.precio_compra,
            tiempo_entrega: relacionProveedor.tiempo_entrega,
          });
          if (provResult?.error) console.error("Error guardando proveedor:", provResult.error);
        }

        if (productoNuevo?.id) {
          const insumosParaGuardar = data.tipo === "fabricado" ? (insumosSeleccionados ?? []) : [];
          const insumoResult = await productoInsumoService.guardarInsumosProducto(productoNuevo.id, insumosParaGuardar);
          if (insumoResult && !insumoResult.success) console.error("Error guardando insumos:", insumoResult.error);
          
          if (materialesSeleccionados) {
            const materialResult = await productoMaterialService.guardarRelaciones(productoNuevo.id, materialesSeleccionados);
            if (!materialResult.success) console.error("Error guardando materiales:", materialResult.error);
          }
        }

        toast.success("¡Producto creado correctamente! ✨");
        router.push("/dashboard/inicio/inventarios");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al guardar producto";
      setError(msg);
      toast.error(msg);
      console.error("Error guardando producto:", err);
    } finally {
      setFormLoading(false);
    }
  };

  if (loadingUser || loading) {
    return (
      <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto mt-8">
        <Skeleton height={60} borderRadius={16} />
        <Skeleton height={500} borderRadius={24} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12">
      {/* HEADER DE LA PÁGINA */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/dashboard/inicio/inventarios")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#708090] bg-white border border-[rgba(112,128,144,0.15)] rounded-xl hover:bg-[#f6f4ef] hover:border-[#708090]/30 transition-all shadow-sm"
        >
          <ArrowLeft size={16} /> Regresar al inventario
        </button>

        <div className="text-right">
          <p className="text-[0.7rem] text-[#8c9768] font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-sans)" }}>Stella ERP</p>
          <h1 className="text-2xl md:text-3xl font-black text-[#4a5568] leading-tight" style={{ fontFamily: "var(--font-marcellus)" }}>
            {productoId ? "Editar" : "Nuevo"} <span className="text-[#b76e79]">Producto</span>
          </h1>
        </div>
      </div>

      {/* ERROR MSG */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8 font-medium shadow-sm flex items-start gap-3">
          <div className="mt-0.5">⚠️</div>
          <div>{error}</div>
        </div>
      )}

      {/* CONTENEDOR DEL FORMULARIO */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-[rgba(112,128,144,0.1)] relative">
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl" style={{ background: "var(--rose-gold)" }} />
        
        <ProductForm
          producto={producto}
          categorias={categorias}
          proveedores={proveedores}
          insumosDisponibles={insumos}
          materialesDisponibles={materiales}
          onSubmit={handleSubmitForm}
          onCancel={() => router.push("/dashboard/inicio/inventarios")}
          loading={formLoading}
        />
      </div>
    </div>
  );
}
