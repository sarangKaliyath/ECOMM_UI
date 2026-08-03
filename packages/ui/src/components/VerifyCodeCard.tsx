import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import OtpInput from "./OtpInput";

interface Props {
  email: string;
  title: string;
  description?: string;
  onSubmit: (code: string) => void;
  onResend: () => void;
  onBack?: () => void;
  isLoading?: boolean;
  isResending?: boolean;
  error?: string;
  locked?: boolean;
  codeLength?: number;
}

const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyCodeCard({
  email,
  title,
  description,
  onSubmit,
  onResend,
  onBack,
  isLoading,
  isResending,
  error,
  locked,
  codeLength = 6,
}: Props) {
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = () => {
    onResend();
    setCode("");
    setCooldown(RESEND_COOLDOWN_SECONDS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === codeLength) onSubmit(code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden px-8 py-8">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <ShieldCheck size={22} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">
            {description ?? "Enter the 6-digit code we sent to"}{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <OtpInput
            length={codeLength}
            value={code}
            onChange={setCode}
            disabled={isLoading || locked}
            error={!!error}
            autoFocus
          />

          <button
            type="submit"
            disabled={isLoading || locked || code.length !== codeLength}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Verifying…" : "Verify Code"}
          </button>

          <div className="flex items-center justify-between text-sm">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || cooldown > 0}
              className="text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {cooldown > 0
                ? `Resend code (${cooldown}s)`
                : isResending
                  ? "Sending…"
                  : "Resend code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
