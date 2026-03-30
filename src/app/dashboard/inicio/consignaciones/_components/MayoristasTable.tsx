"use client";

import { useState } from "react";
import { IUsuarioMayorista } from "@lib/models";
import { UserCheck, Search, UserPlus } from "lucide-react";

interface MayoristasTableProps {
  mayoristas: IUsuarioMayorista[];
  loading: boolean;
  onPromover: () => void;
}

export default function MayoristasTable({
  mayoristas,
  loading,
  onPromover,
}: MayoristasTableProps) {
  const [search, setSearch] = useState("");

  const filtrados = mayoristas.filter(m => {
    const q = search.toLowerCase();
    return m.nombre?.toLowerCase().includes(q) || m.correo?.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F6F3EF",
            border: "1px solid rgba(112,128,144,0.2)",
            borderRadius: 10,
            padding: "8px 14px",
            flex: 1,
            maxWidth: 300,
          }}
        >
          <Search size={14} style={{ color: "#8C9796" }} />
          <input
            placeholder="Buscar mayorista..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: "none", border: "none", outline: "none", fontSize: "0.82rem", width: "100%" }}
          />
        </div>

        <button
          id="btn-promover-mayorista"
          onClick={onPromover}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "linear-gradient(135deg,#708090,#5a6a7a)",
            border: "none",
            borderRadius: 10,
            padding: "9px 18px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(112,128,144,0.35)",
            color: "#fff",
            fontSize: "0.82rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          <UserPlus size={14} />
          Promover Usuario
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: "linear-gradient(90deg,#708090,#5a6a7a)", color: "#fff" }}>
              {["#", "Nombre", "Correo", "Estado"].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "12px 14px",
                    textAlign: "left",
                    fontSize: "0.72rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "#8C9796" }}>Cargando...</td></tr>
            ) : filtrados.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: 32, color: "#8C9796" }}>Sin mayoristas registrados</td></tr>
            ) : (
              filtrados.map((m, i) => (
                <tr key={m.id} style={{ background: i % 2 === 0 ? "#fff" : "#FAFAF8" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#B76E79,#9d5a64)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <UserCheck size={14} style={{ color: "#fff" }} />
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontWeight: 600, fontSize: "0.85rem" }}>
                    {m.nombre ?? "—"}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: "0.82rem", color: "#4a5568" }}>
                    {m.correo}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        background: m.activo ? "rgba(183,110,121,0.1)" : "rgba(112,128,144,0.1)",
                        color: m.activo ? "#B76E79" : "#708090",
                        borderRadius: 20,
                        padding: "3px 12px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                      }}
                    >
                      {m.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtrados.map(m => (
          <div
            key={m.id}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "14px 16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              border: "1px solid rgba(112,128,144,0.12)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#B76E79,#9d5a64)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <UserCheck size={18} style={{ color: "#fff" }} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.88rem" }}>{m.nombre}</p>
              <p style={{ fontSize: "0.75rem", color: "#708090" }}>{m.correo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
