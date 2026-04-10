"use client";

import { motion } from "framer-motion";
import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
      style={{
        background: "rgba(112, 128, 144, 0.02)",
        borderRadius: "var(--radius-xl)",
        border: "1px dashed var(--border-subtle)",
      }}
    >
      <div className="mb-4 p-4 rounded-full bg-white shadow-sm text-slate-400">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-brand text-charcoal mb-2" style={{ fontFamily: "var(--font-marcellus)" }}>
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6" style={{ fontFamily: "var(--font-sans)" }}>
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </motion.div>
  );
}
