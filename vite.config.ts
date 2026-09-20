import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/DivisaoComprasEmGrupo/" : "/",
  plugins: [react()],
  worker: { format: "es" },
  test: { environment: "node", testTimeout: 60000 },
});
