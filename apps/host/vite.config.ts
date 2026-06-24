import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

const remoteHMRBridge = (ports: number[]): Plugin => ({
  name: "remote-hmr-bridge",
  apply: "serve",
  transformIndexHtml: {
    order: "post",
    handler: () => [
      {
        tag: "script",
        attrs: { type: "module" },
        injectTo: "body",
        children: `
          ${JSON.stringify(ports)}.forEach(port => {
            const ws = new WebSocket('ws://localhost:' + port, 'vite-hmr');
            ws.addEventListener('message', ({ data }) => {
              try {
                const { type } = JSON.parse(data);
                if (type === 'full-reload' || type === 'update') location.reload();
              } catch (_) {}
            });
          });
        `,
      },
    ],
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      remoteHMRBridge([3001, 3002, 3003]),

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
