import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // change base if deploying via GitHub actions
  // (needs to take the path into account)
  base: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/` : "/",
  // instead of one JS file create one for each dependency
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }
          const parts = id.split("node_modules/")[1].split("/");
          // Scoped package: @scope/package
          if (parts[0].startsWith("@")) {
            return `${parts[0]}-${parts[1]}`;
          }
          // Normal package: package
          return parts[0];
        },
      },
    },
  },
});
