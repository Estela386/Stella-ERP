"use client";

interface StatsRingProps {
  label: string;
  value: number;       // 0-100
  color: string;
  size?: number;
  strokeWidth?: number;
  darkMode?: boolean;
}

export default function StatsRing({
  label, value, color,
  size = 80, strokeWidth = 6,
  darkMode = false,
}: StatsRingProps) {
  const radius       = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference - (value / 100) * circumference;

  const trackColor = darkMode ? "rgba(246,244,239,0.12)" : "rgba(112,128,144,0.12)";
  const valueColor = darkMode ? "rgba(246,244,239,0.92)" : "#1C1C1C";
  const labelColor = darkMode ? "rgba(246,244,239,0.5)"  : "#8C9796";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={trackColor} strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(.22,1,.36,1)" }}
          />
        </svg>
        {/* Center % */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-marcellus)",
          fontSize: "1rem", fontWeight: 400,
          color: valueColor,
        }}>
          {value}%
        </div>
      </div>
      <span style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.62rem", fontWeight: 600,
        letterSpacing: "0.07em", textTransform: "uppercase",
        color: labelColor,
        textAlign: "center",
      }}>
        {label}
      </span>
    </div>
  );
}
