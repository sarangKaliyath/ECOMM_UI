import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "checkout",
      filename: "remoteEntry.js",
      dts: false,

      exposes: {
        "./CheckoutApp": "./src/bootstrap.tsx",
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
    cssCodeSplit: false,
  },

  server: {
    port: 3002,
    origin: "http://localhost:3002",
  },

  preview: {
    port: 3002,
  },
});