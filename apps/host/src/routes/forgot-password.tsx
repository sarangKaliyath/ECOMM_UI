import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { ForgotPasswordCard, VerifyCodeCard, ResetPasswordCard } from "@ecomm/ui";
import {
  useAuthStore,
  useSendVerification,
  useConfirmVerification,
  useResetPassword,
  getAuthErrorMessage,
  getErrorStatus,
} from "@ecomm/auth";
import { useState } from "react";

type Step = "request" | "verify" | "reset" | "done";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [locked, setLocked] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [restartMessage, setRestartMessage] = useState<string | undefined>();

  const sendMutation = useSendVerification();
  const confirmMutation = useConfirmVerification();
  const resetMutation = useResetPassword();

  const handleRequest = (enteredEmail: string) => {
    setEmail(enteredEmail);
    setRestartMessage(undefined);
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
        onSuccess: (data) => {
          setResetToken(data.resetToken ?? null);
          setStep("reset");
        },
        onError: (err) => {
          if (getErrorStatus(err) === 429) setLocked(true);
        },
      },
    );
  };

  const handleReset = (newPassword: string) => {
    if (!resetToken) return;
    resetMutation.mutate(
      { resetToken, newPassword },
      {
        onSuccess: () => setStep("done"),
        onError: (err) => {
          if (getErrorStatus(err) === 401) {
            setResetToken(null);
            setRestartMessage(
              getAuthErrorMessage(
                err,
                "Your reset link expired. Please request a new code.",
              ),
            );
            setStep("request");
          }
        },
      },
    );
  };

  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden px-8 py-8 text-center flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Password changed
          </h2>
          <p className="text-sm text-gray-500">
            Your password has been updated. Please sign in again with your
            new password.
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

  if (step === "reset") {
    return (
      <ResetPasswordCard
        onSubmit={handleReset}
        isLoading={resetMutation.isPending}
        error={
          resetMutation.error
            ? getAuthErrorMessage(resetMutation.error, "Something went wrong")
            : undefined
        }
      />
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
        restartMessage ??
        (sendMutation.error
          ? getAuthErrorMessage(sendMutation.error, "Something went wrong")
          : undefined)
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
