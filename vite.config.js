import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow LAN access for mobile testing
    port: 5173,
  },
  build: {
    target: "esnext",
    // Keep chunks reasonable
    chunkSizeWarningLimit: 1000,
  },
});
