"use client";

import { useState } from "react";
import { X, Phone, User } from "lucide-react";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (cliente: {
    id: number;
    nombre: string;
    telefono: string;
    id_usuario?: number;
  }) => void;
  usuarioId?: string | number;
  isLoading?: boolean;
  error?: string;
}

export default function CreateClientModal({
  isOpen,
  onClose,
  onCreated,
  usuarioId,
  isLoading = false,
  error,
}: CreateClientModalProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async () => {
    // Validación
    setValidationError("");

    if (!nombre.trim()) {
      setValidationError("El nombre es requerido");
      return;
    }

    if (!telefono.trim() || telefono.length < 10) {
      setValidationError("El teléfono debe tener al menos 10 dígitos");
      return;
    }

    // Crear cliente
    try {
      const response = await fetch("/api/clientes/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          id_usuario: usuarioId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setValidationError(data.error || "Error al crear el cliente");
        return;
      }

      // Llamar callback y cerrar modal
      onCreated(data.cliente);
      setNombre("");
      setTelefono("");
      onClose();
    } catch (err) {
      setValidationError("Error al crear el cliente");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#708090]">Nuevo Cliente</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <X size={20} className="text-[#708090]" />
          </button>
        </div>

        {/* Nombre */}
        <div className="space-y-2 mb-4">
          <label className="text-xs tracking-wide text-[#708090] font-semibold uppercase flex items-center gap-2">
            <User size={16} />
            Nombre *
          </label>
          <input
            type="text"
            placeholder="Ej: Juan Pérez"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            disabled={isLoading}
            className="w-full bg-[#F6F4EF] border border-[#8C9796]/40 rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79] disabled:opacity-50"
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-2 mb-4">
          <label className="text-xs tracking-wide text-[#708090] font-semibold uppercase flex items-center gap-2">
            <Phone size={16} />
            Teléfono *
          </label>
          <input
            type="tel"
            placeholder="10 dígitos"
            value={telefono}
            maxLength={10}
            onChange={e => setTelefono(e.target.value.replace(/\D/g, ""))}
            disabled={isLoading}
            className="w-full bg-[#F6F4EF] border border-[#8C9796]/40 rounded-xl px-4 py-3 text-[#708090] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B76E79] disabled:opacity-50"
          />
        </div>

        {/* Errores */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">
              {validationError}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-[#708090] bg-gray-100 rounded-xl hover:bg-gray-200 transition disabled:opacity-50 cursor-pointer font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 text-white bg-[#B76E79] rounded-xl hover:bg-[#A0626B] transition disabled:opacity-50 cursor-pointer font-medium"
          >
            {isLoading ? "Creando..." : "Crear Cliente"}
          </button>
        </div>
      </div>
    </div>
  );
}
