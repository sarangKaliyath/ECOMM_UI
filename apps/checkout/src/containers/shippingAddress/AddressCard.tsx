import { useState, type MouseEvent } from "react";
import { Home, Briefcase, MapPin as MapPinIcon, Pencil, Trash2 } from "lucide-react";
import { getAuthErrorMessage } from "@ecomm/auth";
import { toast } from "@ecomm/ui";
import { useUpdateAddress, useDeleteAddress } from "@ecomm/profile";
import type { AddressPayload, AddressResponse } from "@ecomm/profile";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all";
const labelClass = "text-xs font-medium text-gray-600";

const addressTypeMeta: Record<AddressResponse["addressType"], { label: string; icon: typeof Home }> = {
  HOME: { label: "Home", icon: Home },
  WORK: { label: "Work", icon: Briefcase },
  OTHER: { label: "Other", icon: MapPinIcon },
};

const pincodePattern = /^\d{6}$/;

const toPayload = (address: AddressResponse): AddressPayload => ({
  addressLine1: address.addressLine1,
  addressLine2: address.addressLine2 ?? "",
  city: address.city,
  state: address.state,
  country: address.country,
  pincode: address.pincode,
  addressType: address.addressType,
  isDefault: address.isDefault,
});

const validate = (values: AddressPayload) => {
  const errors: Record<string, string> = {};
  if (!values.addressLine1.trim()) errors.addressLine1 = "Address line 1 is required";
  if (!values.city.trim()) errors.city = "City is required";
  if (!values.state.trim()) errors.state = "State is required";
  if (!values.country.trim()) errors.country = "Country is required";
  if (!pincodePattern.test(values.pincode)) errors.pincode = "Pincode must be 6 digits";
  return errors;
};

interface Props {
  address: AddressResponse;
  selected: boolean;
  onSelect: () => void;
}

const AddressCard = ({ address, selected, onSelect }: Props) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<AddressPayload>(() => toPayload(address));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddress = useUpdateAddress((err) =>
    toast.error(getAuthErrorMessage(err, "Unable to update address.")),
  );
  const deleteAddress = useDeleteAddress((err) =>
    toast.error(getAuthErrorMessage(err, "Unable to delete address.")),
  );

  const { label, icon: Icon } = addressTypeMeta[address.addressType];

  const stop = (e: MouseEvent) => e.stopPropagation();

  const startEdit = (e: MouseEvent) => {
    stop(e);
    setForm(toPayload(address));
    setErrors({});
    setEditing(true);
  };

  const cancelEdit = (e: MouseEvent) => {
    stop(e);
    setEditing(false);
  };

  const handleSave = (e: MouseEvent) => {
    stop(e);
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateAddress.mutate(
      { addressId: address.id, payload: form },
      {
        onSuccess: () => {
          toast.success("Address updated");
          setEditing(false);
        },
      },
    );
  };

  const handleDelete = (e: MouseEvent) => {
    stop(e);
    if (!window.confirm("Delete this address?")) return;
    deleteAddress.mutate(address.id, {
      onSuccess: () => toast.success("Address removed"),
    });
  };

  if (editing) {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className={labelClass}>Address Line 1</label>
            <input
              className={inputClass}
              value={form.addressLine1}
              onChange={(e) => setForm((prev) => ({ ...prev, addressLine1: e.target.value }))}
            />
            {errors.addressLine1 && <p className="text-xs text-red-600">{errors.addressLine1}</p>}
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className={labelClass}>Address Line 2 (optional)</label>
            <input
              className={inputClass}
              value={form.addressLine2}
              onChange={(e) => setForm((prev) => ({ ...prev, addressLine2: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>City</label>
            <input
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
            />
            {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>State</label>
            <input
              className={inputClass}
              value={form.state}
              onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
            />
            {errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Country</label>
            <input
              className={inputClass}
              value={form.country}
              onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
            />
            {errors.country && <p className="text-xs text-red-600">{errors.country}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Pincode</label>
            <input
              className={inputClass}
              value={form.pincode}
              onChange={(e) => setForm((prev) => ({ ...prev, pincode: e.target.value }))}
            />
            {errors.pincode && <p className="text-xs text-red-600">{errors.pincode}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Type</label>
            <select
              className={inputClass}
              value={form.addressType}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, addressType: e.target.value as AddressPayload["addressType"] }))
              }
            >
              <option value="HOME">Home</option>
              <option value="WORK">Work</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
            />
            Set as default address
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={updateAddress.isPending}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {updateAddress.isPending ? "Saving..." : "Save"}
          </button>
          <button
            onClick={cancelEdit}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      className={`cursor-pointer rounded-xl border p-4 transition-all ${
        selected ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/30" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <Icon size={16} className="text-gray-400 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
              {address.isDefault && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-gray-800 mt-1">
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ""}
            </p>
            <p className="text-sm text-gray-600">
              {address.city}, {address.state} {address.pincode}
            </p>
            <p className="text-sm text-gray-600">{address.country}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={startEdit}
            aria-label="Edit address"
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDelete}
            aria-label="Delete address"
            disabled={deleteAddress.isPending}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
