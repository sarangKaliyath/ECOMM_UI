import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useLogoutAll } from "@ecomm/auth";
import { useCartStore } from "@ecomm/cart";

export function useSignOutAll() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logoutAllMutation = useLogoutAll();

  const signOutAll = () => {
    logoutAllMutation.mutate(undefined, {
      onSettled: () => {
        queryClient.clear();
        useCartStore.getState().clearCart();
        navigate({ to: "/login" });
      },
    });
  };

  return { signOutAll, isPending: logoutAllMutation.isPending };
}
