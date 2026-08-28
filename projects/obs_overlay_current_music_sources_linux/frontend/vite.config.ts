import { type Plugin, type ResolvedConfig, defineConfig } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";

/**
 * Create static routes so that e.g. /edit can be used when deploying the static web server.
 * This means no additional configuration will be necessary for e.g. deploying via GitHub Pages.
 * @param directories A list of routes that should be created as directories containing the index.html
 * @param files A list of routes that should be created as files as copy of index.html
 */
function staticRoutes(directories: string[], files?: string[]): Plugin {
  // Store the output directory after configuration was parsed
  let outDir: string;
  return {
    name: "static-routes",
    configResolved(config: ResolvedConfig) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const bundleIndex = path.join(outDir, "index.html");
      try {
        await fs.access(bundleIndex);
      } catch {
        throw Error(`Unable to create static routes, bundle output not found: ${bundleIndex}`);
      }
      console.log("create static routes...");
      for (const route of directories) {
        const routeDir = path.join(outDir, route);
        await fs.mkdir(routeDir, { recursive: true });
        const routeIndex = path.join(routeDir, "index.html");
        await fs.copyFile(bundleIndex, routeIndex);
        console.log(routeIndex, `(copy of ${bundleIndex})`);
      }
      for (const file of files ?? []) {
        const routeIndex = path.join(outDir, `${file}.html`);
        await fs.copyFile(bundleIndex, routeIndex);
        console.log(routeIndex, `(copy of ${bundleIndex})`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticRoutes(["edit"], ["404"])],
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
  server: {
    // Request to /api will automatically be forward to the target URL (backend)
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api,$/, '')
      },
    },
  },
});
