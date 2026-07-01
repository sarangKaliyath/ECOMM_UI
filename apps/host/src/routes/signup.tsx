import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { AuthCard } from "@ecomm/ui";
import { useLogin, useSignup, useAuthStore } from "@ecomm/auth";
import { useState, useEffect } from "react";
import { usePostAuth } from "../hooks";

function SignupPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mode, setMode] = useState<"login" | "signup">("signup");

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const postAuth = usePostAuth();

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

  const handleLogin = (email: string, password: string) => {
    loginMutation.mutate({ email, password }, { onSuccess: postAuth });
  };

  const handleSignup = (name: string, email: string, password: string) => {
    signupMutation.mutate(
      { name, email, password },
      { onSuccess: postAuth },
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
