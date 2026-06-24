import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "cart",
      filename: "remoteEntry.js",
      dts: false,

      exposes: {
        "./CartApp": "./src/bootstrap.tsx",
      },

      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.0.0",
        },
      },
    }),
  ],

  build: {
    target: "esnext",
    cssCodeSplit: false,
  },

  server: {
    port: 3003,
    origin: "http://localhost:3003",
    cors: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3003,
    },
  },

  preview: {
    port: 3003,
  },
});