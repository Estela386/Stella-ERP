"use client";

import { useState, useEffect } from "react";
import { createClient } from "@utils/supabase/client";
import { IConsignacion, CreateConsignacionDTO, IUsuarioMayorista } from "@lib/models";
import { ConsignacionService } from "@lib/services/ConsignacionService";
import { X, AlertCircle, Plus, Trash2 } from "lucide-react";

interface ProductoBasico {
  id: number;
  nombre: string;
  precio: number;
  stock_actual: number;
}

interface ProductoSeleccionado {
  id_producto: number;
  productoInfo: ProductoBasico;
  cantidad: number;
}

interface CreateConsignacionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mayoristas: IUsuarioMayorista[];
  adminId: number;
  editando?: IConsignacion | null;
  pedidoBaseId?: string | null;
}

const campo = (label: string, children: React.ReactNode) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label
      style={{
        fontSize: "0.75rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "#708090",
        fontFamily: "var(--font-sans)",
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  padding: "9px 14px",
  borderRadius: 10,
  border: "1.5px solid rgba(112,128,144,0.25)",
  background: "#FAFAF8",
  fontSize: "0.85rem",
  color: "#1C1C1C",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  fontFamily: "var(--font-sans)",
};

export default function CreateConsignacionModal({
  open,
  onClose,
  onSuccess,
  mayoristas,
  adminId,
  editando,
  pedidoBaseId,
}: CreateConsignacionModalProps) {
  // Estado general de la consignacion
  const [form, setForm] = useState({
    id_mayorista: "",
    fecha_inicio: new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
    fecha_fin: "",
    notas: "",
  });

  // Estado del selector temporal de producto
  const [formProd, setFormProd] = useState({
    id_producto: "",
    cantidad: "",
  });

  const [productosDisponibles, setProductosDisponibles] = useState<ProductoBasico[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos y posible pedido
  useEffect(() => {
    if (!open) return;
    const load = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("producto")
        .select("id, nombre, precio, stock_actual")
        .gt("stock_actual", 0)
        .order("nombre");
      const disponibles = (data as ProductoBasico[]) ?? [];
      setProductosDisponibles(disponibles);

      // Revisar si venimos de un pedido pasador por PROPS para auto-llenar
      if (pedidoBaseId && !editando) {
        try {
          const SELECT_FULL = `*, usuario:usuario(id, nombre, correo, id_rol), detalles:pedido_detalle(id, id_producto, cantidad, precio_unitario, subtotal, producto:producto(id, nombre, url_imagen))`;
          const { data, error } = await supabase
            .from('pedidos')
            .select(SELECT_FULL)
            .eq('id', pedidoBaseId)
            .single();

          if (data) {
            // Asignar el mayorista automáticamente si corresponde
            if (data.id_usuario) {
              setForm(f => ({ ...f, id_mayorista: String(data.id_usuario) }));
            }
            // Mapear los detalles del pedido a productos seleccionados de consignación
            if (data.detalles) {
              const mapped: ProductoSeleccionado[] = data.detalles.map((det: any) => {
                const info = disponibles.find(p => p.id === det.id_producto);
                return {
                  id_producto: det.id_producto,
                  productoInfo: info || {
                    id: det.id_producto,
                    nombre: det.producto?.nombre || "Producto desconocido",
                    precio: det.precio_unitario,
                    stock_actual: det.cantidad // Mocking para que no de error
                  },
                  cantidad: det.cantidad
                };
              });
              setProductosSeleccionados(mapped);
            }
          } else if (error) {
            console.error("Error al cargar productos del pedido base:", error);
            setError("No se pudieron cargar los productos del pedido solicitado.");
          }
        } catch (err) {
          console.error("Excepción al cargar productos del pedido base:", err);
          setError("Error de red cargando pedido.");
        }
      }
      
      setLoading(false);
    };
    load();
  }, [open, editando, pedidoBaseId]);

  // Si estamos editando, rellenar form
  useEffect(() => {
    if (editando) {
      setForm({
        id_mayorista: String(editando.id_mayorista),
        fecha_inicio: editando.fecha_inicio,
        fecha_fin: editando.fecha_fin,
        notas: editando.notas ?? "",
      });
      setProductosSeleccionados([]); // En modo edicion no editamos productos por ahora
    } else {
      // Solo resetear si NO hay un pedido id pendiente de cargar
      if (!pedidoBaseId) {
        setForm(f => ({
          ...f,
          id_mayorista: "",
          fecha_inicio: new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
          fecha_fin: "",
          notas: "",
        }));
        setProductosSeleccionados([]);
      }
    }
    setError(null);
  }, [editando, open, pedidoBaseId]);

  // Agregar producto a la lista
  const handleAddProducto = () => {
    setError(null);
    if (!formProd.id_producto || !formProd.cantidad) {
      setError("Selecciona un producto y especifica la cantidad");
      return;
    }

    const cantidadNum = parseInt(formProd.cantidad);
    const prodIdNum = parseInt(formProd.id_producto);

    if (cantidadNum <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    const prodInfo = productosDisponibles.find(p => p.id === prodIdNum);
    if (!prodInfo) return;

    if (cantidadNum > prodInfo.stock_actual) {
      setError(`Stock insuficiente. Disponible: ${prodInfo.stock_actual}`);
      return;
    }

    // Verificar si ya existe en la lista
    const yaExiste = productosSeleccionados.find(p => p.id_producto === prodIdNum);
    if (yaExiste) {
      setError("El producto ya está en la lista. Si deseas cambiar la cantidad, elimínalo primero.");
      return;
    }

    setProductosSeleccionados(prev => [
      ...prev,
      { id_producto: prodIdNum, productoInfo: prodInfo, cantidad: cantidadNum }
    ]);

    // Limpiar input
    setFormProd({ id_producto: "", cantidad: "" });
  };

  const handleRemoveProducto = (id_producto: number) => {
    setProductosSeleccionados(prev => prev.filter(p => p.id_producto !== id_producto));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.id_mayorista || !form.fecha_inicio || !form.fecha_fin) {
      setError("Completa los datos del mayorista y fechas");
      return;
    }

    if (!editando && productosSeleccionados.length === 0) {
      setError("Debes agregar al menos un producto a la consignación");
      return;
    }

    setLoading(true);
    try {
      if (editando) {
        // En modo edicion, solo se actualiza encabezado (fechas/notas)
        const res = await fetch(`/api/consignaciones/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notas: form.notas,
            fecha_fin: form.fecha_fin,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
      } else {
        // Modo creacion
        const payload = {
          id_mayorista: parseInt(form.id_mayorista),
          fecha_inicio: form.fecha_inicio,
          fecha_fin: form.fecha_fin,
          notas: form.notas || null,
          creado_por: adminId,
          productos: productosSeleccionados.map(p => ({
            id_producto: p.id_producto,
            cantidad: p.cantidad
          }))
        };

        const res = await fetch(`/api/consignaciones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  // Calculos totales
  const totalGeneralVenta = productosSeleccionados.reduce((sum, p) => sum + (p.productoInfo.precio * p.cantidad), 0);
  const totalGeneralMayorista = productosSeleccionados.reduce((sum, p) => sum + (p.productoInfo.precio * 0.75 * p.cantidad), 0);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "28px",
          width: "100%",
          maxWidth: 720,
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 400, color: "#1C1C1C", margin: 0, fontFamily: "var(--font-marcellus)" }}>
              {editando ? "Editar Consignación" : "Nueva Consignación"}
            </h2>
            <p style={{ fontSize: "0.78rem", color: "#8C9796", margin: "4px 0 0", fontFamily: "var(--font-sans)" }}>
              {editando ? "Modificar período o notas" : "Asigna productos a un mayorista"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: "none",
              background: "#F6F3EF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#708090",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#e53e3e",
              fontSize: "0.82rem",
              fontFamily: "var(--font-sans)",
            }}
          >
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Seccion Info Básica */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {campo("Mayorista *",
              <select
                value={form.id_mayorista}
                onChange={e => setForm(f => ({ ...f, id_mayorista: e.target.value }))}
                disabled={!!editando}
                style={{ ...inputStyle, appearance: "auto" }}
              >
                <option value="">Seleccionar...</option>
                {mayoristas.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            )}

            {campo("Fechas de vigencia *",
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="date"
                  value={form.fecha_inicio}
                  onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))}
                  disabled={!!editando}
                  style={inputStyle}
                />
                <input
                  type="date"
                  value={form.fecha_fin}
                  min={form.fecha_inicio}
                  onChange={e => setForm(f => ({ ...f, fecha_fin: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          {/* Seccion Agregar Producto (solo si no es edit mode) */}
          {!editando && (
            <div style={{
              background: "#F8F9FA",
              border: "1px dashed #CBD5E1",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "20px"
            }}>
              <h4 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#475569", fontFamily: "var(--font-marcellus)", fontWeight: 400 }}>Agregar Producto</h4>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  {campo("Producto",
                    <select
                      value={formProd.id_producto}
                      onChange={e => setFormProd(f => ({ ...f, id_producto: e.target.value }))}
                      style={{ ...inputStyle, appearance: "auto" }}
                    >
                      <option value="">Seleccionar producto...</option>
                      {productosDisponibles.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} - ${p.precio} (Stock: {p.stock_actual})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div style={{ width: "100px" }}>
                  {campo("Cantidad",
                    <input
                      type="number"
                      min={1}
                      value={formProd.cantidad}
                      onChange={e => setFormProd(f => ({ ...f, cantidad: e.target.value }))}
                      style={inputStyle}
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAddProducto}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 10,
                    border: "none",
                    background: "#E2E8F0",
                    color: "#0F172A",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    height: "38px",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <Plus size={16} /> Agregar
                </button>
              </div>
            </div>
          )}

          {/* Tabla de Productos Seleccionados */}
          {!editando && productosSeleccionados.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                overflow: "hidden"
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#F1F5F9", color: "#64748B", fontWeight: 700, fontFamily: "var(--font-sans)", textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.05em" }}>
                      <th style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0" }}>Producto</th>
                      <th style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0" }}>Cant.</th>
                      <th style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0" }}>Precio Unit</th>
                      <th style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0" }}>P. Mayorista (-25%)</th>
                      <th style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0" }}>Subtotal May.</th>
                      <th style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosSeleccionados.map((item, i) => {
                      const pMay = item.productoInfo.precio * 0.75;
                      const subTotal = pMay * item.cantidad;
                      return (
                        <tr key={item.id_producto} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0", fontWeight: 400, color: "#334155", fontFamily: "var(--font-marcellus)", fontSize: "0.9rem" }}>
                            {item.productoInfo.nombre}
                          </td>
                          <td style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0" }}>{item.cantidad}</td>
                          <td style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0" }}>${item.productoInfo.precio.toFixed(2)}</td>
                          <td style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0", color: "#10B981" }}>${pMay.toFixed(2)}</td>
                          <td style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0", fontWeight: 400, color: "#1C1C1C", fontFamily: "var(--font-marcellus)", fontSize: "0.95rem" }}>${subTotal.toFixed(2)}</td>
                          <td style={{ padding: "10px 14px", borderBottom: "1px solid #E2E8F0", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveProducto(item.id_producto)}
                              style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", padding: "4px" }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 14px", background: "#F8FAFC", borderRadius: "10px", marginTop: "12px", gap: "24px", fontSize: "0.85rem", fontFamily: "var(--font-sans)" }}>
                <span>Valor de vta: <strong style={{ fontWeight: 600 }}>${totalGeneralVenta.toFixed(2)}</strong></span>
                <span style={{ color: "#B76E79" }}>Total a Pagar (Si vende todo): <strong style={{ fontSize: "1.1rem", fontFamily: "var(--font-marcellus)", fontWeight: 400 }}>${totalGeneralMayorista.toFixed(2)}</strong></span>
              </div>
            </div>
          )}

          {/* Notas */}
          <div style={{ marginBottom: "20px" }}>
            {campo("Notas",
              <textarea
                value={form.notas}
                onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                rows={2}
                style={{ ...inputStyle, resize: "vertical" }}
                placeholder="Observaciones opcionales..."
              />
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "1.5px solid rgba(112,128,144,0.25)",
                background: "#fff",
                color: "#708090",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 24px",
                borderRadius: 10,
                border: "none",
                background: loading ? "#ccc" : "linear-gradient(135deg,#B76E79,#9d5a64)",
                color: "#fff",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 14px rgba(183,110,121,0.35)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {loading ? "Guardando..." : editando ? "Actualizar" : "Crear Consignación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
