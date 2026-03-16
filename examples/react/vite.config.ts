import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@tomickigrzegorz/autocomplete/css",
        replacement: path.resolve(__dirname, "../../dist/css/autocomplete.min.css"),
      },
      {
        find: "@tomickigrzegorz/autocomplete-react",
        replacement: path.resolve(__dirname, "../../packages/react/src/index.tsx"),
      },
      {
        find: "@tomickigrzegorz/autocomplete",
        replacement: path.resolve(__dirname, "../../dist/js/autocomplete.esm.js"),
      },
    ],
  },
});
