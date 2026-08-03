import { useState } from "react";
import {
  useLogin,
  useSignup,
  useSendVerification,
  useConfirmVerification,
  getAuthErrorMessage,
  getErrorStatus,
} from "@ecomm/auth";
import { usePostAuth } from "./usePostAuth";

type Mode = "login" | "signup";
type Step = "credentials" | "verify";

interface Pending {
  email: string;
  password: string;
}

export function useAuthPageState(initialMode: Mode) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<Step>("credentials");
  const [pending, setPending] = useState<Pending | null>(null);
  const [locked, setLocked] = useState(false);

  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const sendVerificationMutation = useSendVerification();
  const confirmVerificationMutation = useConfirmVerification();
  const postAuth = usePostAuth();

  const isPending = loginMutation.isPending || signupMutation.isPending;
  const activeError = mode === "login" ? loginMutation.error : signupMutation.error;
  const errorMessage = activeError
    ? getAuthErrorMessage(activeError, "Something went wrong")
    : undefined;

  const handleModeChange = (next: Mode) => {
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
      {
        onSuccess: () => {
          setPending({ email, password });
          setStep("verify");
        },
      },
    );
  };

  const handleVerify = (code: string) => {
    if (!pending) return;
    setLocked(false);
    confirmVerificationMutation.mutate(
      { email: pending.email, code, verificationType: "EMAIL_VERIFICATION" },
      {
        onSuccess: () => {
          loginMutation.mutate(pending, { onSuccess: postAuth });
        },
        onError: (err) => {
          if (getErrorStatus(err) === 429) setLocked(true);
        },
      },
    );
  };

  const handleResend = () => {
    if (!pending) return;
    sendVerificationMutation.mutate({
      email: pending.email,
      verificationType: "EMAIL_VERIFICATION",
    });
  };

  const handleBackToCredentials = () => {
    confirmVerificationMutation.reset();
    setLocked(false);
    setStep("credentials");
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_OAUTH_URL as string;
  };

  return {
    mode,
    step,
    pending,
    isPending,
    errorMessage,
    handleModeChange,
    handleLogin,
    handleSignup,
    handleVerify,
    handleResend,
    handleBackToCredentials,
    handleGoogleLogin,
    verify: {
      isLoading: confirmVerificationMutation.isPending || loginMutation.isPending,
      isResending: sendVerificationMutation.isPending,
      error: confirmVerificationMutation.error
        ? getAuthErrorMessage(confirmVerificationMutation.error, "Invalid code")
        : undefined,
      locked,
    },
  };
}
