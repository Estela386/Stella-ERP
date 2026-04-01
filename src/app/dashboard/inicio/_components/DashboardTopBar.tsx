"use client";

import { useAuth }     from "@/lib/hooks/useAuth";
import { Bell, Search, Plus } from "lucide-react";
import { useRouter }   from "next/navigation";
import { useState }    from "react";

export default function DashboardTopBar() {
  const { usuario }       = useAuth();
  const router            = useRouter();
  const [focused, setFocused] = useState(false);

  const nombre = usuario?.nombre?.split(" ")[0] || "Administrador";

  const hora   = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 18 ? "Buenas tardes" : "Buenas noches";

  const formattedDate = new Date().toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      gap: 16, flexWrap: "wrap",
      padding: "14px 20px",
      background: "#fff",
      border: "1px solid rgba(112,128,144,0.15)",
      borderRadius: 16,
      boxShadow: "0 2px 8px rgba(112,128,144,0.08)",
    }}>
      {/* Greeting */}
      <div>
        <h1 style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "clamp(1rem, 2vw, 1.35rem)",
          fontWeight: 400,
          color: "#708090",
          margin: 0, lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}>
          ¡{saludo}, {nombre}!
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.72rem",
          color: "#8C9796",
          margin: "3px 0 0",
          textTransform: "capitalize",
        }}>
          {formattedDate}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: focused ? "#fff" : "#F6F3EF",
          border: `1px solid ${focused ? "#708090" : "rgba(112,128,144,0.2)"}`,
          borderRadius: 10, padding: "7px 12px",
          transition: "all 0.18s ease",
          width: focused ? 200 : 150,
        }}>
          <Search size={13} style={{ color: "#8C9796", flexShrink: 0 }} />
          <input
            placeholder="Buscar..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              background: "none", border: "none", outline: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "#1C1C1C", width: "100%",
            }}
          />
        </div>

        {/* Bell */}
        <button style={{
          width: 36, height: 36, borderRadius: 10,
          background: "#F6F3EF",
          border: "1px solid rgba(112,128,144,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative",
        }}>
          <Bell size={15} style={{ color: "#708090" }} />
          {/* Alert dot — rose is OK here as it signals a notification */}
          <div style={{
            position: "absolute", top: 7, right: 7,
            width: 6, height: 6, borderRadius: "50%",
            background: "#B76E79",
            border: "1.5px solid #F6F3EF",
          }} />
        </button>

        {/* Nueva Venta — primary action button, rose is correct */}
        <button
          onClick={() => router.push("/dashboard/inicio/nuevaVenta")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#B76E79",
            border: "none", borderRadius: 10,
            padding: "8px 16px", cursor: "pointer",
            boxShadow: "0 3px 10px rgba(183,110,121,0.3)",
            transition: "all 0.18s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#A45F69")}
          onMouseLeave={e => (e.currentTarget.style.background = "#B76E79")}
        >
          <Plus size={13} style={{ color: "#fff" }} />
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem", fontWeight: 600,
            color: "#fff", whiteSpace: "nowrap",
          }}>
            Nueva Venta
          </span>
        </button>
      </div>
    </div>
  );
}
