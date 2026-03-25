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
        </div>

        {/* Info */}
        <div style={{ padding: "0 2px" }}>
          {category && (
            <p
              style={{
                fontFamily: "var(--font-sans, Inter, sans-serif)",
                fontSize: "0.62rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: "#8c9768",
                marginBottom: 4,
              }}
            >
              {category}
            </p>
          )}

          <h3
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: "1.05rem",
              fontWeight: 600,
              color: hovered ? "#4a5568" : "#708090",
              marginBottom: 6,
              lineHeight: 1.2,
              transition: "color 0.18s ease",
            }}
          >
            {name}
          </h3>

          {/* Stars */}
          {rating && (
            <div
              style={{
                display: "flex",
                gap: 2,
                marginBottom: 8,
              }}
            >
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.7rem",
                    color: i < rating ? "#b76e79" : "rgba(112,128,144,0.25)",
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
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "#4a5568",
              fontStyle: "italic",
            }}
          >
            ${price.toLocaleString()}
          </p>
        </div>
      </div>
    </>
  );
}