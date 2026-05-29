import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host",

      remotes: {
        catalog: {
          type: "module",
          name: "catalog",
          entry: "http://localhost:3001/remoteEntry.js",
          shareScope: "default",
        },
        checkout: {
          type: "module",
          name: "checkout",
          entry: "http://localhost:3002/remoteEntry.js",
          shareScope: "default",
        },
      },

      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
      },
    }),
  ],

  server: {
    port: 3000,
    origin: "http://localhost:3000",
  },

  preview: {
    port: 3000,
  },
});