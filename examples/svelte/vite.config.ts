import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: [
      {
        find: "@tomickigrzegorz/autocomplete/css",
        replacement: path.resolve(__dirname, "../../dist/css/autocomplete.min.css"),
      },
      {
        find: "@tomickigrzegorz/autocomplete-svelte",
        replacement: path.resolve(__dirname, "../../packages/svelte/src/index.svelte"),
      },
      {
        find: "@tomickigrzegorz/autocomplete",
        replacement: path.resolve(__dirname, "../../dist/js/autocomplete.esm.js"),
      },
    ],
  },
});
