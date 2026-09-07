import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "OBIX NEXUS — Personal FPV OS",
        short_name: "OBIX NEXUS",
        description:
          "OBIX NEXUS is a personal FPV operating system for managing drones, configuration, tuning, analytics and AI tools.",
        theme_color: "#050b14",
        background_color: "#050b14",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ],
  server: { port: 5173 },
});
