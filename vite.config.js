import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In local dev, requests to /api/* are forwarded to the backend on :3001
// so the browser sees everything as same-origin (no CORS needed locally).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
