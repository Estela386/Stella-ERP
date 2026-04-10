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
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)",
    }}>
      {/* Greeting */}
      <div>
        <h1 style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "clamp(1rem, 2vw, 1.35rem)",
          fontWeight: 400,
          color: "var(--slate)",
          margin: 0, lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}>
          ¡{saludo}, {nombre}!
        </h1>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.72rem",
          color: "var(--slate-light)",
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
          background: focused ? "var(--white)" : "var(--beige)",
          border: `1px solid ${focused ? "var(--slate)" : "var(--border-subtle)"}`,
          borderRadius: 10, padding: "7px 12px",
          transition: "all 0.25s ease",
          width: focused ? 220 : 160,
          boxShadow: focused ? "0 4px 12px rgba(112,128,144,0.1)" : "none",
        }}>
          <Search size={13} style={{ color: "var(--slate-light)", flexShrink: 0 }} />
          <input
            placeholder="Buscar..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              background: "none", border: "none", outline: "none",
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "var(--charcoal)", width: "100%",
            }}
          />
        </div>

        {/* Bell — conectado al panel de notificaciones */}
        <div style={{ position: "relative" }}>
          <button
            id="btn-notificaciones"
            onClick={() => setPanelOpen((p) => !p)}
            style={{
              width: 38, height: 38, borderRadius: 12,
              background: panelOpen ? "var(--beige)" : "var(--beige)",
              border: `1px solid ${panelOpen ? "var(--rose-gold-light)" : "var(--border-subtle)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative",
              transition: "all 0.2s ease",
            }}
          >
            <Bell size={16} style={{ color: panelOpen ? "var(--rose-gold)" : "var(--slate)" }} />

            {/* Badge número de no leídas */}
            {noLeidas > 0 ? (
              <div style={{
                position: "absolute", top: -4, right: -4,
                minWidth: 18, height: 18,
                borderRadius: 9,
                background: "var(--rose-gold)",
                border: "2px solid var(--white)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 3px",
                boxShadow: "0 2px 4px rgba(183,110,121,0.3)",
              }}>
                <span style={{
                  color: "var(--white)",
                  fontSize: "0.58rem",
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
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--rose-gold)",
            border: "none", borderRadius: 12,
            padding: "9px 18px", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(183,110,121,0.25)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--rose-gold-light)", e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--rose-gold)", e.currentTarget.style.transform = "translateY(0)")}
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
