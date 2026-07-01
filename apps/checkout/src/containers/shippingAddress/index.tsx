import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Address } from "../../types/order";

const emptyAddress: Address = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  phone: "",
};

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
const labelClass = "text-sm font-medium text-gray-700";

const ShippingAddress = () => {
  const [address, setAddress] = useState<Address>(emptyAddress);

  const handleChange = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-blue-600" />
        <h2 className="text-base font-bold text-gray-900">Shipping Address</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass}>Full Name</label>
          <input
            className={inputClass}
            placeholder="John Doe"
            value={address.fullName}
            onChange={handleChange("fullName")}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass}>Address Line 1</label>
          <input
            className={inputClass}
            placeholder="Street address"
            value={address.line1}
            onChange={handleChange("line1")}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass}>Address Line 2 (optional)</label>
          <input
            className={inputClass}
            placeholder="Apartment, suite, etc."
            value={address.line2}
            onChange={handleChange("line2")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>City</label>
          <input className={inputClass} placeholder="City" value={address.city} onChange={handleChange("city")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>State</label>
          <input className={inputClass} placeholder="State" value={address.state} onChange={handleChange("state")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Postal Code</label>
          <input
            className={inputClass}
            placeholder="Postal code"
            value={address.postalCode}
            onChange={handleChange("postalCode")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            className={inputClass}
            placeholder="Phone number"
            value={address.phone}
            onChange={handleChange("phone")}
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
