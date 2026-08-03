import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useLogout } from "@ecomm/auth";
import { useCartStore } from "@ecomm/cart";

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const signOut = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        queryClient.clear();
        useCartStore.getState().clearCart();
        navigate({ to: "/login" });
      },
    });
  };

  return { signOut, isPending: logoutMutation.isPending };
}
