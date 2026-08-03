import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { AuthCard, VerifyCodeCard } from "@ecomm/ui";
import { useAuthStore } from "@ecomm/auth";
import { useAuthPageState } from "../hooks";

function LoginPage() {
  const navigate = useNavigate();
  const state = useAuthPageState("login");

  if (state.step === "verify" && state.pending) {
    return (
      <VerifyCodeCard
        email={state.pending.email}
        title="Verify your email"
        onSubmit={state.handleVerify}
        onResend={state.handleResend}
        onBack={state.handleBackToCredentials}
        isLoading={state.verify.isLoading}
        isResending={state.verify.isResending}
        error={state.verify.error}
        locked={state.verify.locked}
      />
    );
  }

  return (
    <AuthCard
      mode={state.mode}
      onModeChange={state.handleModeChange}
      onLogin={state.handleLogin}
      onSignup={state.handleSignup}
      isLoading={state.isPending}
      error={state.errorMessage}
      onGoogleLogin={import.meta.env.VITE_GOOGLE_OAUTH_URL ? state.handleGoogleLogin : undefined}
      onForgotPassword={() => navigate({ to: "/forgot-password" })}
    />
  );
}

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: "/" });
  },
  component: LoginPage,
});
