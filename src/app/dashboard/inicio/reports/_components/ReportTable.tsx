"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  costo: number;
  precio: number;
  ganancia: number;
  margen: number;
}

const PRODUCTOS: Producto[] = [
  { id: 1, nombre: "Anillo Solitario Oro 14k",  categoria: "Anillos",    cantidad: 45,  costo: 78000,  precio: 157500, ganancia: 79500, margen: 50.5 },
  { id: 2, nombre: "Pulsera Tennis Diamantes",   categoria: "Pulseras",   cantidad: 38,  costo: 91000,  precio: 114400, ganancia: 23400, margen: 20.5 },
  { id: 3, nombre: "Collar Perlas Naturales",    categoria: "Collares",   cantidad: 62,  costo: 34400,  precio: 88200,  ganancia: 53800, margen: 61.0 },
  { id: 4, nombre: "Aretes Perla Premium",        categoria: "Aretes",     cantidad: 84,  costo: 28000,  precio: 72600,  ganancia: 44600, margen: 61.4 },
  { id: 5, nombre: "Dije Oro Rosado",             categoria: "Accesorios", cantidad: 110, costo: 18200,  precio: 54100,  ganancia: 35900, margen: 66.4 },
  { id: 6, nombre: "Anillo Compromiso Platino",   categoria: "Anillos",    cantidad: 12,  costo: 110000, precio: 210000, ganancia: 100000,margen: 47.6 },
  { id: 7, nombre: "Pulsera Eslabón Plata",       categoria: "Pulseras",   cantidad: 76,  costo: 9800,   precio: 24500,  ganancia: 14700, margen: 60.0 },
  { id: 8, nombre: "Collar Cadena Oro 18k",       categoria: "Collares",   cantidad: 29,  costo: 42000,  precio: 98000,  ganancia: 56000, margen: 57.1 },
  { id: 9, nombre: "Aretes Argollas Plata",       categoria: "Aretes",     cantidad: 145, costo: 4200,   precio: 12800,  ganancia: 8600,  margen: 67.2 },
  { id: 10,nombre: "Dije Corazón Oro Rosado",    categoria: "Accesorios", cantidad: 93,  costo: 6800,   precio: 18400,  ganancia: 11600, margen: 63.0 },
  { id: 11,nombre: "Anillo Eternity Oro",         categoria: "Anillos",    cantidad: 21,  costo: 88000,  precio: 168000, ganancia: 80000, margen: 47.6 },
  { id: 12,nombre: "Pulsera Cadena Fina Oro",    categoria: "Pulseras",   cantidad: 58,  costo: 22000,  precio: 48000,  ganancia: 26000, margen: 54.2 },
];

type SortKey = keyof Omit<Producto, "nombre" | "categoria">;
type SortDir = "asc" | "desc";

const PAGE_SIZE = 5;

function money(n: number) { return `$${n.toLocaleString("es-MX")}`; }
function pct(n: number) { return `${n.toFixed(1)}%`; }

const COL: React.CSSProperties = {
  fontFamily: "var(--font-marcellus)",
  fontSize: "0.72rem", fontWeight: 600,
  color: "#8C9796",
  padding: "10px 14px",
  textAlign: "left",
  whiteSpace: "nowrap",
  userSelect: "none",
};

