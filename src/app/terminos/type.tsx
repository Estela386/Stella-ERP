// ─── Tipos para la página de Términos y Condiciones ──────────────────────────

export interface TerminosSection {
  id:      string;   // ancla para navegación interna ej. "privacidad"
  number:  string;   // "1.", "2.", etc.
  title:   string;
  content: TerminosBlock[];
}

export interface TerminosBlock {
  type:    "paragraph" | "subheading" | "list";
  text?:   string;         // para paragraph y subheading
  items?:  string[];       // para list
}

export interface TerminosPageData {
  lastUpdated: string;
  sections:    TerminosSection[];
}