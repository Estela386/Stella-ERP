import React from "react";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`bg-[#b97a7a] text-white px-6 py-2 rounded-lg border border-[#6d4747] text-center text-base font-medium transition-colors duration-200 hover:bg-[#a05e5e] focus:outline-none focus:ring-2 focus:ring-[#b97a7a] ${className} cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
}
