import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/features": resolve(__dirname, "src/features"),
      "@/shared": resolve(__dirname, "src/shared"),
      "@/windows": resolve(__dirname, "src/windows"),
    },
  },
});
