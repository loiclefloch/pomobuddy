import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/features": resolve(__dirname, "src/features"),
      "@/shared": resolve(__dirname, "src/shared"),
      "@/windows": resolve(__dirname, "src/windows"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/windows/main/index.html"),
        tray: resolve(__dirname, "src/windows/tray/index.html"),
        settings: resolve(__dirname, "src/windows/settings/index.html"),
      },
    },
  },
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
      ignored: ["**/src-tauri/**"],
    },
  },
}));
