// ── Tipos para el sistema de FAQ ─────────────────────────────────

export type FaqCategory =
  | "envios"
  | "personalizados"
  | "ubicacion"
  | "materiales"
  | "mayoreo"
  | "general";

export interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  category: FaqCategory;
}

export interface FaqSection {
  id: FaqCategory;
  label: string;
  icon: React.ReactNode;
  description: string;
  items: FaqItem[];
}
