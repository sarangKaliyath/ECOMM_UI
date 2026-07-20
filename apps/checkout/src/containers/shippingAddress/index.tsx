import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { useGetMyAddresses } from "@ecomm/profile";
import { getAuthErrorMessage } from "@ecomm/auth";
import { toast } from "@ecomm/ui";
import AddressCard from "./AddressCard";

const ShippingAddress = () => {
  const { data: addresses, isLoading, isError, error, refetch } = useGetMyAddresses();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const toastedError = useRef(false);

  useEffect(() => {
    if (!addresses || addresses.length === 0 || selectedId !== null) return;
    const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
    setSelectedId(defaultAddress.id);
  }, [addresses, selectedId]);

  useEffect(() => {
    if (isError && !toastedError.current) {
      toastedError.current = true;
      toast.error(getAuthErrorMessage(error, "Unable to load your saved addresses."));
    }
    if (!isError) {
      toastedError.current = false;
    }
  }, [isError, error]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-blue-600" />
        <h2 className="text-base font-bold text-gray-900">Shipping Address</h2>
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-400 py-6 text-center">Loading addresses…</div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-red-600">{getAuthErrorMessage(error, "Unable to load your saved addresses.")}</p>
          <button onClick={() => refetch()} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            Try again
          </button>
        </div>
      ) : !addresses || addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-gray-500">No saved addresses</p>
          <button
            onClick={() => {
              window.location.href = "/profile";
            }}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Add an address
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Shipping address">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              selected={selectedId === address.id}
              onSelect={() => setSelectedId(address.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingAddress;
