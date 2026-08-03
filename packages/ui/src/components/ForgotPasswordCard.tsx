import { useState } from "react";
import { Mail } from "lucide-react";

interface Props {
  onSubmit: (email: string) => void;
  onBackToLogin: () => void;
  isLoading?: boolean;
  error?: string;
}

export default function ForgotPasswordCard({
  onSubmit,
  onBackToLogin,
  isLoading,
  error,
}: Props) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden px-8 py-8">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Reset your password
          </h2>
          <p className="text-sm text-gray-500">
            Enter your account email and we&apos;ll send you a verification
            code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Sending…" : "Send Code"}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="text-sm text-gray-500 hover:text-gray-700 text-center"
          >
            Back to sign in
          </button>
        </form>
      </div>
    </div>
  );
}
