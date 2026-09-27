import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.esm.js" : "index.js"),
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@tomickigrzegorz/autocomplete",
      ],
      output: {
        // client component (useEffect/useRef) — required by React Server
        // Components (e.g. Next.js App Router); added as a banner because
        // rollup strips module-level directives from the source
        banner: '"use client";',
      },
    },
  },
});
