import { LogIn, X } from "lucide-react";

interface Props {
  open: boolean;
  onLogin: () => void;
  onClose?: () => void;
  title?: string;
  message?: string;
  loginLabel?: string;
}

export default function LoginPromptModal({
  open,
  onLogin,
  onClose,
  title = "Please Log In",
  message = "You need to be logged in to continue.",
  loginLabel = "Log In",
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <LogIn size={22} />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <button
          onClick={onLogin}
          className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {loginLabel}
        </button>
      </div>
    </div>
  );
}
