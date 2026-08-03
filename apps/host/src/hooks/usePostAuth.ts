import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { mergeCartApi, useCartStore, cartKeys } from "@ecomm/cart";

export function usePostAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const postAuth = async () => {
    try {
      const { data } = await mergeCartApi();
      queryClient.setQueryData(cartKeys.userCart(), data);
      useCartStore.getState().setItems(
        data.cartItems.map((item) => ({
          id: item.productId,
          name: item.productName,
          price: item.priceSnapshot,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
      );
    } catch {
      // non-fatal
    }
    navigate({ to: "/" });
  };

  return postAuth;
}
