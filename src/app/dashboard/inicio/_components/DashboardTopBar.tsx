"use client";

import { useAuth }     from "@/lib/hooks/useAuth";
import { useNotificaciones } from "@lib/hooks/useNotificaciones";
import { Bell, Search, Plus } from "lucide-react";
import { useRouter }   from "next/navigation";
import { useState }    from "react";
import NotificacionesPanel from "./NotificacionesPanel";

export default function DashboardTopBar() {
  const { usuario }       = useAuth();
  const router            = useRouter();
  const [focused, setFocused] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // Un solo hook compartido entre el botón y el panel
  const { notificaciones, noLeidas, loading, marcarLeida, marcarTodasLeidas, eliminar } =
    useNotificaciones();

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

        {/* Bell — conectado al panel de notificaciones */}
        <div style={{ position: "relative" }}>
          <button
            id="btn-notificaciones"
            onClick={() => setPanelOpen((p) => !p)}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: panelOpen ? "#F0E8EA" : "#F6F3EF",
              border: `1px solid ${panelOpen ? "rgba(183,110,121,0.35)" : "rgba(112,128,144,0.18)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative",
              transition: "all 0.18s ease",
            }}
          >
            <Bell size={15} style={{ color: panelOpen ? "#B76E79" : "#708090" }} />

            {/* Badge número de no leídas */}
            {noLeidas > 0 ? (
              <div style={{
                position: "absolute", top: -5, right: -5,
                minWidth: 16, height: 16,
                borderRadius: 8,
                background: "#B76E79",
                border: "2px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 3px",
              }}>
                <span style={{
                  color: "#fff",
                  fontSize: "0.55rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  lineHeight: 1,
                }}>
                  {noLeidas > 99 ? "99+" : noLeidas}
                </span>
              </div>
            ) : (
              /* Dot estático cuando no hay notificaciones sin leer */
              <div style={{
                position: "absolute", top: 7, right: 7,
                width: 6, height: 6, borderRadius: "50%",
                background: "#B76E79",
                border: "1.5px solid #F6F3EF",
              }} />
            )}
          </button>

          {/* Panel dropdown — recibe los datos del hook */}
          <NotificacionesPanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            notificaciones={notificaciones}
            noLeidas={noLeidas}
            loading={loading}
            onMarcarLeida={marcarLeida}
            onMarcarTodas={marcarTodasLeidas}
            onEliminar={eliminar}
          />
        </div>

        {/* Nueva Venta */}
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
