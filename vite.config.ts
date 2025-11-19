import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import svgr from "vite-plugin-svgr";

const host = process.env.TAURI_DEV_HOST;

const __dirname = import.meta.dirname;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        overlay: resolve(__dirname, "overlay/index.html"),
      },
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
