import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "checkout",
      filename: "remoteEntry.js",

      exposes: {
        "./CheckoutApp": "./src/App.tsx",
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
    port: 3002,
    origin: "http://localhost:3002",
  },

  preview: {
    port: 3002,
  },
});