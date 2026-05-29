import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),

      federation({
        name: "host",

        dts: false,

        remotes: {
          catalog: {
            type: "module",
            name: "catalog",
            entry: env.VITE_CATALOG_REMOTE,
            shareScope: "default",
          },

          checkout: {
            type: "module",
            name: "checkout",
            entry: env.VITE_CHECKOUT_REMOTE,
            shareScope: "default",
          },

          cart: {
            type: "module",
            name: "cart",
            entry: env.VITE_CART_REMOTE,
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
  };
});
