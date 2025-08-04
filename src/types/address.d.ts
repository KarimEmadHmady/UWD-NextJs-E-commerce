// src/types/address.d.ts
export interface Address {
  id: number | string;
  first_name?: string;
  last_name?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  address_1?: string;
  address_2?: string;
  street?: string;
  city?: string;
  state?: string;
  region?: string;
  postcode?: string;
  country?: string;
  is_default?: boolean;
  isDefault?: boolean;
  address_type?: 'billing' | 'shipping' | 'both';
  latitude?: number;
  longitude?: number;
  address?: string;
  notes?: string;
  label?: string;
  userId?: string | number;
}

export interface AddressFormData {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  is_default: boolean;
  address_type: 'billing' | 'shipping' | 'both';
} 