"use client";

import { useState, useEffect, useRef } from "react";
import { ClienteService } from "@/lib/services";
import { createClient } from "@/utils/supabase/client";
import CreateClientModal from "./CreateClientModal";
import { ChevronDown, Search, Plus, User, Zap } from "lucide-react";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  id_usuario?: number;
}

interface VentaInfoFormProps {
  onClienteChange?: (cliente: Cliente) => void;
  onFechaChange?: (fecha: string) => void;
  usuario: any;
}

export default function VentaInfoForm({
  onClienteChange,
  onFechaChange,
  usuario,
}: VentaInfoFormProps) {
  const hoy = new Date().toISOString().split("T")[0];

  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [fecha, setFecha] = useState(hoy);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [telefonoExpress, setTelefonoExpress] = useState("");
  const [modalError, setModalError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar clientes
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const supabase = createClient();
        const clienteService = new ClienteService(supabase);
        const { clientes: clientesData, error } =
          await clienteService.obtenerTodos();

        if (error || !clientesData) {
          console.error(error);
          setClientes([]);
        } else {
          // Filtrar clientes si el usuario es mayorista (rol 3)
          const esMayorista = usuario?.id_rol === 3;
          const userIntId = usuario?.id ? parseInt(usuario.id, 10) : null;
          
          const filtrados = esMayorista
            ? clientesData.filter(c => (c as any).id_usuario === userIntId)
            : clientesData;

          const mapped = filtrados.map(c => ({
            id: c.id,
            nombre: c.nombre,
            telefono: c.telefono,
            id_usuario: (c as any).id_usuario,
          }));

          setClientes(mapped);
          setClientesFiltrados(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, [usuario?.id]);

  // Filtrar clientes por búsqueda
  useEffect(() => {
    if (busqueda.trim() === "") {
      setClientesFiltrados(clientes);
    } else {
      const termino = busqueda.toLowerCase();
      setClientesFiltrados(
        clientes.filter(
          c =>
            c.nombre.toLowerCase().includes(termino) ||
            c.telefono.includes(termino)
        )
      );
    }
  }, [busqueda, clientes]);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClienteCreated = (cliente: Cliente) => {
    setClientes([...clientes, cliente]);
    setClienteSeleccionado(cliente);
    setBusqueda("");
    if (onClienteChange) {
      onClienteChange(cliente);
    }
  };

  const handleTelefonoExpressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setTelefonoExpress(val);
    if (val.length > 0) {
      setClienteSeleccionado(null); // Borrar el registrado si usa venta rápida
    }
  };

  const handleClienteSelect = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setTelefonoExpress(""); // Borrar el teléfono rápido si usa registrado
    setShowDropdown(false);
    setBusqueda("");
    if (onClienteChange) {
      onClienteChange(cliente);
    }
  };

  const handleFechaChange = (nuevaFecha: string) => {
    setFecha(nuevaFecha);
    if (onFechaChange) {
      onFechaChange(nuevaFecha);
    }
  };

  // Notificar al padre los cambios de cliente. Si no hay cliente seleccionado, es Público General
  useEffect(() => {
    if (onClienteChange) {
      if (telefonoExpress.length > 0) {
        onClienteChange({ id: -1, nombre: "Cliente " + telefonoExpress, telefono: telefonoExpress });
      } else if (clienteSeleccionado) {
        onClienteChange(clienteSeleccionado);
      } else {
        onClienteChange({ id: -2, nombre: "Público General", telefono: "Sin Registro" });
      }
    }
  }, [clienteSeleccionado, telefonoExpress]);

  const esValido = fecha !== "";

  // Comprueba si la búsqueda del dropdown parece un teléfono (búsqueda rápida)
  const esBusquedaTelefono = busqueda.replace(/\D/g, '').length >= 7;

  return (
    <>
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md shadow-[#8C9796]/20 border border-[#8C9796]/20 space-y-6">
        
        {/* BLOQUE SUPERIOR: Selección de Cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* Selector de Cliente Registrado */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] tracking-wide text-[#708090] font-semibold uppercase block">
                Cliente Registrado
              </label>
              {clienteSeleccionado && (
                <button
                  type="button"
                  onClick={() => setClienteSeleccionado(null)}
                  className="text-[10px] font-bold text-[#b76e79] hover:text-[#A0626B] hover:underline"
                >
                  Limpiar Selección
                </button>
              )}
            </div>

            <div ref={dropdownRef} className="relative">
              <button
                disabled={telefonoExpress.length > 0}
                onClick={() => {
                  if (telefonoExpress.length === 0) {
                    setShowDropdown(!showDropdown);
                    if (!showDropdown) setBusqueda("");
                  }
                }}
                className={`w-full text-left border-2 rounded-xl px-4 py-3 shadow-sm focus:outline-none transition flex items-center justify-between ${
                  telefonoExpress.length > 0 
                    ? "bg-[#EAE7E1] border-[#8C9796]/20 text-[#8C9796]/50 cursor-not-allowed" 
                    : "bg-[#F6F4EF] text-[#708090] cursor-pointer"
                } ${
                  clienteSeleccionado && telefonoExpress.length === 0
                    ? "border-[#B76E79]/50 bg-white"
                    : telefonoExpress.length === 0 ? "border-[#8C9796]/40 hover:border-[#8C9796]/60" : ""
                } ${showDropdown ? "border-[#B76E79] ring-2 ring-[#B76E79]/20" : ""}`}
              >
                <span
                  className={
                    clienteSeleccionado && telefonoExpress.length === 0
                      ? "text-[#708090] font-medium"
                      : "text-[#8C9796]"
                  }
                >
                  {clienteSeleccionado ? (
                    clienteSeleccionado.id === -1 ? (
                      <div>
                        <div className="font-bold flex items-center gap-1"><Zap size={12}/> Venta Rápida a Teléfono</div>
                        <div className="text-xs text-[#8C9796]">
                          {clienteSeleccionado.telefono}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">
                          {clienteSeleccionado.nombre}
                        </div>
                        <div className="text-xs text-[#8C9796]">
                          {clienteSeleccionado.telefono}
                        </div>
                      </div>
                    )
                  ) : (
                    "Seleccionar cliente"
                  )}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-[#B76E79] transition ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
              {showDropdown && telefonoExpress.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#B76E79]/30 rounded-2xl shadow-xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {/* Búsqueda */}
                  <div className="p-3 border-b border-[#8C9796]/20">
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C9796]/50"
                      />
                      <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        autoFocus
                        className="w-full bg-[#F6F4EF] border border-[#8C9796]/30 rounded-lg pl-10 pr-3 py-2 text-sm text-[#708090] focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30"
                      />
                    </div>
                  </div>

                  {/* Lista de clientes */}
                  <div className="max-h-64 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-[#8C9796] text-sm">
                        Cargando clientes...
                      </div>
                    ) : (
                      <>
                        {clientesFiltrados.length === 0 && !esBusquedaTelefono && (
                          <div className="p-4 text-center text-[#8C9796] text-sm">
                            {busqueda ? "No se encontraron clientes" : "Busca para comenzar"}
                          </div>
                        )}
                        
                        {clientesFiltrados.map(cliente => (
                          <button
                            key={cliente.id}
                            onClick={() => {
                              handleClienteSelect(cliente);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-[#B76E79]/10 transition border-b border-[#8C9796]/10 last:border-b-0 cursor-pointer"
                          >
                            <div className="font-medium text-[#708090]">
                              {cliente.nombre}
                            </div>
                            <div className="text-xs text-[#8C9796]">
                              {cliente.telefono}
                            </div>
                          </button>
                        ))}

                        {/* Opción Rápida Integrada si escribe números */}
                        {esBusquedaTelefono && (
                          <button
                            onClick={() => {
                              handleClienteSelect({
                                id: -1,
                                nombre: "Cliente Directo",
                                telefono: busqueda.replace(/\D/g, '')
                              });
                            }}
                            className="w-full text-left px-4 py-3 bg-[#b76e79]/5 hover:bg-[#b76e79]/15 transition border-b border-[#8C9796]/10 cursor-pointer flex flex-col"
                          >
                            <div className="font-bold text-[#b76e79] flex items-center gap-1.5 text-sm">
                              <Zap size={14} />
                              Usar "{busqueda}" como Venta Rápida
                            </div>
                            <div className="text-xs text-[#708090] mt-0.5 ml-5">
                              Se asociará o creará automáticamente sin formularios.
                            </div>
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Botón para crear nuevo */}
                   <button
                    onClick={() => {
                      setShowModal(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-[#B76E79] hover:bg-[#B76E79]/10 transition border-t border-[#8C9796]/20 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Plus size={16} />
                    Agregar nuevo cliente
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Teléfono Rápido */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-wide text-[#708090] font-semibold uppercase block">
              <Zap size={10} className="inline mr-1 text-[#b76e79]" /> 
              Venta Rápida
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Teléfono..."
                value={telefonoExpress}
                disabled={clienteSeleccionado !== null}
                onChange={handleTelefonoExpressChange}
                className={`w-full border-2 rounded-xl px-3 py-3 text-sm shadow-sm focus:outline-none transition ${
                  clienteSeleccionado !== null
                    ? "bg-[#EAE7E1] border-[#8C9796]/20 text-[#8C9796]/50 cursor-not-allowed"
                    : telefonoExpress.length > 0 
                      ? "bg-white border-[#B76E79]/50 text-[#708090]" 
                      : "bg-[#F6F4EF] border-[#8C9796]/40 text-[#708090] focus:border-[#B76E79]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* LÍNEA SEPARADORA */}
        <div className="border-t border-[#8C9796]/15"></div>

        {/* BLOQUE INFERIOR: Detalles base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* Fecha */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-wide text-[#708090] font-semibold uppercase block">
              Fecha *
            </label>
            <input
              type="date"
              required
              value={fecha}
              max={hoy}
              onChange={e => handleFechaChange(e.target.value)}
              className="w-full bg-[#F6F4EF] border border-[#8C9796]/40 rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>

          {/* Vendedor */}
          <div className="space-y-2">
            <label className="text-[10px] tracking-wide text-[#708090] font-semibold uppercase block">
              Vendedor
            </label>
            <input
              type="text"
              value="Usuario actual"
              disabled
              className="w-full bg-[#EAE7E1] border border-[#8C9796]/30 rounded-xl px-4 py-3 text-[#708090]"
            />
          </div>
        </div>

        {/* Mensaje */}
        {!esValido && (
          <p className="mt-4 text-sm text-[#B76E79] font-medium flex items-center gap-2">
            ⚠️ Verifica la fecha para continuar
          </p>
        )}
      </div>

      {/* Modal */}
      <CreateClientModal
        isOpen={showModal}
        usuarioId={usuario?.id}
        onClose={() => setShowModal(false)}
        onCreated={handleClienteCreated}
        error={modalError}
      />
    </>
  );
}