export default function ReportTable() {
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("ganancia");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page,    setPage]    = useState(1);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  };

  const filtered = useMemo(() =>
    PRODUCTOS.filter(p =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) =>
      sortDir === "asc" ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    ),
    [search, sortKey, sortDir]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown size={11} style={{ opacity: 0.35 }} />;
    return sortDir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />;
  };

  const TH = ({ label, col }: { label: string; col: SortKey }) => (
    <th
      style={{ ...COL, cursor: "pointer" }}
      onClick={() => handleSort(col)}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label} <SortIcon k={col} />
      </span>
    </th>
  );

  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(112,128,144,0.11)",
      borderTop: "3px solid #708090",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 1px 6px rgba(112,128,144,0.07)",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", borderBottom: "1px solid #F0EDE8",
        flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <h3 style={{
            fontFamily: "var(--font-marcellus)",
            fontSize: "0.9rem", fontWeight: 700, color: "#1C1C1C", margin: 0,
          }}>
            Detalle de Productos
          </h3>
          <p style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "0.67rem", color: "#8C9796", margin: "2px 0 0",
          }}>
            {filtered.length} productos · haz clic en columnas para ordenar
          </p>
        </div>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#F6F3EF", borderRadius: 10, padding: "7px 12px",
          border: "1px solid rgba(112,128,144,0.15)",
        }}>
          <Search size={13} style={{ color: "#8C9796" }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar producto o categoría..."
            style={{
              background: "none", border: "none", outline: "none",
              fontFamily: "var(--font-poppins)",
              fontSize: "0.78rem", color: "#1C1C1C", width: 200,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8F6F2", borderBottom: "1px solid #F0EDE8" }}>
              <th style={{ ...COL, minWidth: 180 }}>Producto</th>
              <th style={COL}>Categoría</th>
              <TH label="Qty" col="cantidad" />
              <TH label="Costo" col="costo" />
              <TH label="Precio" col="precio" />
              <TH label="Ganancia" col="ganancia" />
              <TH label="Margen %" col="margen" />
            </tr>
          </thead>
          <tbody>
            {paged.map((p, i) => {
              const margenColor = p.margen >= 55 ? "#3d8c60" : p.margen >= 40 ? "#b07830" : "#B76E79";
              return (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: i < paged.length - 1 ? "1px solid #F7F4F0" : "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#FAFAF8")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                >
                  <td style={{ padding: "10px 14px" }}>
                    <p style={{
                      fontFamily: "var(--font-poppins)",
                      fontSize: "0.78rem", fontWeight: 600, color: "#1C1C1C",
                      margin: 0, whiteSpace: "nowrap",
                    }}>{p.nombre}</p>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      background: "#F0EDE8", borderRadius: 20, padding: "2px 10px",
                      fontFamily: "var(--font-poppins)",
                      fontSize: "0.65rem", fontWeight: 600, color: "#708090",
                    }}>{p.categoria}</span>
                  </td>
                  {[p.cantidad, null, null, null, null].map((_, idx) => null)}
                  <td style={{ padding: "10px 14px", fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#1C1C1C", fontWeight: 500 }}>{p.cantidad}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#708090" }}>{money(p.costo)}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "var(--font-poppins)", fontSize: "0.78rem", color: "#1C1C1C", fontWeight: 600 }}>{money(p.precio)}</td>
                  <td style={{ padding: "10px 14px", fontFamily: "var(--font-poppins)", fontSize: "0.85rem", fontWeight: 700, color: "#3d8c60" }}>{money(p.ganancia)}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center",
                      background: margenColor === "#3d8c60" ? "#EDF5F0" : margenColor === "#b07830" ? "#FDF3E7" : "#FDECEA",
                      borderRadius: 20, padding: "3px 10px",
                      fontFamily: "var(--font-poppins)",
                      fontSize: "0.7rem", fontWeight: 700,
                      color: margenColor,
                    }}>
                      {pct(p.margen)}
                    </span>
                  </td>
                </tr>
              );
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "28px", textAlign: "center", color: "#8C9796", fontSize: "0.8rem" }}>
                  No se encontraron productos con ese criterio
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 18px", borderTop: "1px solid #F0EDE8",
        flexWrap: "wrap", gap: 8,
      }}>
        <span style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "0.7rem", color: "#8C9796",
        }}>
          Mostrando {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "1px solid #E8E5E0",
              background: page === 1 ? "#F8F6F2" : "#fff", cursor: page === 1 ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: page === 1 ? "#C8C4BC" : "#708090",
            }}
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              style={{
                width: 30, height: 30, borderRadius: 8, border: "1px solid #E8E5E0",
                background: page === n ? "#B76E79" : "#fff",
                cursor: "pointer",
                fontFamily: "var(--font-marcellus)",
                fontSize: "0.72rem", fontWeight: 600,
                color: page === n ? "#fff" : "#708090",
                boxShadow: page === n ? "0 2px 6px rgba(183,110,121,0.3)" : "none",
              }}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "1px solid #E8E5E0",
              background: page === totalPages ? "#F8F6F2" : "#fff",
              cursor: page === totalPages ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: page === totalPages ? "#C8C4BC" : "#708090",
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
