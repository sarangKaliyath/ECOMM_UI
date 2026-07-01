import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { AuthCard } from "@ecomm/ui";
import { useLogin, useSignup, useAuthStore } from "@ecomm/auth";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { mergeCartApi, useCartStore } from "@ecomm/cart";

function SignupPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mode, setMode] = useState<"login" | "signup">("signup");

  const loginMutation = useLogin();
  const signupMutation = useSignup();

  useEffect(() => {
    if (isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated]);

  const isPending = loginMutation.isPending || signupMutation.isPending;
  const activeError =
    mode === "login" ? loginMutation.error : signupMutation.error;
  const errorMessage =
    activeError instanceof Error ? activeError.message : undefined;

  const handleModeChange = (next: "login" | "signup") => {
    loginMutation.reset();
    signupMutation.reset();
    setMode(next);
  };

  const mergeAndNavigate = async () => {
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
  };

  const handleLogin = (email: string, password: string) => {
    loginMutation.mutate({ email, password }, { onSuccess: mergeAndNavigate });
  };

  const handleSignup = (name: string, email: string, password: string) => {
    signupMutation.mutate(
      { name, email, password },
      { onSuccess: mergeAndNavigate },
    );
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_OAUTH_URL as string;
  };

  return (
    <AuthCard
      mode={mode}
      onModeChange={handleModeChange}
      onLogin={handleLogin}
      onSignup={handleSignup}
      isLoading={isPending}
      error={errorMessage}
      onGoogleLogin={import.meta.env.VITE_GOOGLE_OAUTH_URL ? handleGoogleLogin : undefined}
    />
  );
}

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
});
