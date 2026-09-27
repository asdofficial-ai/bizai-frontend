import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Temporary migration plugin: App.jsx still contains the original Website component.
// Route the live Website screen to the upgraded WebsiteAI.jsx implementation
// without disturbing the rest of the existing BizAI application.
const wireWebsiteAI = {
  name: "wire-website-ai",
  enforce: "pre",
  transform(code, id) {
    if (!id.endsWith("/src/App.jsx") && !id.endsWith("\\src\\App.jsx")) return null;
    if (!code.includes("<Website profile={profile}/>")) return null;
    const imported = `import WebsiteAI from "./WebsiteAI.jsx";\n${code}`;
    return {
      code: imported.replace("<Website profile={profile}/>", "<WebsiteAI profile={profile}/>"),
      map: null,
    };
  },
};

// In local dev, requests to /api/* are forwarded to the backend on :3001.
export default defineConfig({
  plugins: [wireWebsiteAI, react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
