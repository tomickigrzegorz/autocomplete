import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@tomickigrzegorz/autocomplete/css",
        replacement: path.resolve(__dirname, "../../dist/css/autocomplete.min.css"),
      },
      {
        find: "@tomickigrzegorz/autocomplete-vue",
        replacement: path.resolve(__dirname, "../../packages/vue/src/index.ts"),
      },
      {
        find: "@tomickigrzegorz/autocomplete",
        replacement: path.resolve(__dirname, "../../dist/js/autocomplete.esm.js"),
      },
    ],
  },
});
