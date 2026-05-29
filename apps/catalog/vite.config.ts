import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "catalog",
      filename: "remoteEntry.js",
      dts: false,
      
      exposes: {
        "./CatalogApp": "./src/App.tsx",
      },

      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
        },
      },
    }),
  ],

  build: {
    target: "esnext",
  },

  server: {
    port: 3001,
    origin: "http://localhost:3001",
  },

  preview: {
    port: 3001,
  },
});