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
      className={`cursor-pointer px-6 py-2 rounded-lg border border-[#7c5c4a] text-[#7c5c4a] bg-white transition-colors duration-200 text-base font-medium hover:bg-[#f5f0ed] focus:outline-none focus:ring-2 focus:ring-[#7c5c4a] ${selected ? "bg-[#e5d3c2]" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
