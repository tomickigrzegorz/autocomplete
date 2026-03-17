import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.svelte"),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.esm.js" : "index.js"),
    },
    rollupOptions: {
      external: ["svelte", "@tomickigrzegorz/autocomplete"],
    },
  },
});
