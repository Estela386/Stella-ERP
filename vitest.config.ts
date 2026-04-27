import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom", // Simula el navegador para componentes React
    globals: true, // Permite usar describe, it, expect sin importarlos en cada archivo
    include: ["**/*.test.ts", "**/*.test.tsx"], // Busca archivos que terminen en .test.ts o .tsx
  },
});
