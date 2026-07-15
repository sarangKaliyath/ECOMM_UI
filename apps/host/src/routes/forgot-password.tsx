import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { ForgotPasswordCard, VerifyCodeCard } from "@ecomm/ui";
import {
  useAuthStore,
  useSendVerification,
  useConfirmVerification,
  getAuthErrorMessage,
  getErrorStatus,
} from "@ecomm/auth";
import { useState } from "react";

type Step = "request" | "verify" | "done";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [locked, setLocked] = useState(false);

  const sendMutation = useSendVerification();
  const confirmMutation = useConfirmVerification();

  const handleRequest = (enteredEmail: string) => {
    setEmail(enteredEmail);
    sendMutation.mutate(
      { email: enteredEmail, verificationType: "PASSWORD_RESET" },
      { onSuccess: () => setStep("verify") },
    );
  };

  const handleResend = () => {
    sendMutation.mutate({ email, verificationType: "PASSWORD_RESET" });
  };

  const handleVerify = (code: string) => {
    setLocked(false);
    confirmMutation.mutate(
      { email, code, verificationType: "PASSWORD_RESET" },
      {
        onSuccess: () => setStep("done"),
        onError: (err) => {
          if (getErrorStatus(err) === 429) setLocked(true);
        },
      },
    );
  };

  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden px-8 py-8 text-center flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Code verified</h2>
          <p className="text-sm text-gray-500">
            Password reset isn&apos;t available yet — check back soon, or
            contact support for help regaining access.
          </p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <VerifyCodeCard
        email={email}
        title="Reset your password"
        description="Enter the 6-digit code we sent to"
        onSubmit={handleVerify}
        onResend={handleResend}
        onBack={() => setStep("request")}
        isLoading={confirmMutation.isPending}
        isResending={sendMutation.isPending}
        error={
          confirmMutation.error
            ? getAuthErrorMessage(confirmMutation.error, "Invalid code")
            : undefined
        }
        locked={locked}
      />
    );
  }

  return (
    <ForgotPasswordCard
      onSubmit={handleRequest}
      onBackToLogin={() => navigate({ to: "/login" })}
      isLoading={sendMutation.isPending}
      error={
        sendMutation.error
          ? getAuthErrorMessage(sendMutation.error, "Something went wrong")
          : undefined
      }
    />
  );
}

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) throw redirect({ to: "/" });
  },
  component: ForgotPasswordPage,
});
