import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { refreshTokenApi, useAuthStore } from "@ecomm/auth";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { mergeCartApi, useCartStore } from "@ecomm/cart";

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    refreshTokenApi()
      .then(async ({ accessToken, expiresIn }) => {
        setAuth(accessToken, expiresIn);
        try {
          const { data } = await mergeCartApi();
          queryClient.setQueryData(["cart", "USER"], data);
          useCartStore.getState().setItems(
            data.cartItems.map((item) => ({
              id: item.productId,
              name: item.productName,
              price: item.priceSnapshot,
              quantity: item.quantity,
              imageUrl: item.imageUrl,
            })),
          );
        } catch {
          // non-fatal: proceed even if merge fails
        }
        navigate({ to: "/" });
      })
      .catch(() => {
        clearAuth();
        navigate({ to: "/login" });
      });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-gray-500 text-sm">
      Signing you in…
    </div>
  );
}

export const oauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/oauth/callback",
  component: OAuthCallbackPage,
});
