import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

type Mode = "login" | "signup";

interface Props {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (name: string, email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
  onGoogleLogin?: () => void;
}

export default function AuthCard({
  mode,
  onModeChange,
  onLogin,
  onSignup,
  isLoading,
  error,
  onGoogleLogin,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => onModeChange("login")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              mode === "login"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => onModeChange("signup")}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              mode === "signup"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="px-8 py-8">
          {mode === "login" ? (
            <LoginForm
              onSubmit={onLogin}
              isLoading={isLoading}
              error={error}
              onGoogleLogin={onGoogleLogin}
            />
          ) : (
            <SignupForm
              onSubmit={onSignup}
              isLoading={isLoading}
              error={error}
              onGoogleLogin={onGoogleLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
}
