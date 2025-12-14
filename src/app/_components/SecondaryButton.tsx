import React from "react";

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  selected?: boolean;
}

export default function SecondaryButton({
  children,
  className = "",
  selected = false,
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      className={`cursor-pointer px-4 py-1 rounded border border-[#7c5c4a] text-[#7c5c4a] bg-white transition-colors duration-200 text-base ${selected ? "bg-[#e5d3c2] font-semibold" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
