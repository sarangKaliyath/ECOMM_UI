export interface AddressResponse {
  id: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  addressType: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
}

export interface ProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  profilePictureUrl?: string | null;
  addresses: AddressResponse[];
}

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  profilePictureUrl?: string;
}

export interface AddressPayload {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  addressType: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
}
