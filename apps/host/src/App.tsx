import "./App.css";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { useTokenRefresh } from "@ecomm/auth";

const queryClient = new QueryClient();

function AuthInitializer() {
  useTokenRefresh();
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
    </QueryClientProvider>
  );
}
