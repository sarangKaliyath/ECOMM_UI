import "./App.css";
import { useEffect, useState } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { useTokenRefresh, useBootstrapSession, waitForAuthReady } from "@ecomm/auth";
import { useNavigationStore } from "@ecomm/navigation";

const queryClient = new QueryClient();

useNavigationStore.getState().setNavigate((path) => router.navigate({ to: path as any }));

function AuthInitializer() {
  useBootstrapSession();
  useTokenRefresh();

  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    waitForAuthReady().then(() => setAuthReady(true));
  }, []);

  if (!authReady) return null;
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
    </QueryClientProvider>
  );
}
