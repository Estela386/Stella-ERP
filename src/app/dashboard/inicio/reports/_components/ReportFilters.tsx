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
}

export default function ReportFilters({
  activeTab, onTabChange,
  startDate, endDate,
  onStartDateChange, onEndDateChange
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
              color: activeTab === t ? "#11d198" : "#8A94A6",
              background: "none", border: "none", cursor: "pointer",
              padding: "6px 10px",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Date Pickers */}
      <div style={{ display: "flex", gap: 10 }}>
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
      </div>
    </div>
  );
}
