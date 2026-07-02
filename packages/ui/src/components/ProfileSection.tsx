import { useEffect, useMemo, useState } from "react";
import {
  createAddressApi,
  deleteAddressApi,
  getMyAddressesApi,
  getMyProfileApi,
  setDefaultAddressApi,
  updateAddressApi,
  updateMyProfileApi,
  type AddressPayload,
  type AddressResponse,
  type ProfileResponse,
  type ProfileUpdatePayload,
} from "@ecomm/profile";

const emptyAddress: AddressPayload = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
  addressType: "HOME",
  isDefault: false,
};

const pincodePattern = /^\d{6}$/;

export default function ProfileSection() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    profilePictureUrl: "",
  });
  const [addressForm, setAddressForm] = useState<AddressPayload>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileData, addressData] = await Promise.all([
        getMyProfileApi(),
        getMyAddressesApi(),
      ]);
      setProfile(profileData);
      setAddresses(addressData);
      setProfileForm({
        firstName: profileData.firstName ?? "",
        lastName: profileData.lastName ?? "",
        phoneNumber: profileData.phoneNumber ?? "",
        dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split("T")[0] : "",
        profilePictureUrl: profileData.profilePictureUrl ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    const points = [profile.firstName, profile.lastName, profile.phoneNumber].filter(Boolean).length;
    return Math.round((points / 3) * 100);
  }, [profile]);

  const validateAddress = (values: AddressPayload) => {
    const nextErrors: Record<string, string> = {};
    if (!values.addressLine1.trim()) nextErrors.addressLine1 = "Address line 1 is required";
    if (!values.city.trim()) nextErrors.city = "City is required";
    if (!values.state.trim()) nextErrors.state = "State is required";
    if (!values.country.trim()) nextErrors.country = "Country is required";
    if (!pincodePattern.test(values.pincode)) nextErrors.pincode = "Pincode must be exactly 6 digits";
    return nextErrors;
  };

  const saveProfile = async () => {
    const payload: ProfileUpdatePayload = {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phoneNumber: profileForm.phoneNumber,
      dateOfBirth: profileForm.dateOfBirth || undefined,
      profilePictureUrl: profileForm.profilePictureUrl || undefined,
    };

    try {
      setSaving(true);
      setError(null);
      const updatedProfile = await updateMyProfileApi(payload);
      setProfile(updatedProfile);
      setSuccess("Profile updated successfully.");
      setEditingProfile(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const saveAddress = async () => {
    const nextErrors = validateAddress(addressForm);
    setAddressErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSaving(true);
      setError(null);
      if (editingAddressId) {
        const updated = await updateAddressApi(editingAddressId, addressForm);
        setAddresses((current) => current.map((item) => (item.id === editingAddressId ? updated : item)));
        setSuccess("Address updated successfully.");
      } else {
        const created = await createAddressApi(addressForm);
        setAddresses((current) => [created, ...current]);
        setSuccess("Address created successfully.");
      }
      setAddressForm(emptyAddress);
      setEditingAddressId(null);
      setAddressErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save address.");
    } finally {
      setSaving(false);
    }
  };

  const startEditAddress = (item: AddressResponse) => {
    setEditingAddressId(item.id);
    setAddressForm({
      addressLine1: item.addressLine1,
      addressLine2: item.addressLine2 ?? "",
      city: item.city,
      state: item.state,
      country: item.country,
      pincode: item.pincode,
      addressType: item.addressType,
      isDefault: item.isDefault,
    });
    setAddressErrors({});
  };

  const deleteAddress = async (addressId: number) => {
    try {
      setSaving(true);
      await deleteAddressApi(addressId);
      setAddresses((current) => current.filter((item) => item.id !== addressId));
      setSuccess("Address removed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete address.");
    } finally {
      setSaving(false);
    }
  };

  const markAsDefault = async (addressId: number) => {
    try {
      setSaving(true);
      const updated = await setDefaultAddressApi(addressId);
      setAddresses((current) => current.map((item) => ({ ...item, isDefault: item.id === updated.id })));
      setSuccess("Default address updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update default address.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading your profile…</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">My Profile</p>
            <h2 className="text-2xl font-semibold text-gray-900">Personal information</h2>
            <p className="mt-1 text-sm text-gray-500">Keep your account details and delivery addresses up to date.</p>
          </div>
          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Profile complete: {profileCompletion}%
          </div>
        </div>

        {error ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Profile details</h3>
              {!editingProfile ? (
                <button onClick={() => setEditingProfile(true)} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Edit
                </button>
              ) : null}
            </div>

            {!editingProfile ? (
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div><span className="font-medium text-gray-500">Name:</span> {profile?.firstName} {profile?.lastName}</div>
                <div><span className="font-medium text-gray-500">Phone:</span> {profile?.phoneNumber || "—"}</div>
                <div><span className="font-medium text-gray-500">Date of birth:</span> {profile?.dateOfBirth ? profile.dateOfBirth.split("T")[0] : "—"}</div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-500">Picture:</span>
                  {profile?.profilePictureUrl ? (
                    <img
                      src={profile.profilePictureUrl}
                      alt="Profile"
                      className="h-14 w-14 rounded-full border border-gray-200 object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <input className="w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="First name" value={profileForm.firstName} onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))} />
                <input className="w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="Last name" value={profileForm.lastName} onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))} />
                <input className="w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="Phone number" value={profileForm.phoneNumber} onChange={(e) => setProfileForm((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
                <input type="date" className="w-full rounded-xl border border-gray-300 px-3 py-2" value={profileForm.dateOfBirth} onChange={(e) => setProfileForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))} />
                <input className="w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="Profile picture URL" value={profileForm.profilePictureUrl} onChange={(e) => setProfileForm((prev) => ({ ...prev, profilePictureUrl: e.target.value }))} />
                <div className="flex gap-3">
                  <button onClick={saveProfile} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {saving ? "Saving..." : "Save profile"}
                  </button>
                  <button onClick={() => { setEditingProfile(false); setSuccess(null); }} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-lg font-semibold text-gray-900">Address book</h3>
            <p className="mt-1 text-sm text-gray-500">Manage saved addresses for fast checkout.</p>
            <div className="mt-4 space-y-3">
              {addresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">No addresses yet.</div>
              ) : (
                addresses.map((item) => (
                  <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.addressType}</p>
                        <p className="text-sm text-gray-600">{item.addressLine1}{item.addressLine2 ? `, ${item.addressLine2}` : ""}</p>
                        <p className="text-sm text-gray-600">{item.city}, {item.state} {item.pincode}</p>
                        <p className="text-sm text-gray-600">{item.country}</p>
                        {item.isDefault ? <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Default</span> : null}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <button onClick={() => startEditAddress(item)} className="text-blue-600">Edit</button>
                        <button onClick={() => void deleteAddress(item.id)} className="text-red-600">Delete</button>
                        {!item.isDefault ? <button onClick={() => void markAsDefault(item.id)} className="text-emerald-600">Set default</button> : null}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{editingAddressId ? "Update address" : "Add a new address"}</h3>
            <p className="text-sm text-gray-500">Use a valid 6-digit pincode and choose a label for the address.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-gray-300 px-3 py-2" placeholder="Address line 1" value={addressForm.addressLine1} onChange={(e) => setAddressForm((prev: AddressPayload) => ({ ...prev, addressLine1: e.target.value }))} />
          {addressErrors.addressLine1 ? <p className="text-sm text-red-600 md:col-span-2">{addressErrors.addressLine1}</p> : null}
          <input className="rounded-xl border border-gray-300 px-3 py-2" placeholder="Address line 2" value={addressForm.addressLine2} onChange={(e) => setAddressForm((prev: AddressPayload) => ({ ...prev, addressLine2: e.target.value }))} />
          <input className="rounded-xl border border-gray-300 px-3 py-2" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm((prev: AddressPayload) => ({ ...prev, city: e.target.value }))} />
          {addressErrors.city ? <p className="text-sm text-red-600">{addressErrors.city}</p> : null}
          <input className="rounded-xl border border-gray-300 px-3 py-2" placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm((prev: AddressPayload) => ({ ...prev, state: e.target.value }))} />
          {addressErrors.state ? <p className="text-sm text-red-600">{addressErrors.state}</p> : null}
          <input className="rounded-xl border border-gray-300 px-3 py-2" placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm((prev: AddressPayload) => ({ ...prev, country: e.target.value }))} />
          {addressErrors.country ? <p className="text-sm text-red-600">{addressErrors.country}</p> : null}
          <input className="rounded-xl border border-gray-300 px-3 py-2" placeholder="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm((prev: AddressPayload) => ({ ...prev, pincode: e.target.value }))} />
          {addressErrors.pincode ? <p className="text-sm text-red-600">{addressErrors.pincode}</p> : null}
          <select className="rounded-xl border border-gray-300 px-3 py-2" value={addressForm.addressType} onChange={(e) => setAddressForm((prev: AddressPayload) => ({ ...prev, addressType: e.target.value as AddressPayload["addressType"] }))}>
            <option value="HOME">Home</option>
            <option value="WORK">Work</option>
            <option value="OTHER">Other</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm((prev: AddressPayload) => ({ ...prev, isDefault: e.target.checked }))} />
            Set as default address
          </label>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={() => void saveAddress()} disabled={saving} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            {saving ? "Saving..." : editingAddressId ? "Update address" : "Add address"}
          </button>
          <button onClick={() => { setEditingAddressId(null); setAddressForm(emptyAddress); setAddressErrors({}); }} className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
