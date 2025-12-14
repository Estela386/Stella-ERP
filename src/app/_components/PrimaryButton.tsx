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
      className={`w-full bg-[#b97a7a] text-white py-2 rounded-lg border border-[#6d4747] text-center text-base transition-colors duration-200 hover:bg-[#a05e5e] focus:outline-none focus:ring-2 focus:ring-[#b97a7a] ${className} cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
}
