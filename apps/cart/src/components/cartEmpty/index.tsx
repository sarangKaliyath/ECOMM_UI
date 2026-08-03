import { PackageSearch } from "lucide-react";

const CartEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
      <PackageSearch size={56} strokeWidth={1.2} />
      <p className="text-base font-medium">Your cart is empty</p>
      <p className="text-sm">Add products from the catalog to get started</p>
    </div>
  );
};

export default CartEmpty;
