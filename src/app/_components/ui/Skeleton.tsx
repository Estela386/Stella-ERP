"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({ 
  width = "100%", 
  height = "1rem", 
  borderRadius = "0.5rem", 
  className = "", 
  style 
}: SkeletonProps) {
  return (
    <motion.div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "rgba(112, 128, 144, 0.1)",
        ...style,
      }}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.8, 
        repeat: Infinity, 
        repeatType: "reverse", 
        ease: "easeInOut" 
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
          width: "200%",
        }}
        animate={{ 
          x: ["-100%", "100%"] 
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    </motion.div>
  );
}
