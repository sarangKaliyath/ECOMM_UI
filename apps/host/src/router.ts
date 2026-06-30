import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root";
import { indexRoute } from "./routes/index";
import { cartRoute } from "./routes/cart";
import { loginRoute } from "./routes/login";
import { signupRoute } from "./routes/signup";
import { oauthCallbackRoute } from "./routes/callback";

const routeTree = rootRoute.addChildren([indexRoute, cartRoute, loginRoute, signupRoute, oauthCallbackRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
