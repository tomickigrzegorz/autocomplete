import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.esm.js" : "index.js"),
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "@tomickigrzegorz/autocomplete"],
    },
  },
});
