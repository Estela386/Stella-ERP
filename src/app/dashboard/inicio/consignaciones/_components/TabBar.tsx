"use client";

const TABS = [
  { id: "consignaciones", label: "Consignaciones" },
  { id: "mayoristas", label: "Mayoristas" },
  { id: "solicitudes", label: "Solicitudes" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface TabBarProps {
  active: TabId;
  onSelect: (tab: TabId) => void;
  pendientes?: number;
}

export default function TabBar({ active, onSelect, pendientes = 0 }: TabBarProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        background: "#F3F0EB",
        borderRadius: 14,
        padding: 5,
        width: "fit-content",
        flexWrap: "wrap",
      }}
    >
      {TABS.map(tab => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onSelect(tab.id)}
            style={{
              position: "relative",
              padding: "8px 20px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: isActive ? 700 : 500,
              fontFamily: "Manrope,sans-serif",
              color: isActive ? "#fff" : "#708090",
              background: isActive
                ? "linear-gradient(135deg,#B76E79,#9d5a64)"
                : "transparent",
              boxShadow: isActive ? "0 4px 12px rgba(183,110,121,0.3)" : "none",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
            {tab.id === "solicitudes" && pendientes > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  background: "#e53e3e",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {pendientes > 9 ? "9+" : pendientes}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
