import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/",
  plugins: [react()],
  worker: { format: "es" },
  test: { environment: "node", testTimeout: 60000 },
});
