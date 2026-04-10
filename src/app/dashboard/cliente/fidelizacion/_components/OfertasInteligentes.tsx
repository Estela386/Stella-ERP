"use client";

import type { ProductoRotacionAnalisis } from "@/lib/models/ProductoDescuento";
import Image from "next/image";

interface OfertasInteligentesProps {
  productos: ProductoRotacionAnalisis[];
}

export default function OfertasInteligentes({ productos }: OfertasInteligentesProps) {
  if (productos.length === 0) {
    return (
      <div style={{
        background:"#fff",
        borderRadius:16,
        padding:"24px",
        border:"1.5px dashed rgba(140,151,104,0.3)",
        textAlign:"center"
      }}>
        <div style={{ fontSize:"2rem", marginBottom:8 }}>📦</div>
        <p style={{ margin:0, fontSize:"0.88rem", color:"#708090", fontFamily:"var(--font-sans)" }}>
          No hay ofertas especiales en este momento
        </p>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {productos.slice(0, 6).map((prod) => {
        const ahorro = prod.precio - (prod.precio_con_descuento ?? prod.precio);
        const diasLabel =
          prod.dias_sin_venta >= 120 ? "120+ días sin venta" :
          prod.dias_sin_venta >= 60  ? "60+ días sin venta"  :
                                        "30+ días sin venta";
        const urgencia =
          prod.dias_sin_venta >= 120 ? "#dc3545" :
          prod.dias_sin_venta >= 60  ? "#fd7e14" : "#ffc107";

        return (
          <div key={prod.id_producto} style={{
            background:"#fff",
            borderRadius:14,
            padding:"14px",
            border:"1.5px solid rgba(140,151,104,0.12)",
            display:"flex",
            gap:14,
            alignItems:"center",
            position:"relative",
            overflow:"hidden",
            boxShadow:"0 2px 8px rgba(0,0,0,0.04)"
          }}>
            {/* Badge rotación */}
            <div style={{
              position:"absolute",
              top:8, right:8,
              background:`${urgencia}22`,
              border:`1px solid ${urgencia}44`,
              borderRadius:6,
              padding:"2px 8px",
              fontSize:"0.6rem",
              fontWeight:700,
              color:urgencia,
              fontFamily:"var(--font-sans)",
              letterSpacing:"0.06em"
            }}>
              🔥 {diasLabel}
            </div>

            {/* Imagen */}
            <div style={{
              width:56, height:56, borderRadius:10, flexShrink:0,
              background:"rgba(246,244,239,0.8)",
              overflow:"hidden", position:"relative"
            }}>
              {prod.url_imagen ? (
                <Image
                  src={prod.url_imagen}
                  alt={prod.nombre ?? ""}
                  fill
                  style={{ objectFit:"cover" }}
                  sizes="56px"
                />
              ) : (
                <div style={{
                  width:"100%", height:"100%",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"1.5rem"
                }}>📦</div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex:1, minWidth:0, paddingRight:70 }}>
              <p style={{ margin:0, fontWeight:600, fontSize:"0.9rem", fontFamily:"var(--font-sans)", color:"#1a1a2e", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {prod.nombre ?? "Producto"}
              </p>
              <div style={{ display:"flex", alignItems:"baseline", gap:8, marginTop:4 }}>
                <span style={{ fontSize:"1.1rem", fontWeight:800, color:"#b76e79", fontFamily:"var(--font-display)" }}>
                  ${prod.precio_con_descuento?.toLocaleString() ?? prod.precio.toLocaleString()}
                </span>
                {prod.precio_con_descuento && (
                  <span style={{ fontSize:"0.78rem", color:"#708090", textDecoration:"line-through" }}>
                    ${prod.precio.toLocaleString()}
                  </span>
                )}
                {prod.porcentaje_descuento && (
                  <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#2d6a4f", background:"rgba(45,106,79,0.1)", padding:"2px 6px", borderRadius:4 }}>
                    -{prod.porcentaje_descuento}%
                  </span>
                )}
              </div>
              {ahorro > 0 && (
                <p style={{ margin:"2px 0 0", fontSize:"0.7rem", color:"#2d6a4f", fontFamily:"var(--font-sans)" }}>
                  Ahorras ${ahorro.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
