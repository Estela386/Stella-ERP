"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";

export type PeriodoTab = "DIARIO" | "SEMANAL" | "MENSUAL" | "ANUAL";

interface ReportFiltersProps {
  activeTab: PeriodoTab;
  onTabChange: (t: PeriodoTab) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (d: string) => void;
  onEndDateChange: (d: string) => void;
  onExport?: () => void;
}

export default function ReportFilters({
  activeTab, onTabChange,
  startDate, endDate,
  onStartDateChange, onEndDateChange,
  onExport
}: ReportFiltersProps) {

  const TABS: PeriodoTab[] = ["DIARIO", "SEMANAL", "MENSUAL", "ANUAL"];

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 14,
      background: "#fff",
      borderRadius: 16,
      padding: "16px 24px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.03)",
      border: "1px solid rgba(0,0,0,0.04)"
    }}>
      {/* Title */}
      <h2 style={{
        fontFamily: "var(--font-marcellus)",
        fontSize: "1.4rem", fontWeight: 800, color: "#708090", margin: 0,
      }}>
        Reportes
      </h2>

      {/* Center Tabs in Spanish */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            style={{
              fontFamily: "var(--font-marcellus)",
              fontSize: "0.75rem", fontWeight: activeTab === t ? 700 : 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: activeTab === t ? "#b76e79" : "#8A94A6",
              background: "none", border: "none", cursor: "pointer",
              padding: "6px 10px",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Actions (Dates + Export) */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          type="date"
          value={startDate}
          onChange={e => onStartDateChange(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8,
            border: "1px solid #E2E8F0",
            fontFamily: "var(--font-poppins)",
            fontSize: "0.75rem", fontWeight: 600, color: "#4A5568",
            outline: "none", cursor: "pointer",
            background: "#fff"
          }}
        />
        <input
          type="date"
          value={endDate}
          onChange={e => onEndDateChange(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: 8,
            border: "1px solid #E2E8F0",
            fontFamily: "var(--font-poppins)",
            fontSize: "0.75rem", fontWeight: 600, color: "#4A5568",
            outline: "none", cursor: "pointer",
            background: "#fff"
          }}
        />
        
        {onExport && (
          <button
            onClick={onExport}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 10,
              background: "#2d3748", color: "#fff",
              fontFamily: "var(--font-sans)", fontSize: "0.75rem", fontWeight: 700,
              border: "none", cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.background = "#000"}
            onMouseOut={e => e.currentTarget.style.background = "#2d3748"}
          >
            <Download size={16} />
            EXCEL CONTABLE
          </button>
        )}
      </div>
    </div>
  );
}
