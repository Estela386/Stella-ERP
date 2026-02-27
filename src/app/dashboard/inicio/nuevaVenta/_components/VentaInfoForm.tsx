"use client";

import { useState, useEffect, useRef } from "react";
import { ClienteService } from "@/lib/services";
import { createClient } from "@/utils/supabase/client";
import CreateClientModal from "./CreateClientModal";
import { ChevronDown, Search, Plus } from "lucide-react";

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
}

export default function VentaInfoForm() {
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
          setClientes(
            clientesData.map(c => ({
              id: c.id,
              nombre: c.nombre,
              telefono: c.telefono,
            }))
          );
          setClientesFiltrados(
            clientesData.map(c => ({
              id: c.id,
              nombre: c.nombre,
              telefono: c.telefono,
            }))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarClientes();
  }, []);

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
  };

  const esValido = clienteSeleccionado !== null && fecha !== "";

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-md shadow-[#8C9796]/20 border border-[#8C9796]/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Cliente con búsqueda */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs tracking-wide text-[#708090] font-semibold uppercase">
              Cliente *
            </label>

            {/* Selector personalizado */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  if (!showDropdown) setBusqueda("");
                }}
                className={`w-full text-left bg-[#F6F4EF] border-2 rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none transition flex items-center justify-between ${
                  clienteSeleccionado
                    ? "border-[#B76E79]/50 bg-white"
                    : "border-[#8C9796]/40 hover:border-[#8C9796]/60"
                } ${showDropdown ? "border-[#B76E79] ring-2 ring-[#B76E79]/20" : ""}`}
              >
                <span
                  className={
                    clienteSeleccionado
                      ? "text-[#708090] font-medium"
                      : "text-[#8C9796]"
                  }
                >
                  {clienteSeleccionado ? (
                    <div>
                      <div className="font-medium">
                        {clienteSeleccionado.nombre}
                      </div>
                      <div className="text-xs text-[#8C9796]">
                        {clienteSeleccionado.telefono}
                      </div>
                    </div>
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
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#B76E79]/50 rounded-xl shadow-lg z-10">
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
                    ) : clientesFiltrados.length === 0 ? (
                      <div className="p-4 text-center text-[#8C9796] text-sm">
                        {busqueda
                          ? "No se encontraron clientes"
                          : "Sin clientes"}
                      </div>
                    ) : (
                      clientesFiltrados.map(cliente => (
                        <button
                          key={cliente.id}
                          onClick={() => {
                            setClienteSeleccionado(cliente);
                            setShowDropdown(false);
                            setBusqueda("");
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-[#B76E79]/10 transition border-b border-[#8C9796]/10 last:border-b-0"
                        >
                          <div className="font-medium text-[#708090]">
                            {cliente.nombre}
                          </div>
                          <div className="text-xs text-[#8C9796]">
                            {cliente.telefono}
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Botón para crear nuevo */}
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-[#B76E79] hover:bg-[#B76E79]/10 transition border-t border-[#8C9796]/20 flex items-center gap-2 font-medium"
                  >
                    <Plus size={16} />
                    Agregar nuevo cliente
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <label className="text-xs tracking-wide text-[#708090] font-semibold uppercase">
              Fecha *
            </label>
            <input
              type="date"
              required
              value={fecha}
              max={hoy}
              onChange={e => setFecha(e.target.value)}
              className="w-full bg-[#F6F4EF] border border-[#8C9796]/40 rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79]"
            />
          </div>

          {/* Vendedor */}
          <div className="space-y-2">
            <label className="text-xs tracking-wide text-[#708090] font-semibold uppercase">
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
            ⚠️ Completa los campos obligatorios para continuar
          </p>
        )}
      </div>

      {/* Modal */}
      <CreateClientModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleClienteCreated}
        error={modalError}
      />
    </>
  );
}
