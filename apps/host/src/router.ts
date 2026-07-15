import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root";
import { indexRoute } from "./routes/index";
import { cartRoute } from "./routes/cart";
import { checkoutRoute } from "./routes/checkout";
import { loginRoute } from "./routes/login";
import { signupRoute } from "./routes/signup";
import { forgotPasswordRoute } from "./routes/forgot-password";
import { oauthCallbackRoute } from "./routes/callback";
import { profileRoute } from "./routes/profile";

const routeTree = rootRoute.addChildren([
  indexRoute,
  cartRoute,
  checkoutRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  oauthCallbackRoute,
  profileRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
