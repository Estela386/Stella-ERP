"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  rating?: number;
  category?: string;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23ede9e3' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-family='Cormorant Garamond,serif' font-size='20' fill='%23708090' text-anchor='middle' dominant-baseline='middle'%3ESin imagen%3C/text%3E%3C/svg%3E";

export default function ProductCard({
  id,
  name,
  price,
  image,
  rating = 5,
  category,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const imageUrl = !image || imageError ? PLACEHOLDER_IMAGE : image;

  return (
    <>
      <style>{`
              `}</style>

      <div
        className="group cursor-pointer relative"
        style={{ transition: "transform 0.22s cubic-bezier(.22,1,.36,1)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "1/1",
            borderRadius: 14,
            background: "#ede9e3",
            border: "1px solid rgba(112,128,144,0.12)",
            marginBottom: 14,
            boxShadow: hovered
              ? "0 18px 40px rgba(140,151,104,0.22)"
              : "0 2px 12px rgba(140,151,104,0.08)",
            transform: hovered ? "translateY(-5px)" : "translateY(0)",
            transition: "all 0.22s cubic-bezier(.22,1,.36,1)",
          }}
        >
          {/* Sheen line */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1, zIndex: 2,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            }}
          />

          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.5s cubic-bezier(.22,1,.36,1)",
            }}
            onError={() => setImageError(true)}
            priority={false}
          />

          {/* Overlay */}
          <div
            style={{
              position: "absolute", inset: 0,
              background: "rgba(74,85,104,0.04)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.22s ease",
            }}
          />

          {/* Sparkle icon at bottom right matching the spec */}
          <div style={{ position: "absolute", bottom: 12, right: 12, zIndex: 10, opacity: 0.8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "0 2px" }}>
          {category && (
            <p
              style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "0.58rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#8c9768",
                marginBottom: 8,
              }}
            >
              {category}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <h3
              style={{
                fontFamily: "var(--font-marcellus), 'Marcellus', serif",
                fontSize: "1.3rem",
                fontWeight: 400,
                color: hovered ? "#4a5568" : "#2d3748",
                margin: 0,
                lineHeight: 1,
                transition: "color 0.18s ease",
                maxWidth: "65%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {name}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              {/* Stars */}
              {rating && (
                <div style={{ display: "flex", gap: 1 }}>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "0.55rem",
                        color: i < rating ? "#b76e79" : "rgba(112,128,144,0.25)",
                        lineHeight: 1
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <p
                style={{
                  fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "#4a5568",
                  margin: 0,
                  lineHeight: 1,
                  letterSpacing: "0.02em"
                }}
              >
                ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}