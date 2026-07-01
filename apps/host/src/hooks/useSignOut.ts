import { useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@ecomm/auth";
import { useCartStore, cartKeys } from "@ecomm/cart";

export function useSignOut() {
  const queryClient = useQueryClient();
  const logoutMutation = useLogout();

  const signOut = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: cartKeys.all });
        useCartStore.getState().clearCart();
      },
    });
  };

  return { signOut, isPending: logoutMutation.isPending };
}
