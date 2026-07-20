import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "rounded-xl border border-gray-200 shadow-sm",
          title: "text-sm font-medium text-gray-900",
          description: "text-sm text-gray-500",
          success: "!bg-emerald-50 !border-emerald-200 !text-emerald-700",
          error: "!bg-red-50 !border-red-200 !text-red-700",
        },
      }}
    />
  );
}
