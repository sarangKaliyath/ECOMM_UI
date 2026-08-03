import { useEffect, useState } from "react";
import { useCartStore, useGetCartItems, useCartSync } from "@ecomm/cart";
import type { CartItem } from "@ecomm/cart";
import { useAuthStore } from "@ecomm/auth";
import { useNavigationStore } from "@ecomm/navigation";
import { LoginPromptModal } from "@ecomm/ui";
import {
  CartCheckout,
  CartEmpty,
  CartHeader,
  CartItemRow,
} from "../../components";

const CartWallet = () => {
  const items = useCartStore((s) => s.items);
  const setItems = useCartStore((s) => s.setItems);
  const { clearCart } = useCartSync();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { data, isLoading, isError } = useGetCartItems();

  useEffect(() => {
    if (!data?.cartItems) return;
    const mapped: CartItem[] = data.cartItems.map(
      (item: {
        productId: string | number;
        productName: string;
        priceSnapshot: number;
        quantity: number;
        imageUrl: string;
      }) => ({
        id: item.productId,
        name: item.productName,
        price: item.priceSnapshot,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })
    );
    setItems(mapped);
  }, [data, setItems]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading cart…
      </div>
    );

  if (isError)
    return (
      <div className="h-screen flex items-center justify-center text-red-400">
        Failed to load cart.
      </div>
    );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = () => {
    if (isAuthenticated) {
      useNavigationStore.getState().navigate("/checkout");
    } else {
      setShowLoginPrompt(true);
    }
  };

  return (
    <div className="h-screen bg-gray-50 p-6 flex flex-col overflow-hidden">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 overflow-hidden">
        <CartHeader
          items={items}
          totalItems={totalItems}
          clearCart={() => clearCart()}
        />

        {items.length === 0 ? (
          <CartEmpty />
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden min-h-0">
            <div className="flex flex-col gap-3 mb-6 overflow-y-auto flex-1 min-h-0">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
            <CartCheckout
              totalItems={totalItems}
              totalPrice={totalPrice}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>

      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => useNavigationStore.getState().navigate("/login")}
        message="You need to be logged in to proceed to checkout."
      />
    </div>
  );
};

export default CartWallet;
